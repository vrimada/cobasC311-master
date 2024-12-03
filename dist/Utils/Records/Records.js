"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Records = void 0;
const constants_1 = require("../constants");
const CommentRecord_1 = require("./CommentRecord");
const HeaderRecord_1 = require("./HeaderRecord");
const OrderRecord_1 = require("./OrderRecord");
const PatientRecord_1 = require("./PatientRecord");
const TerminationRecord_1 = require("./TerminationRecord");
class Records {
    constructor() {
        this.header = new HeaderRecord_1.HeaderRecord();
        this.patient = new PatientRecord_1.PatientRecord();
        this.orden = new OrderRecord_1.OrderRecord();
        this.comentarios = new CommentRecord_1.CommentRecord();
        this.resultados = new Array();
        this.termination = new TerminationRecord_1.TerminationRecord();
    }
    // #region GetterSetter
    getHeader() {
        return this.header;
    }
    setHeader(_header) {
        this.header = _header;
    }
    getOrden() {
        return this.orden;
    }
    setOrden(_order) {
        this.orden = this.orden;
    }
    getPaciente() {
        return this.patient;
    }
    setPaciente(_paciente) {
        this.patient = _paciente;
    }
    getComentarios() {
        return this.comentarios;
    }
    setComentarios(_comentarios) {
        this.comentarios = _comentarios;
    }
    getResultados() {
        return this.resultados;
    }
    setResultados(_resultados) {
        this.resultados = _resultados;
    }
    getTermination() {
        return this.termination;
    }
    setTermination(_termination) {
        this.termination = _termination;
    }
    // #endregion
    /*toArray() {
     return [this.header.toArray(), this.patient.toArray(), this.orden.toArray(), this.comentarios.toArray(), this.termination.toArray()];
    }*/
    toASTM() {
        let _resultados = "";
        if (this.resultados.length !== 0) {
            let resultados = this.getResultados();
            // console.dir(resultados);
            resultados.forEach(r => {
                _resultados += r.toASTM() + constants_1.RECORD_SEP;
            });
        }
        //  let header = this.getHeader().toASTM();
        // console.log("header "+header.toString());
        //let paciente =  this.getPaciente().toASTM();
        //console.log("paciente "+paciente);
        //let orden = this.getOrden().toASTM();
        // console.log("orden " + orden);
        // let comentarios = this.getComentarios().toASTM();
        // console.log("comentarios "+comentarios);
        //let _ter = this.getTermination().toASTM();
        //console.log("termination " +_ter);
        //final = `${header} ${paciente} ${orden} ${comentarios} ${result} ${termination}`
        const final = [this.getHeader().toASTM(), this.getPaciente().toASTM(), this.getOrden().toASTM(), _resultados, this.getComentarios().toASTM(), this.getTermination().toASTM()].join('');
        return final;
    }
}
exports.Records = Records;
