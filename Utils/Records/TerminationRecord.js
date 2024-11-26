"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminationRecord = void 0;
var constants_1 = require("../constants");
/***************************************
*           TerminationRecord          *
****************************************
* Sample termination record text:
* L|1|N
* L =>  Record Type ID „L‟ fixed.
* |1 => Sequence Number. Indicates sequence No. Normally it is „1‟
* |N => Termination Code. „N‟ fixed. (normal end)
**/
var TerminationRecord = /** @class */ (function () {
    function TerminationRecord() {
    }
    TerminationRecord.prototype.setType = function (_type) {
        this.type = _type;
    };
    TerminationRecord.prototype.getType = function () {
        return this.type;
    };
    TerminationRecord.prototype.setSeq = function (_seq) {
        this.seq = _seq;
    };
    TerminationRecord.prototype.getSeq = function () {
        return this.seq;
    };
    TerminationRecord.prototype.getTerminationCode = function () {
        return this.terminationCode;
    };
    TerminationRecord.prototype.setTerminationCode = function (_ter) {
        this.terminationCode = _ter;
    };
    TerminationRecord.prototype.cargarDesdeASTM = function (flow) {
        var field = flow.split('|');
        this.setType(field[0]);
        this.setSeq(field[1]);
        this.setTerminationCode(field[2]);
    };
    TerminationRecord.prototype.toArray = function () {
        return ['L', '1', 'N'];
    };
    TerminationRecord.prototype.toASTM = function () {
        var pipe = constants_1.FIELD_SEP;
        return "L" + pipe + "1" + pipe + "N";
    };
    return TerminationRecord;
}());
exports.TerminationRecord = TerminationRecord;
