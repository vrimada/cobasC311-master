import winston from 'winston';
import { SerialPort } from 'serialport';
import { Buffer } from 'node:buffer';

// Internal Dependencies
import { comPort  }  from './config';
import { ENCODING, ENQ, ACK, NAK, EOT, STX } from './Utils/constants';
import { isChunkedMessage, encode, decodeMessage } from './Utils/codec';
import { processResultRecords, composeOrderMessages } from './Utils/app'
import { traerProximoProtocolParaEnviar, removeLastProtocolSent, tieneProtocolosParaEnviar  } from './Utils/db';
import { Records } from './Utils/Records/Records';
import { TempProtocoloEnvio } from './Utils/TempProtocoloEnvio';


// Global variables for Client and Server mode
let isTransferState = false;
let isClientMode = false;
let port : SerialPort; // COM Port Communication
let logger : winston.Logger;
iniciar();

function iniciar() : void {
    iniciarLog();
    //baudRate 9600 es la recomendada segun el PDF de COBAS
    //path es el nombre del puerto que esta configurado en config con el nombre comPort
   port = new SerialPort({ path: comPort, baudRate: 9600}); 
   iniciarPuerto(port);
}

function iniciarLog(){// Para crear los logs
    logger = winston.createLogger({
    level: 'info',
    format:
        winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Formato de la fecha
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`; // Combina la fecha, nivel y mensaje
        })
      ),
    transports: [
      new winston.transports.File({ filename: 'Log-protocol-error.log', level: 'error' }),// - Write all logs with importance level of `error` or higher to `error.log`
      new winston.transports.File({ filename: 'Log-protocol-info.log' }),// - Write all logs with importance level of `info` 
    ],
  });
  
}

function iniciarPuerto(port : SerialPort ): void {
    port.on('open', gestionarPuertoAbierto);
    port.on('close', gestionarPuertoCerrado);
    port.on('data', gestionarPuertoDatos);
    port.on('error', function (err) {
        logger.error(err.message);
        throw new Error('Port Error: ' + err.message);
    });
}

function gestionarPuertoAbierto() : void {
    logger.info('Port open. Data rate: ' + port.baudRate);
    logger.info('Port Path: ' + port.path);
}

function gestionarPuertoCerrado() : void {
    logger.info('Port Closed.');
}

function gestionarPuertoParaEscribir(data : string | undefined) : void {
    logger.info(data);
    port.write(data);
    iniciarTimer();
}

function gestionarPuertoDatos(data : Buffer) : void {
    logger.info(data); // Raw Buffer Data
    let buf : string = data.toString('ascii');
    //logger.info(buf); // Raw Buffer Data toString

    if (isTransferState) {
        if (isClientMode) {
            leerDatosComoCliente(buf);
        }
        else {
            readDataAsServer(buf);
        }
    }
    else {
        readDataAsServer(buf);
    }
}

// #region ServerMode_envio_datos_de_cobas_a_sil
////////////////// SERVER MODE //////////////////////

let inputChunks : string[] = [];

function readDataAsServer(data : string) : void {
    let response : string = '';

    switch(data){
        case ENQ:{
            logger.info('Request: ENQ');
            if (!isTransferState) {
                isTransferState = true;
                response = ACK;
            }
            else {
               
                logger.error(' ENQ is not expected. Transfer state already.');
                response = NAK;
            }
        } break;

        case ACK: {
           
            logger.error(' ACK is not expected.');
            throw new Error('ACK is not expected.');
        } break;

        case NAK: {
           
            logger.error(' NAK is not expected.');
            throw new Error('NAK is not expected.');
        } break;

        case EOT: {
            if (isTransferState) {
                isTransferState = false;
                logger.info('EOT accepted. OK');
            }
            else {
               
                logger.error(' Not ready to accept EOT message.');
                throw new Error('Not ready to accept EOT message.');
            }
        } break;
        
        default: 
            if (data.startsWith(STX)) {
                if (!isTransferState) {
                    discard_input_buffers();
                   
                    logger.error(' Not ready to accept messages');
                    response = NAK;
                }
                else {
                    try {
                        logger.info('Accept message.Handling message');
                        handleMessage(data);
                        response = ACK;
                    }
                    catch (err) {
                       
                        logger.error(' Error occurred on message handling.' + err)
                        response = NAK;
                    }
                }
            }
            else {
               
                logger.error(' Invalid data.');
                throw new Error('Invalid data.');
            }break;
       }
    gestionarPuertoParaEscribir(response);
};

function handleMessage(message : string) {
    if (isChunkedMessage(message)) {
        logger.debug('handleMessage: Is chunked transfer.');
        inputChunks.push(message);
    }
    else if (typeof inputChunks !== 'undefined' && inputChunks.length > 0) {
        logger.debug('handleMessage: Previous chunks. This must be the last one');
        inputChunks.push(message);
        dispatchMessage(inputChunks.join(''), ENCODING);
        inputChunks = [];
    }
    else {
        logger.debug('handleMessage: Complete message. Dispatching');
        dispatchMessage(message, ENCODING);
    }
}

function dispatchMessage(message : string, enconding?: string) {
    logger.info(message);

    // Pasa el mensaje de Cobas al tipo Records
    let records : Records = decodeMessage(message);
    
    //Envia el mensaje a SIL Multifector
    processResultRecords(records);
}

function discard_input_buffers() {
    inputChunks = [];
}

//#endregion


// #region ClientMode_envio_datos_de_sil_a_cobas
////////////////// CLIENT MODE //////////////////////

let outputChunks : string[] = [];
let outputMessages : Records;
let retryCounter : number = 0;
let lastSendOk : boolean = false;
let lastSendData : string | undefined = "";
let timer : NodeJS.Timeout;

function leerDatosComoCliente(data : string) {
    switch(data){
        case ENQ : 
            logger.error(' Client should not receive ENQ.');
            throw new Error('Client should not receive ENQ.'); break;
        case ACK :
            logger.debug('ACK Response');
            lastSendOk = true;
            try {
                sendMessage();
            }
            catch (error) {
                logger.error(' '+error);
                cerrarSesionDelCliente();
            }
        break;
        case NAK : // Handles NAK response from server.
        // The client tries to repeat last send for allowed amount of attempts. 
        logger.debug('NAK Response');
        if (lastSendData === ENQ) {
            abrirSesionDelCliente();
        }
        else {
            try {
                lastSendOk = false;
                sendMessage();
            }
            catch (error) {
                cerrarSesionDelCliente();
            }
        }
        break;

        case EOT:
            isTransferState = false;
            logger.error('Client should not receive EOT.');
            throw new Error('Client should not receive EOT.');
        break;

        case (data.startsWith(STX) ? 'STX' : ''):
            isTransferState = false;
            logger.error('Client should not receive ASTM message.');
            throw new Error('Client should not receive ASTM message.');
        break;

        default :
        logger.error('Invalid data.');
        throw new Error('Invalid data.'); break;
    }
}

function prepararMensajesAEnviar(protocol : TempProtocoloEnvio) {
    outputMessages = new Records();
    outputMessages = composeOrderMessages(protocol);
}

function prepararMensajesParaCodificar() {
    outputChunks = [];
    outputChunks  = encode(outputMessages);
}

function sendMessage() {
    if (lastSendData === ENQ) {
        if (outputMessages) {
            // Still exists messages to send
            prepararMensajesParaCodificar();
            enviarDatos();
        }
        else {
           
            traerProximoProtocolParaEnviar().then(function (row : any) {
                if(row){ 
                    let protocol  : TempProtocoloEnvio = new TempProtocoloEnvio();
                    protocol.cargar(row);
                    prepararMensajesAEnviar(protocol)
                    prepararMensajesParaCodificar();
                    enviarDatos();
                }else{
                    logger.error(" Something bad happened: No levanto los datos de la base de datos");
                }
            }, function (err) {
                logger.error(" Something bad happened:", err);
            });
        }
    }
    else {
        enviarDatos();
    }
}

function enviarDatos() {
    if (!lastSendOk) {
        if (retryCounter > 6) {
            cerrarSesionDelCliente();
            if (lastSendData !== ENQ) {
                // Remove last protocol to send to prevent future problems with 
                // the same protocol
                removeLastProtocolSent();
            }
            return;
        }
        else {
            retryCounter = retryCounter + 1;
        }
    }
    else {
        retryCounter = 0;
        if (outputChunks.length > 0) {
            lastSendData = outputChunks.shift();
        }
        else {
            cerrarSesionDelCliente();
            if (outputMessages) {
                abrirSesionDelCliente();
            }
            else {
                removeLastProtocolSent();
            }
            return;
        }
    }
    gestionarPuertoParaEscribir(lastSendData);
}


function abrirSesionDelCliente() {
    logger.info('Open Client Session');
    retryCounter = retryCounter + 1;
    if (retryCounter > 6) {
       
        logger.error(' Exceed number of retries');
        cerrarSesionDelCliente();
    }
    else {
        gestionarPuertoParaEscribir(ENQ);
        lastSendData = ENQ;
        isTransferState = true;
        isClientMode = true;
    }
}

function cerrarSesionDelCliente() {
    logger.debug('Close Client Session');
    gestionarPuertoParaEscribir(EOT);
    isTransferState = false;
    isClientMode = false;
    retryCounter = 0;
}

function verificarDataAEnviar() {
    tieneProtocolosParaEnviar().then(function (results : any) {
        if (results[0].total > 0) {
            logger.info("Exist data to send");
            if (!isClientMode) {
                abrirSesionDelCliente();
            }
        }else {
            if (isClientMode) {
                isClientMode = false;
            }else {
                return;
            }
        }
    }, function (err : any) {
        logger.error(" Something bad happened:", err);
    });
}

function iniciarTimer() {
    clearTimeout(timer);
    timer = setTimeout(timeoutCommunication, 5000);
}

function timeoutCommunication() {
    if (isTransferState) {
        logger.error(' Timeout Communication');
        throw new Error('Timeout Communication');
    }
}

function runIntervalCheck() {
    setInterval(verificarDataAEnviar, 10000);
};


runIntervalCheck();

// #endregion