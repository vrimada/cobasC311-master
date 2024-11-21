import logger from 'winston';
import SerialPort from 'serialport';
// Internal Dependencies
import { logLevel } from 'Utils/config.js';
import { ENCODING, ENQ, ACK, NAK, EOT, STX } from 'Utils/constants.js';
import { isChunkedMessage, encode, decodeMessage } from 'Utils/codec.js';
import { processResultRecords, composeOrderMessages } from 'Utils/app.js';
import { getNextProtocolToSend, removeLastProtocolSent, hasProtocolsToSend } from 'Utils/db.js';
// Init logging
logger.level = logLevel;
// Global variables for Client and Server mode
let isTransferState = false;
let isClientMode = false;
let port = null; // COM Port Communication
init();
function init() {
    SerialPort.list(function (err, ports) {
        initPort(err, ports);
    });
}
function initPort(err, ports) {
    let portNumber = ports[0].comName;
    port = new SerialPort(portNumber);
    port.on('open', handlePortOpen);
    port.on('close', handlePortClose);
    port.on('data', handlePortData);
    port.on('error', function (err) {
        logger.error(err.message);
        throw new Error('Port Error: ' + err.message);
    });
}
function handlePortOpen() {
    logger.info('Port open. Data rate: ' + port.options.baudRate);
    logger.info('Data Bits.: ' + port.options.dataBits);
    logger.info('Parity.: ' + port.options.parity);
    logger.info('Stop bit.: ' + port.options.stopBits);
}
function handlePortClose() {
    logger.info('Port Closed.');
}
function handlePortWrite(data) {
    logger.info(data);
    port.write(data);
    initTimer();
}
function handlePortData(data) {
    logger.info(data); // Raw Buffer Data
    data = data.toString(ENCODING);
    if (isTransferState) {
        if (isClientMode) {
            readDataAsClient(data);
        }
        else {
            readDataAsServer(data);
        }
    }
    else {
        readDataAsServer(data);
    }
}
// #region ServerMode_envio_datos_de_cobas_a_sil
////////////////// SERVER MODE //////////////////////
let inputChunks = [];
function readDataAsServer(data) {
    let response = '';
    if (data === ENQ) {
        logger.info('Request: ENQ');
        if (!isTransferState) {
            isTransferState = true;
            response = ACK;
        }
        else {
            logger.error('ENQ is not expected. Transfer state already.');
            response = NAK;
        }
    }
    else if (data === ACK) {
        logger.error('ACK is not expected.');
        throw new Error('ACK is not expected.');
    }
    else if (data === NAK) {
        logger.error('NAK is not expected.');
        throw new Error('NAK is not expected.');
    }
    else if (data === EOT) {
        if (isTransferState) {
            isTransferState = false;
            logger.info('EOT accepted. OK');
        }
        else {
            logger.error('Not ready to accept EOT message.');
            throw new Error('Not ready to accept EOT message.');
        }
    }
    else if (data.startsWith(STX)) {
        if (!isTransferState) {
            discard_input_buffers();
            logger.error('Not ready to accept messages');
            response = NAK;
        }
        else {
            try {
                logger.info('Accept message.Handling message');
                handleMessage(data);
                response = ACK;
            }
            catch (err) {
                logger.error('Error occurred on message handling.' + err);
                response = NAK;
            }
        }
    }
    else {
        logger.error('Invalid data.');
        throw new Error('Invalid data.');
    }
    handlePortWrite(response);
}
;
function handleMessage(message) {
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
function dispatchMessage(message, enconding) {
    console.log(message);
    logger.info(message);
    // Pasa el mensaje de Cobas al tipo Records
    let records = decodeMessage(message);
    //Envia el mensaje a SIL Multifector
    processResultRecords(records);
}
function discard_input_buffers() {
    inputChunks = [];
}
//#endregion
// #region ClientMode_envio_datos_de_sil_a_cobas
////////////////// CLIENT MODE //////////////////////
let outputChunks = [];
let outputMessages = [];
let retryCounter = 0;
let lastSendOk = false;
let lastSendData = "";
let timer;
function readDataAsClient(data) {
    if (data === ENQ) {
        if (lastSendData === ENQ) {
            //TODO: Link Contention??
        }
        throw new Error('Client should not receive ENQ.');
    }
    else if (data === ACK) {
        logger.debug('ACK Response');
        lastSendOk = true;
        try {
            sendMessage();
        }
        catch (error) {
            logger.debug(error);
            closeClientSession();
        }
        //handlePortWrite(message); //self.push(message)
        // TODO: Revisar la condicion de abajo
        // if (message === EOT){
        // self.openClientSession()
        // }
    }
    else if (data === NAK) {
        // Handles NAK response from server.
        // The client tries to repeat last
        // send for allowed amount of attempts. 
        logger.debug('NAK Response');
        if (lastSendData === ENQ) {
            openClientSession();
        }
        else {
            try {
                lastSendOk = false;
                sendMessage();
            }
            catch (error) {
                closeClientSession();
            }
        }
        // TODO: Revisar la condicion de abajo
        // if message == EOT:
        // self.openClientSession()
    }
    else if (data === EOT) {
        isTransferState = false;
        throw new Error('Client should not receive EOT.');
    }
    else if (data.startsWith(STX)) {
        isTransferState = false;
        throw new Error('Client should not receive ASTM message.');
    }
    else {
        throw new Error('Invalid data.');
    }
}
function prepareMessagesToSend(protocol) {
    outputMessages = [];
    outputMessages = composeOrderMessages(protocol);
}
function prepareNextEncodedMessage() {
    outputChunks = [];
    outputChunks = encode(outputMessages.shift());
}
function sendMessage() {
    if (lastSendData === ENQ) {
        if (outputMessages.length > 0) {
            // Still exists messages to send
            prepareNextEncodedMessage();
            sendData();
        }
        else {
            getNextProtocolToSend().then(function (results) {
                for (let i = 0; i < results.length; i++) { // Always only 1 iteration
                    let protocol = results[i];
                    prepareMessagesToSend(protocol);
                    prepareNextEncodedMessage();
                    sendData();
                }
            }, function (err) {
                logger.error("Something bad happened:", err);
            });
        }
    }
    else {
        sendData();
    }
}
function sendData() {
    if (!lastSendOk) {
        if (retryCounter > 6) {
            closeClientSession();
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
            closeClientSession();
            if (outputMessages.length > 0) {
                openClientSession();
            }
            else {
                removeLastProtocolSent();
                // checkDataToSend();
            }
            return;
        }
    }
    handlePortWrite(lastSendData);
}
function openClientSession() {
    logger.info('Open Client Session');
    retryCounter = retryCounter + 1;
    if (retryCounter > 6) {
        logger.error('Exceed number of retries');
        closeClientSession();
    }
    else {
        handlePortWrite(ENQ);
        lastSendData = ENQ;
        isTransferState = true;
        isClientMode = true;
    }
}
function closeClientSession() {
    logger.debug('Close Client Session');
    handlePortWrite(EOT);
    isTransferState = false;
    isClientMode = false;
    retryCounter = 0;
}
function checkDataToSend() {
    hasProtocolsToSend().then(function (results) {
        if (results[0].total > 0) {
            logger.info("Exist data to send");
            if (!isClientMode) {
                openClientSession();
            }
        }
        else {
            if (isClientMode) {
                isClientMode = false;
            }
            else {
                return;
                logger.info('Waiting for data to send');
            }
        }
    }, function (err) {
        logger.error("Something bad happened:", err);
    });
}
function initTimer() {
    clearTimeout(timer);
    timer = setTimeout(timeoutCommunication, 5000);
}
function timeoutCommunication() {
    if (isTransferState) {
        throw new Error('Timeout Communication');
    }
}
function runIntervalCheck() {
    setInterval(checkDataToSend, 10000);
}
;
runIntervalCheck();
// #endregion
