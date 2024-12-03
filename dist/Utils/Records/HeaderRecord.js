"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderRecord = void 0;
const constants_js_1 = require("../constants.js");
class HeaderRecord {
    constructor() {
        this.tipo = "";
        this.emisor = "";
        this.receptor = "";
        this.mensaje = "";
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
        let field = record.split(constants_js_1.FIELD_SEP);
        this.setTipo(field[0]);
        // <Sender‟s device name>^<Communication program version>
        let emisor = field[4].split(constants_js_1.COMPONENT_SEP);
        this.setEmisor(emisor[0]); //Sender Name or ID
        this.setReceptor(field[9]); //Receiver ID
        //<Meaning of message>^< Mode of message >
        let instruccion = field[10].split(constants_js_1.COMPONENT_SEP);
        this.setMensaje(instruccion[0]); //Comment or Special Instructions
        this.setModoMensaje(instruccion[1]);
        this.setProceso(field[11]); //Processing ID 'P' fixed.
        this.setVersion(field[12]); //Version No.
    }
    toArray() {
        //Si las variables del constructor estan vacias podemos suponer que es porque se esta armando
        //el mensaje desde el SIL al COBAS
        return [
            (this.getTipo() === '' ? 'H' : this.getTipo()),
            [[null], [null, '&']],
            null,
            null,
            [(this.getEmisor() === '') ? 'SIL' : this.getEmisor(), '1'],
            null,
            null,
            null,
            null,
            (this.getReceptor() === '') ? 'CobasC311' : this.getReceptor(),
            [(this.getMensaje() === '') ? 'TSDWN' : this.getMensaje(),
                (this.getModoMensaje() === '') ? 'BATCH' : this.getModoMensaje()], //estos valores son tomados del record.js original que tenia COBAS en produccion antes de la migracion
            (this.getProceso() === '') ? 'P' : this.getProceso(),
            (this.getVersion() === '') ? '1' : this.getVersion()
        ];
    }
    toASTM() {
        let astm = "";
        let pipe = constants_js_1.FIELD_SEP;
        astm += 'H' + pipe; //(1) Record Type ID
        astm += constants_js_1.REPEAT_SEP + "^&" + pipe.repeat(3); //(2) Delimiter Definition
        astm += (this.getEmisor() === '' ? 'host' : this.getEmisor()) + constants_js_1.COMPONENT_SEP + '1' + pipe.repeat(5); //(5) Sender Name or ID <Sender‟s device name>^<Communication program version>
        astm += (this.getReceptor() === '' ? 'cobas c 311' : this.getReceptor()) + pipe; //(10) Receiver ID
        astm += (this.getMensaje() === '' ? 'TSDWN' : this.getMensaje()) + constants_js_1.COMPONENT_SEP; //(11) Comment or Special Instructions
        astm += (this.getModoMensaje() === '' ? 'BATCH' : this.getModoMensaje()) + pipe; //(11) Comment or Special Instructions
        astm += (this.getProceso() === '' ? 'P' : this.getProceso()) + pipe; //(12) Processing ID
        astm += (this.getVersion() === '' ? '1' : this.getVersion()); //(13) Version No.
        astm += constants_js_1.RECORD_SEP; // \r //
        return astm;
    }
}
exports.HeaderRecord = HeaderRecord;
