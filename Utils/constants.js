//**** CONSTANTES PARA COMUNICACION */
export const ENCODING = 'ascii';
// Message start token.
export const STX = '\x02';
// Message end token.
export const ETX = '\x03';
// ASTM session termination token.
export const EOT = '\x04';
// ASTM session initialization token.
export const ENQ = '\x05';
// Command accepted token.
export const ACK = '\x06';
// Command rejected token.
export const NAK = '\x15';
// Message chunk end token.
export const ETB = '\x17';
export const LF = '\x0A';
export const CR = '\x0D'; //Terminating character of record:
// CR + LF shortcut.
export const CRLF = CR + LF;
//**** CONSTANTES DE LOS RECORDS */
// Message records delimiter.
export const RECORD_SEP = '\x0D'; // \r //
// Record fields delimiter.
export const FIELD_SEP = '\x7C'; // |  //
// Delimeter for repeated fields.
export const REPEAT_SEP = '\x5C'; // \  //
// Field components delimiter.
export const COMPONENT_SEP = '\x5E'; // ^  //
// Date escape token.
export const ESCAPE_SEP = '\x26'; // &  //
