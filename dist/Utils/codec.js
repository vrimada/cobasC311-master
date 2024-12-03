"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMessage = decodeMessage;
exports.decodeFrame = decodeFrame;
exports.decodeRecord = decodeRecord;
exports.decodeComponent = decodeComponent;
exports.decodeRepeatedComponent = decodeRepeatedComponent;
exports.encode = encode;
exports.encodeRecordResult = encodeRecordResult;
exports.joinChunks = joinChunks;
exports.make_chunks = make_chunks;
exports.isChunkedMessage = isChunkedMessage;
exports.makeChecksum = makeChecksum;
exports.zfill = zfill;
const constants_1 = require("./constants");
const Records_js_1 = require("./Records/Records.js");
const ResultRecord_js_1 = require("./Records/ResultRecord.js");
/**
 *
 * ASTM communication protocol consists of three layered data structure such as message, record, and frame.
 * Data is communicated by message. Further, data is communicated by frame actually. Data structure of a frame varies by protocol.
 * A message consists of several records. A record consists of one or more frames. A frame may comprise multiple records.
 * In case of a record exceeds 240 bytes, a frame is divided into middle frames and a last frame.
 * [ETB] is used for the middle frame and [ETX] is used for the last frame.
 */
// #region DECODE_DE_ASTM_A_RECORD
/**
*
* @param {string} message: ASTM message.
* @returns: Array of records

* @throws Error:* If ASTM message is malformed.
**/
function decodeMessage(message) {
    if (!(message.startsWith(constants_1.STX) && message.endsWith(constants_1.CRLF))) {
        throw new Error('Malformed ASTM message. Expected that it will started with STX and followed by CRLF characters. Got:' + message);
    }
    let STXIndex = -1;
    let fraimeMerge = [];
    let fraime = "";
    let msg = message.slice(1); // Remove first STX
    while (msg.indexOf(constants_1.STX) > -1) {
        STXIndex = msg.indexOf(constants_1.STX);
        fraime = message.slice(0, STXIndex + 1);
        fraime = decodeFrame(fraime);
        fraimeMerge.push(fraime);
        msg = msg.slice(STXIndex + 1);
        message = message.slice(STXIndex + 1);
    }
    fraime = decodeFrame(message); // Last frame(should contains ETX)
    fraimeMerge.push(fraime);
    let recordsS = fraimeMerge.join("");
    let recordsArray = recordsS.split(constants_1.RECORD_SEP);
    let records = new Records_js_1.Records();
    for (let i = 0; i < recordsArray.length; i++) {
        let fixed = recordsArray[i].charAt(0);
        switch (fixed) {
            case 'H': /*carga el header; */
                decodeHeader(records, recordsArray[i]);
                break;
            case 'P': /*carga el paciente; */
                decodePaciente(records, recordsArray[i]);
                break;
            case 'O': /* carga la orden; */
                decodeOrden(records, recordsArray[i]);
                break;
            case 'C': /*carga el comentario; */
                decodeComentarios(records, recordsArray[i]);
                break;
            case 'T': /*carga el termination; */
                decodeTermination(records, recordsArray[i]);
                break;
            case 'R': /*carga el result; */
                decodeResultados(records, recordsArray[i]);
                break;
            default: break;
        }
    }
    return records;
}
function decodeFrame(fraime) {
    // Decodes ASTM frame 
    fraime = fraime.slice(1);
    let fraime_cs = fraime.slice(0, -2);
    fraime = fraime_cs.slice(0, -2);
    if (fraime.endsWith(constants_1.CR + constants_1.ETX)) {
        fraime = fraime.slice(0, -2);
    }
    else if (fraime.endsWith(constants_1.ETB)) {
        fraime = fraime.slice(0, -1);
    }
    else {
        throw new Error('Incomplete frame data ' + fraime + '. Expected trailing <CR><ETX> or <ETB> chars');
    }
    let seq = fraime.slice(0, 1);
    if (!isDigit(parseInt(seq))) {
        throw new Error('Malformed ASTM frame. Expected leading seq number ' + fraime);
    }
    return fraime.slice(1);
}
function decodeHeader(record, flow) {
    let header = record.getHeader();
    header.cargarHeaderDesdeASTM(flow);
    record.setHeader(header);
}
function decodePaciente(record, flow) {
    let paciente = record.getPaciente();
    paciente.cargarPatientDesdeASTM(flow);
    record.setPaciente(paciente);
}
function decodeOrden(record, flow) {
    let orden = record.getOrden();
    orden.cargarOrderDesdeASTM(flow);
    record.setOrden(orden);
}
function decodeComentarios(record, flow) {
    let coment = record.getComentarios();
    coment.cargarOrderDesdeASTM(flow);
    record.setComentarios(coment);
}
function decodeTermination(record, flow) {
    let termination = record.getTermination();
    termination.cargarDesdeASTM(flow);
    record.setTermination(termination);
}
function decodeResultados(record, flow) {
    let resultados = record.getResultados();
    let resultado = new ResultRecord_js_1.ResultRecord();
    resultado.CargarResultDesdeASTM(flow);
    resultados.push(resultado);
    record.setResultados(resultados);
}
function decodeRecord(record) {
    // Decodes ASTM record message
    let fields = [];
    let fieldsArray = record.split(constants_1.FIELD_SEP);
    for (let i = 0; i < fieldsArray.length; i++) {
        let item = fieldsArray[i];
        if (item.indexOf(constants_1.REPEAT_SEP) > -1) {
            //  item = decodeRepeatedComponent(item);
        }
        else if (item.indexOf(constants_1.COMPONENT_SEP) > -1) {
            //  item = decodeComponent(item);
        }
        else {
            item = item;
        }
        if (item) {
            fields.push(item);
        }
        else {
            fields.push(null);
        }
    }
    return fields;
}
function decodeComponent(field) {
    // Decodes ASTM field component
    let outComponents = [];
    let itemsArray = field.split(constants_1.COMPONENT_SEP);
    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i];
        if (item) {
            outComponents.push(item);
        }
        else {
            outComponents.push(null);
        }
    }
    return outComponents;
}
function decodeRepeatedComponent(component) {
    // Decodes ASTM field repeated component
    let outRepeatedComponent = [];
    let itemsArray = component.split(constants_1.REPEAT_SEP);
    for (let i = 0; i < itemsArray.length; i++) {
        let item = itemsArray[i];
        outRepeatedComponent.push(decodeComponent(item));
    }
    outRepeatedComponent;
    return outRepeatedComponent;
}
// #endregion
// #region ENCODE_DE_RECORD_A_ASTM
function encode(records) {
    let size = 247;
    let msg = encodeRecordResult(1, records, constants_1.ENCODING);
    if (size && msg.length > size) {
        return split(msg, size);
    }
    return [msg];
}
function encodeRecordResult(seq, records, encoding) {
    let ASTM = "", datos = "";
    ASTM = records.getHeader().toASTM() + records.getPaciente().toASTM() + records.getOrden().toASTM() + records.getComentarios().toASTM() + records.getTermination().toASTM();
    datos = [(seq % 8), ASTM, constants_1.CR, constants_1.ETX].join('');
    return [constants_1.STX, datos, makeChecksum(datos), constants_1.CR, constants_1.LF].join('');
}
// #endregion
// #region Auxiliares
function isDigit(num) {
    return !isNaN(num);
}
/**
* Merges ASTM message `chunks` into single message.
* @param chunks: List of chunks as `bytes`.
**/
function joinChunks(chunks) {
    let msg = '1';
    let chunksMsg = [];
    for (let i = 0; i < chunks.length; i++) {
        let dataChunk = chunks[i].slice(2, -5);
        chunksMsg.push(dataChunk);
    }
    msg = msg + chunksMsg.join('') + constants_1.ETX;
    let completeMsg = [constants_1.STX, msg, makeChecksum(msg), constants_1.CRLF];
    return completeMsg.join('');
}
/**
* Split `msg` into chunks with specified `size`.
*
* Chunk `size` value couldn't be less then 7 since each chunk goes with at
* least 7 special characters: STX, frame number, ETX or ETB, checksum and
* message terminator.
*
* @param msg: ASTM message.
* @param {int }size: Chunk size in bytes.
* :yield: `bytes`
**/
function split(msg, size) {
    let outputChunks = [];
    let frame = parseInt(msg.slice(1, 2));
    msg = msg.slice(2, -6);
    if (size === null || size < 7) {
        throw new Error('Chunk size value could not be less then 7 or null');
    }
    let chunks = make_chunks(msg, size - 7);
    let firstChunks = chunks.slice(0, -1);
    let last = chunks.slice(-1);
    let idx = 0;
    let item;
    for (let i = 0; i < firstChunks.length; i++) {
        idx = i;
        let chunk = firstChunks[idx];
        item = ([((idx + frame) % 8), chunk, constants_1.ETB]).join('');
        outputChunks.push(([constants_1.STX, item, makeChecksum(item), constants_1.CRLF]).join(''));
    }
    item = ([((idx + frame + 1) % 8), last, constants_1.CR, constants_1.ETX]).join('');
    outputChunks.push(([constants_1.STX, item, makeChecksum(item), constants_1.CRLF]).join(''));
    return outputChunks;
}
function make_chunks(msg, size) {
    let chunks = [];
    let iterElems = [];
    for (let i = 0; i < msg.length; i++) {
        iterElems.push(msg.slice(i, i + 1));
    }
    while (iterElems.length) {
        chunks.push(iterElems.splice(0, size).join(''));
    }
    return chunks;
}
function isChunkedMessage(message) {
    //  Checks plain message for chunked byte.
    if (message.length < 5)
        return false;
    let ETBIndex = message.indexOf(constants_1.ETB);
    if (ETBIndex > -1) {
        if (ETBIndex === message.length - 5)
            return true;
        else
            return false;
    }
    else
        return false;
}
/**
* Calculates checksum for specified message.
* @param message: ASTM message.
* @returns: Checksum value in hex base
**/
function makeChecksum(message) {
    let sumData = [];
    for (let i = 0; i < message.length; i++) {
        sumData.push(message.charCodeAt(i));
    }
    let suma = sumData.reduce((a, b) => a + b, 0) & 0xFF;
    return zfill(suma.toString(16).toUpperCase());
}
function zfill(value) {
    let str = "" + value;
    let pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
}
// #endregion
