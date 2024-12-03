"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const serialport_1 = require("serialport");
// Internal Dependencies
const config_1 = require("./config");
const constants_1 = require("./Utils/constants");
const codec_1 = require("./Utils/codec");
const app_1 = require("./Utils/app");
const db_1 = require("./Utils/db");
const Records_1 = require("./Utils/Records/Records");
const TempProtocoloEnvio_1 = require("./Utils/TempProtocoloEnvio");
// Global variables for Client and Server mode
let isTransferState = false;
let isClientMode = false;
let port; // COM Port Communication
let logger;
iniciar();
function iniciar() {
    iniciarLog();
    //baudRate 9600 es la recomendada segun el PDF de COBAS
    //path es el nombre del puerto que esta configurado en config con el nombre comPort
    port = new serialport_1.SerialPort({ path: config_1.comPort, baudRate: 9600 });
    iniciarPuerto(port);
}
function iniciarLog() {
    logger = winston_1.default.createLogger({
        level: 'info',
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Formato de la fecha
        winston_1.default.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`; // Combina la fecha, nivel y mensaje
        })),
        transports: [
            new winston_1.default.transports.File({ filename: 'Log-protocol-error.log', level: 'error' }), // - Write all logs with importance level of `error` or higher to `error.log`
            new winston_1.default.transports.File({ filename: 'Log-protocol-info.log' }), // - Write all logs with importance level of `info` 
        ],
    });
}
function iniciarPuerto(port) {
    port.on('open', gestionarPuertoAbierto);
    port.on('close', gestionarPuertoCerrado);
    port.on('data', gestionarPuertoDatos);
    port.on('error', function (err) {
        logger.error(err.message);
        throw new Error('Port Error: ' + err.message);
    });
}
function gestionarPuertoAbierto() {
    logger.info('Port open. Data rate: ' + port.baudRate);
    logger.info('Port Path: ' + port.path);
}
function gestionarPuertoCerrado() {
    logger.info('Port Closed.');
}
function gestionarPuertoParaEscribir(data) {
    logger.info(data);
    port.write(data);
    iniciarTimer();
}
function gestionarPuertoDatos(data) {
    logger.info(data); // Raw Buffer Data
    let buf = data.toString('ascii');
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
let inputChunks = [];
function readDataAsServer(data) {
    let response = '';
    switch (data) {
        case constants_1.ENQ:
            {
                logger.info('Request: ENQ');
                if (!isTransferState) {
                    isTransferState = true;
                    response = constants_1.ACK;
                }
                else {
                    logger.error(' ENQ is not expected. Transfer state already.');
                    response = constants_1.NAK;
                }
            }
            break;
        case constants_1.ACK:
            {
                logger.error(' ACK is not expected.');
                throw new Error('ACK is not expected.');
            }
            break;
        case constants_1.NAK:
            {
                logger.error(' NAK is not expected.');
                throw new Error('NAK is not expected.');
            }
            break;
        case constants_1.EOT:
            {
                if (isTransferState) {
                    isTransferState = false;
                    logger.info('EOT accepted. OK');
                }
                else {
                    logger.error(' Not ready to accept EOT message.');
                    throw new Error('Not ready to accept EOT message.');
                }
            }
            break;
        default:
            if (data.startsWith(constants_1.STX)) {
                if (!isTransferState) {
                    discard_input_buffers();
                    logger.error(' Not ready to accept messages');
                    response = constants_1.NAK;
                }
                else {
                    try {
                        logger.info('Accept message.Handling message');
                        handleMessage(data);
                        response = constants_1.ACK;
                    }
                    catch (err) {
                        logger.error(' Error occurred on message handling.' + err);
                        response = constants_1.NAK;
                    }
                }
            }
            else {
                logger.error(' Invalid data.');
                throw new Error('Invalid data.');
            }
            break;
    }
    gestionarPuertoParaEscribir(response);
}
;
function handleMessage(message) {
    if ((0, codec_1.isChunkedMessage)(message)) {
        logger.debug('handleMessage: Is chunked transfer.');
        inputChunks.push(message);
    }
    else if (typeof inputChunks !== 'undefined' && inputChunks.length > 0) {
        logger.debug('handleMessage: Previous chunks. This must be the last one');
        inputChunks.push(message);
        dispatchMessage(inputChunks.join(''), constants_1.ENCODING);
        inputChunks = [];
    }
    else {
        logger.debug('handleMessage: Complete message. Dispatching');
        dispatchMessage(message, constants_1.ENCODING);
    }
}
function dispatchMessage(message, enconding) {
    logger.info(message);
    // Pasa el mensaje de Cobas al tipo Records
    let records = (0, codec_1.decodeMessage)(message);
    //Envia el mensaje a SIL Multifector
    (0, app_1.processResultRecords)(records);
}
function discard_input_buffers() {
    inputChunks = [];
}
//#endregion
// #region ClientMode_envio_datos_de_sil_a_cobas
////////////////// CLIENT MODE //////////////////////
let outputChunks = [];
let outputMessages;
let retryCounter = 0;
let lastSendOk = false;
let lastSendData = "";
let timer;
function leerDatosComoCliente(data) {
    switch (data) {
        case constants_1.ENQ:
            logger.error(' Client should not receive ENQ.');
            throw new Error('Client should not receive ENQ.');
            break;
        case constants_1.ACK:
            logger.debug('ACK Response');
            lastSendOk = true;
            try {
                sendMessage();
            }
            catch (error) {
                logger.error(' ' + error);
                cerrarSesionDelCliente();
            }
            break;
        case constants_1.NAK: // Handles NAK response from server.
            // The client tries to repeat last send for allowed amount of attempts. 
            logger.debug('NAK Response');
            if (lastSendData === constants_1.ENQ) {
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
        case constants_1.EOT:
            isTransferState = false;
            logger.error('Client should not receive EOT.');
            throw new Error('Client should not receive EOT.');
            break;
        case (data.startsWith(constants_1.STX) ? 'STX' : ''):
            isTransferState = false;
            logger.error('Client should not receive ASTM message.');
            throw new Error('Client should not receive ASTM message.');
            break;
        default:
            logger.error('Invalid data.');
            throw new Error('Invalid data.');
            break;
    }
}
function prepararMensajesAEnviar(protocol) {
    outputMessages = new Records_1.Records();
    outputMessages = (0, app_1.composeOrderMessages)(protocol);
}
function prepararMensajesParaCodificar() {
    outputChunks = [];
    outputChunks = (0, codec_1.encode)(outputMessages);
}
function sendMessage() {
    if (lastSendData === constants_1.ENQ) {
        if (outputMessages) {
            // Still exists messages to send
            prepararMensajesParaCodificar();
            enviarDatos();
        }
        else {
            (0, db_1.traerProximoProtocolParaEnviar)().then(function (row) {
                if (row) {
                    let protocol = new TempProtocoloEnvio_1.TempProtocoloEnvio();
                    protocol.cargar(row);
                    prepararMensajesAEnviar(protocol);
                    prepararMensajesParaCodificar();
                    enviarDatos();
                }
                else {
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
            if (lastSendData !== constants_1.ENQ) {
                // Remove last protocol to send to prevent future problems with 
                // the same protocol
                (0, db_1.removeLastProtocolSent)();
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
                (0, db_1.removeLastProtocolSent)();
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
        gestionarPuertoParaEscribir(constants_1.ENQ);
        lastSendData = constants_1.ENQ;
        isTransferState = true;
        isClientMode = true;
    }
}
function cerrarSesionDelCliente() {
    logger.debug('Close Client Session');
    gestionarPuertoParaEscribir(constants_1.EOT);
    isTransferState = false;
    isClientMode = false;
    retryCounter = 0;
}
function verificarDataAEnviar() {
    (0, db_1.tieneProtocolosParaEnviar)().then(function (results) {
        if (results[0].total > 0) {
            logger.info("Exist data to send");
            if (!isClientMode) {
                abrirSesionDelCliente();
            }
        }
        else {
            if (isClientMode) {
                isClientMode = false;
            }
            else {
                return;
            }
        }
    }, function (err) {
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
}
;
runIntervalCheck();
// #endregion
