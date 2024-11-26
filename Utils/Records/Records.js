"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Records = void 0;
var constants_1 = require("../constants");
var CommentRecord_1 = require("./CommentRecord");
var HeaderRecord_1 = require("./HeaderRecord");
var OrderRecord_1 = require("./OrderRecord");
var PatientRecord_1 = require("./PatientRecord");
var TerminationRecord_1 = require("./TerminationRecord");
var Records = /** @class */ (function () {
    function Records() {
        this.header = new HeaderRecord_1.HeaderRecord();
        this.patient = new PatientRecord_1.PatientRecord();
        this.orden = new OrderRecord_1.OrderRecord();
        this.comentarios = new CommentRecord_1.CommentRecord();
        this.resultados = new Array();
        this.termination = new TerminationRecord_1.TerminationRecord();
    }
    // #region GetterSetter
    Records.prototype.getHeader = function () {
        return this.header;
    };
    Records.prototype.setHeader = function (_header) {
        this.header = _header;
    };
    Records.prototype.getOrden = function () {
        return this.orden;
    };
    Records.prototype.setOrden = function (_order) {
        this.orden = this.orden;
    };
    Records.prototype.getPaciente = function () {
        return this.patient;
    };
    Records.prototype.setPaciente = function (_paciente) {
        this.patient = _paciente;
    };
    Records.prototype.getComentarios = function () {
        return this.comentarios;
    };
    Records.prototype.setComentarios = function (_comentarios) {
        this.comentarios = _comentarios;
    };
    Records.prototype.getResultados = function () {
        return this.resultados;
    };
    Records.prototype.setResultados = function (_resultados) {
        this.resultados = _resultados;
    };
    Records.prototype.getTermination = function () {
        return this.termination;
    };
    Records.prototype.setTermination = function (_termination) {
        this.termination = _termination;
    };
    // #endregion
    Records.prototype.toArray = function () {
        return [this.header.toArray(), this.patient.toArray(), this.orden.toArray(), this.comentarios.toArray(), this.termination.toArray()];
    };
    Records.prototype.toASTM = function () {
        var _resultados = "";
        if (this.resultados.length !== 0) {
            var resultados = this.getResultados();
            // console.dir(resultados);
            resultados.forEach(function (r) {
                _resultados += r.toASTM() + constants_1.RECORD_SEP;
            });
        }
        var header = this.getHeader().toASTM();
        // console.log("header "+header.toString());
        var paciente = this.getPaciente().toASTM();
        //console.log("paciente "+paciente);
        var orden = this.getOrden().toASTM();
        // console.log("orden " + orden);
        var comentarios = this.getComentarios().toASTM();
        // console.log("comentarios "+comentarios);
        var _ter = this.getTermination().toASTM();
        //console.log("termination " +_ter);
        //final = `${header} ${paciente} ${orden} ${comentarios} ${result} ${termination}`
        var final = [header, paciente, orden, _resultados, comentarios, _ter].join('');
        return final;
    };
    return Records;
}());
exports.Records = Records;
