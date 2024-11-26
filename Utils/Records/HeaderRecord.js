"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderRecord = void 0;
var constants_js_1 = require("../constants.js");
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
var HeaderRecord = /** @class */ (function () {
    function HeaderRecord() {
        this.tipo = "";
        this.emisor = "";
        this.receptor = "";
        this.mensaje = "";
        this.proceso = "";
        this.version = "";
        this.modoMensaje = "";
    }
    // #region GetterSetter
    HeaderRecord.prototype.setTipo = function (_tipo) {
        this.tipo = _tipo;
    };
    HeaderRecord.prototype.getTipo = function () {
        return this.tipo;
    };
    HeaderRecord.prototype.getEmisor = function () {
        return this.emisor;
    };
    HeaderRecord.prototype.setEmisor = function (emisor) {
        this.emisor = emisor;
    };
    HeaderRecord.prototype.getReceptor = function () {
        return this.receptor;
    };
    HeaderRecord.prototype.setReceptor = function (receptor) {
        this.receptor = receptor;
    };
    HeaderRecord.prototype.getMensaje = function () {
        return this.mensaje;
    };
    HeaderRecord.prototype.setMensaje = function (_m) {
        this.mensaje = _m;
    };
    HeaderRecord.prototype.getProceso = function () {
        return this.proceso;
    };
    HeaderRecord.prototype.setProceso = function (proceso) {
        this.proceso = proceso;
    };
    HeaderRecord.prototype.getVersion = function () {
        return this.version;
    };
    HeaderRecord.prototype.setVersion = function (version) {
        this.version = version;
    };
    HeaderRecord.prototype.setModoMensaje = function (_modo) {
        this.modoMensaje = _modo;
    };
    HeaderRecord.prototype.getModoMensaje = function () {
        return this.modoMensaje;
    };
    // #endregion
    HeaderRecord.prototype.cargarHeaderDesdeASTM = function (record) {
        // Decodes ASTM record message
        var field = record.split(constants_js_1.FIELD_SEP);
        this.setTipo(field[0]);
        // <Sender‟s device name>^<Communication program version>
        var emisor = field[4].split(constants_js_1.COMPONENT_SEP);
        this.setEmisor(emisor[0]); //Sender Name or ID
        this.setReceptor(field[9]); //Receiver ID
        //<Meaning of message>^< Mode of message >
        var instruccion = field[10].split(constants_js_1.COMPONENT_SEP);
        this.setMensaje(instruccion[0]); //Comment or Special Instructions
        this.setModoMensaje(instruccion[1]);
        this.setProceso(field[11]); //Processing ID 'P' fixed.
        this.setVersion(field[12]); //Version No.
    };
    HeaderRecord.prototype.toArray = function () {
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
    };
    HeaderRecord.prototype.toASTM = function () {
        var astm = "";
        var pipe = constants_js_1.FIELD_SEP;
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
    };
    return HeaderRecord;
}());
exports.HeaderRecord = HeaderRecord;
