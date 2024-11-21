import { COMPONENT_SEP, FIELD_SEP } from "../constants.js";
/***************************************
*             HeaderRecord             *
****************************************
* Sample header record text:
* H|\^&|||host^1|||||cobas c 311|TSDWN^BATCH|P|1 [CR]
*
* H => esta fijada, es de tipo string, maximo 1 caracter
* |\^& => caracteres fijados
* | => Message Control ID
* | => Access Password
* | host^1 => Sender Name or ID
* | => Sender Street Address
* | => Reserved Field
* | => Sender Telephone Number
* | => Characteristics of Sender
* |cobas c 311 => Receiver ID
* |TSDWN^BATCH => Comment or Special Instructions.
*       Setting is as follows: <Meaning of message>^< Mode of message >
 
        <Meaning of message> Type: ST Max: 5
        „TSREQ‟: TS inquiry.
        „TSDWN‟: Test selection download.
        „RSUPL„: Result report
        „PCUPL„: Photometry calibration report
        „ICUPL„: ISE calibration report
        „ABUPL‟: Absorbance report
        „RSREQ‟: Inquiry for the result

        <Mode of message> Type: ST Max: 5
        „REAL‟: communication in real time.
        „BATCH‟: communication based on request from cobas c 311/HOST.
        „REPLY‟: reply to the request.

|P => Processing ID
|1 => Version No.
**/
export class HeaderRecord {
    constructor() {
        this.tipo = "";
        this.emisor = "";
        this.receptor = "";
        this.proceso = "";
        this.version = "";
        this.modoMensaje = "";
    }
    // #region GetterSetter
    setTipo(_tipo) {
        this.tipo = _tipo;
    }
    getTipo() {
        return this.tipo;
    }
    getEmisor() {
        return this.emisor;
    }
    setEmisor(emisor) {
        this.emisor = emisor;
    }
    getReceptor() {
        return this.receptor;
    }
    setReceptor(receptor) {
        this.receptor = receptor;
    }
    getMensaje() {
        return this.mensaje;
    }
    setMensaje(_m) {
        this.mensaje = _m;
    }
    getProceso() {
        return this.proceso;
    }
    setProceso(proceso) {
        this.proceso = proceso;
    }
    getVersion() {
        return this.version;
    }
    setVersion(version) {
        this.version = version;
    }
    setModoMensaje(_modo) {
        this.modoMensaje = _modo;
    }
    getModoMensaje() {
        return this.modoMensaje;
    }
    // #endregion
    cargarHeaderDesdeASTM(record) {
        // Decodes ASTM record message
        let field = record.split(FIELD_SEP);
        this.setTipo(field[0]);
        // <Sender‟s device name>^<Communication program version>
        let emisor = field[4].split(COMPONENT_SEP);
        this.setEmisor(emisor[0]); //Sender Name or ID
        this.setReceptor(field[9]); //Receiver ID
        //<Meaning of message>^< Mode of message >
        let instruccion = field[10].split(COMPONENT_SEP);
        this.setMensaje(instruccion[0]); //Comment or Special Instructions
        this.setModoMensaje(instruccion[1]);
        this.setProceso(field[11]); //Processing ID 'P' fixed.
        this.setVersion(field[12]); //Version No.
    }
    toASTM() {
        return [this.getTipo(), [null, '&'], null, null, [this.getEmisor(), '1'], null, null, null, null, this.getReceptor(), [this.getMensaje(), this.getModoMensaje()], this.getProceso(), this.getVersion()];
    }
}
