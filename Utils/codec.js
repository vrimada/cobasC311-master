"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeMessage = decodeMessage;
exports.decodeFrame = decodeFrame;
exports.decodeRecord = decodeRecord;
exports.decodeComponent = decodeComponent;
exports.decodeRepeatedComponent = decodeRepeatedComponent;
exports.encode = encode;
exports.encodeRecordResult = encodeRecordResult;
exports.encodeAnterior = encodeAnterior;
exports.encodeMessage = encodeMessage;
exports.encodeRecord = encodeRecord;
exports.joinChunks = joinChunks;
exports.make_chunks = make_chunks;
exports.isChunkedMessage = isChunkedMessage;
exports.makeChecksum = makeChecksum;
exports.zfill = zfill;
var constants_1 = require("./constants");
var Records_js_1 = require("./Records/Records.js");
var ResultRecord_js_1 = require("./Records/ResultRecord.js");
/**
 *
 * ASTM communication protocol consists of three layered data structure such as message, record, and frame.
 * Data is communicated by message. Further, data is communicated by frame actually. Data structure of a frame varies by protocol.
 * A message consists of several records. A record consists of one or more frames. A frame may comprise multiple records.
 * In case of a record exceeds 240 bytes, a frame is divided into middle frames and a last frame.
 * [ETB] is used for the middle frame and [ETX] is used for the last frame.
 */
function isDigit(num) {
    return !isNaN(num);
}
// #region Codifica
/**
*
* @param {string} message: ASTM message.
* @returns: Array of records ??????????????????????????????????????????????????????????????????????????????

* @throws Error:* If ASTM message is malformed.
**/
function decodeMessage(message) {
    if (!(message.startsWith(constants_1.STX) && message.endsWith(constants_1.CRLF))) {
        throw new Error('Malformed ASTM message. Expected that it will started with STX and followed by CRLF characters. Got:' + message);
    }
    var STXIndex = -1;
    var fraimeMerge = [];
    var fraime = "";
    var msg = message.slice(1); // Remove first STX
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
    var recordsS = fraimeMerge.join("");
    var recordsArray = recordsS.split(constants_1.RECORD_SEP);
    var records = new Records_js_1.Records();
    for (var i = 0; i < recordsArray.length; i++) {
        var fixed = recordsArray[i].charAt(0);
        switch (fixed) {
            case 'H': //carga el header; 
                decodeHeader(records, recordsArray[i]);
                break;
            case 'P': //carga el paciente; 
                decodePaciente(records, recordsArray[i]);
                break;
            case 'O': //carga la orden; 
                decodeOrden(records, recordsArray[i]);
                break;
            case 'C': //carga el comentario; 
                decodeComentarios(records, recordsArray[i]);
                break;
            case 'T': //carga el termination; 
                decodeTermination(records, recordsArray[i]);
                break;
            case 'R': //carga el result; 
                decodeResultados(records, recordsArray[i]);
                break;
            default: break;
        }
    }
    return records;
}
/**
* Common ASTM decoding function that tries to guess which kind of data it
* handles.
* If `data` starts with STX character (``0x02``) than probably it is
* full ASTM message with checksum and other system characters.
* If `data` starts with digit character (``0-9``) than probably it is
* fraime of records leading by his sequence number. No checksum is expected
* in this case.
* Otherwise it counts `data` as regular record structure.
* @param data: ASTM data object.
* @return: Array of ASTM records.
**/
function decodeMessage_Anterior(message) {
    if (!(message.startsWith(constants_1.STX) && message.endsWith(constants_1.CRLF))) {
        throw new Error('Malformed ASTM message. Expected that it will started with STX and followed by CRLF characters. Got:' + message);
    }
    var STXIndex = -1;
    var fraimeMerge = [];
    var fraime = "";
    var msg = message.slice(1); // Remove first STX
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
    var records = fraimeMerge.join("");
    var recordsArray = records.split(constants_1.RECORD_SEP);
    //logger.info(recordsArray); // TODO: Remove line
    var records2 = [];
    for (var i = 0; i < recordsArray.length; i++) {
        records2.push(decodeRecord(recordsArray[i]));
    }
    return records2;
}
function decodeFrame(fraime) {
    // Decodes ASTM frame 
    fraime = fraime.slice(1);
    var fraime_cs = fraime.slice(0, -2);
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
    var seq = fraime.slice(0, 1);
    if (!isDigit(seq)) {
        throw new Error('Malformed ASTM frame. Expected leading seq number ' + fraime);
    }
    return fraime.slice(1);
}
function decodeHeader(record, flow) {
    var header = record.getHeader();
    header.cargarHeaderDesdeASTM(flow);
    record.setHeader(header);
}
function decodePaciente(record, flow) {
    var paciente = record.getPaciente();
    paciente.cargarPatientDesdeASTM(flow);
    record.setPaciente(paciente);
}
function decodeOrden(record, flow) {
    var orden = record.getOrden();
    orden.cargarOrderDesdeASTM(flow);
    record.setOrden(orden);
}
function decodeComentarios(record, flow) {
    var coment = record.getComentarios();
    coment.cargarOrderDesdeASTM(flow);
    record.setComentarios(coment);
}
function decodeTermination(record, flow) {
    var termination = record.getTermination();
    termination.cargarDesdeASTM(flow);
    record.setTermination(termination);
}
function decodeResultados(record, flow) {
    var resultados = record.getResultados();
    var resultado = new ResultRecord_js_1.ResultRecord();
    resultado.CargarResultDesdeASTM(flow);
    resultados.push(resultado);
    record.setResultados(resultados);
}
function decodeRecord(record) {
    // Decodes ASTM record message
    var fields = [];
    var fieldsArray = record.split(constants_1.FIELD_SEP);
    for (var i = 0; i < fieldsArray.length; i++) {
        var item = fieldsArray[i];
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
    var outComponents = [];
    var itemsArray = field.split(constants_1.COMPONENT_SEP);
    for (var i = 0; i < itemsArray.length; i++) {
        var item = itemsArray[i];
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
    var outRepeatedComponent = [];
    var itemsArray = component.split(constants_1.REPEAT_SEP);
    for (var i = 0; i < itemsArray.length; i++) {
        var item = itemsArray[i];
        outRepeatedComponent.push(decodeComponent(item));
    }
    outRepeatedComponent;
    return outRepeatedComponent;
}
// #endregion
// #region Nueva_Codificacion
function encode(records) {
    var size = 247;
    var msg = encodeRecordResult(1, records, constants_1.ENCODING);
    if (size && msg.length > size) {
        return split(msg, size);
    }
    return [msg];
}
function encodeRecordResult(seq, records, encoding) {
    var ASTM = "", datos = "";
    ASTM = records.getHeader().toASTM() + records.getPaciente().toASTM() + records.getOrden().toASTM() + records.getComentarios().toASTM() + records.getTermination().toASTM();
    datos = [(seq % 8), ASTM, constants_1.CR, constants_1.ETX].join('');
    return [constants_1.STX, datos, makeChecksum(datos), constants_1.CR, constants_1.LF].join('');
}
// #endregion
// #region DeArrayATexto
/**
* Encodes list of records into single ASTM message, also called as "packed"
* message.
* If you need to get each record as standalone message use :function:`iter_encode`
* instead. TODO
* If the result message is too large (greater than specified `size` if it's
* not null), then it will be split by chunks.
*
* @param records: Array of ASTM records.
* @param {int} size: Chunk size in bytes.
* @param {int} seq: Frame start sequence number.
* @return: List of ASTM message chunks.
**/
function encodeAnterior(records, encoding, size, seq) {
    encoding = typeof encoding !== 'undefined' ? encoding : constants_1.ENCODING;
    seq = typeof seq !== 'undefined' ? seq : 1;
    size = typeof size !== 'undefined' ? size : 247;
    var msg = encodeMessage(seq, records, encoding);
    // logger.info(msg);
    if (size && msg.length > size) {
        // return list(split(msg, size));
        return split(msg, size);
    }
    return [msg];
}
/**
* Encodes ASTM message.
* @param {int} seq: Frame sequence number.
* @param records: List of ASTM records.
* @param {string} encoding: Data encoding.
* @return {string}: ASTM complete message with checksum and other control characters.
**/
function encodeMessage(seq, records, encoding) {
    var data = [];
    var datos = "";
    var record;
    for (var i = 0; i < records.length; i++) {
        record = records[i];
        // logger.info(record);
        //console.log('record',record);
        data.fill(encodeRecord(record, encoding));
    }
    // logger.info(data);
    data.join(constants_1.RECORD_SEP);
    datos = [(seq % 8), data, constants_1.CR, constants_1.ETX].join('');
    return [constants_1.STX, data, makeChecksum(datos), constants_1.CR, constants_1.LF].join('');
}
/**
* Encodes single ASTM record.
* @param record: ASTM record. Each`string`-typed item counted as field
               * value, one level nested `list` counted as components
               * and second leveled - as repeated components.
* @param {string} encoding: Data encoding.
* @returns {string}: Encoded ASTM record.
**/
function encodeRecord(record, encoding) {
    var fields = [];
    for (var i = 0; i < record.length; i++) {
        var field = record[i];
        if (Object.prototype.toString.call(field) === '[object Array]') {
            fields.push(encodeComponent(field, encoding));
        }
        else {
            switch (typeof field) {
                case 'undefined':
                case null:
                    fields.push('');
                    break;
                default:
                    fields.push(field);
                    break;
            }
        }
    }
    return fields.join(constants_1.FIELD_SEP); // return FIELD_SEP.join(fields)
}
function encodeComponent(component, encoding) {
    // Encodes ASTM record field components
    var items = [];
    for (var i = 0; i < component.length; i++) {
        var item = component[i];
        if (Object.prototype.toString.call(item) === '[object Array]') {
            items.push(encodeRepeatedComponent(component, encoding));
            break;
        }
        else {
            switch (typeof item) {
                case 'string':
                    items.push(item);
                    break;
                case 'undefined':
                case null:
                    items.push('');
                    break;
                default:
                    items.push(item);
                    break;
            }
        }
    }
    // let regex = new RegExp("\\" + token.REPEAT_SEP + "*$");
    // return items.join(token.COMPONENT_SEP).replace(regex, ""); // TODO Hacer un rstrip COMPONENT_SEP.join(items).rstrip(COMPONENT_SEP) 
    return items.join(constants_1.COMPONENT_SEP); // TODO Hacer un rstrip COMPONENT_SEP.join(items).rstrip(COMPONENT_SEP) 
}
function encodeRepeatedComponent(components, encoding) {
    // Encodes repeated components
    var items = [];
    for (var i = 0; i < components.length; i++) {
        var item = components[i];
        items.push(encodeComponent(item, encoding));
    }
    // let regex = new RegExp("\\" + token.REPEAT_SEP + "*$");
    return items.join(constants_1.REPEAT_SEP); //.replace(regex, "");;
}
// #endregion
// #region Auxiliares
/**
* Merges ASTM message `chunks` into single message.
* @param chunks: List of chunks as `bytes`.
**/
function joinChunks(chunks) {
    var msg = '1';
    var chunksMsg = [];
    for (var i = 0; i < chunks.length; i++) {
        var dataChunk = chunks[i].slice(2, -5);
        chunksMsg.push(dataChunk);
    }
    msg = msg + chunksMsg.join('') + constants_1.ETX;
    var completeMsg = [constants_1.STX, msg, makeChecksum(msg), constants_1.CRLF];
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
    var outputChunks = [];
    var frame = parseInt(msg.slice(1, 2));
    msg = msg.slice(2, -6);
    if (size === null || size < 7) {
        throw new Error('Chunk size value could not be less then 7 or null');
    }
    var chunks = make_chunks(msg, size - 7);
    var firstChunks = chunks.slice(0, -1);
    var last = chunks.slice(-1);
    var idx = 0;
    var item;
    for (var i = 0; i < firstChunks.length; i++) {
        idx = i;
        var chunk = firstChunks[idx];
        item = ([((idx + frame) % 8), chunk, constants_1.ETB]).join('');
        outputChunks.push(([constants_1.STX, item, makeChecksum(item), constants_1.CRLF]).join(''));
    }
    item = ([((idx + frame + 1) % 8), last, constants_1.CR, constants_1.ETX]).join('');
    outputChunks.push(([constants_1.STX, item, makeChecksum(item), constants_1.CRLF]).join(''));
    return outputChunks;
}
function make_chunks(msg, size) {
    var chunks = [];
    var iterElems = [];
    for (var i = 0; i < msg.length; i++) {
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
    var ETBIndex = message.indexOf(constants_1.ETB);
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
    var sumData = [];
    for (var i = 0; i < message.length; i++) {
        sumData.push(message.charCodeAt(i));
    }
    var suma = sumData.reduce(function (a, b) { return a + b; }, 0) & 0xFF;
    return zfill(suma.toString(16).toUpperCase());
}
function zfill(value) {
    var str = "" + value;
    var pad = "00";
    return pad.substring(0, pad.length - str.length) + str;
}
// #endregion
