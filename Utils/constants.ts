//**** CONSTANTES PARA COMUNICACION */

export const ENCODING : string = 'ascii';
// Message start token.
export const STX : string = '\x02';
// Message end token.
export const ETX : string = '\x03';
// ASTM session termination token.
export const EOT : string = '\x04';
// ASTM session initialization token.
export const ENQ : string = '\x05';
// Command accepted token.
export const ACK : string = '\x06';
// Command rejected token.
export const NAK : string = '\x15';
// Message chunk end token.
export const ETB : string = '\x17';
export const LF  : string = '\x0A';
export const CR  : string = '\x0D'; //Terminating character of record:
// CR + LF shortcut.
export const CRLF : string = CR + LF;


//**** CONSTANTES DE LOS RECORDS */
// Message records delimiter.
export const RECORD_SEP  : string  = '\x0D'; // \r //
// Record fields delimiter.
export const FIELD_SEP   : string  = '\x7C'; // |  //
// Delimeter for repeated fields.
export const REPEAT_SEP  : string  = '\x5C'; // \  //
// Field components delimiter.
export const COMPONENT_SEP : string = '\x5E'; // ^  //
// Date escape token.
export const ESCAPE_SEP  : string  = '\x26'; // &  //
