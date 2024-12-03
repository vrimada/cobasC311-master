"use strict";
//**** CONSTANTES PARA COMUNICACION */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ESCAPE_SEP = exports.COMPONENT_SEP = exports.REPEAT_SEP = exports.FIELD_SEP = exports.RECORD_SEP = exports.CRLF = exports.CR = exports.LF = exports.ETB = exports.NAK = exports.ACK = exports.ENQ = exports.EOT = exports.ETX = exports.STX = exports.ENCODING = void 0;
exports.ENCODING = 'ascii';
// Message start token.
exports.STX = '\x02';
// Message end token.
exports.ETX = '\x03';
// ASTM session termination token.
exports.EOT = '\x04';
// ASTM session initialization token.
exports.ENQ = '\x05';
// Command accepted token.
exports.ACK = '\x06';
// Command rejected token.
exports.NAK = '\x15';
// Message chunk end token.
exports.ETB = '\x17';
exports.LF = '\x0A';
exports.CR = '\x0D'; //Terminating character of record:
// CR + LF shortcut.
exports.CRLF = exports.CR + exports.LF;
//**** CONSTANTES DE LOS RECORDS */
// Message records delimiter.
exports.RECORD_SEP = '\x0D'; // \r //
// Record fields delimiter.
exports.FIELD_SEP = '\x7C'; // |  //
// Delimeter for repeated fields.
exports.REPEAT_SEP = '\x5C'; // \  //
// Field components delimiter.
exports.COMPONENT_SEP = '\x5E'; // ^  //
// Date escape token.
exports.ESCAPE_SEP = '\x26'; // &  //
