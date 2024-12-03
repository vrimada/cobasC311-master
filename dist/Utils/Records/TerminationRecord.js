"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminationRecord = void 0;
const constants_1 = require("../constants");
/***************************************
*           TerminationRecord          *
****************************************
* Sample termination record text:
* L|1|N
* L =>  Record Type ID „L‟ fixed.
* |1 => Sequence Number. Indicates sequence No. Normally it is „1‟
* |N => Termination Code. „N‟ fixed. (normal end)
**/
class TerminationRecord {
    constructor() {
        this.type = "";
        this.seq = "";
        this.terminationCode = "";
    }
    setType(_type) {
        this.type = _type;
    }
    getType() {
        return this.type;
    }
    setSeq(_seq) {
        this.seq = _seq;
    }
    getSeq() {
        return this.seq;
    }
    getTerminationCode() {
        return this.terminationCode;
    }
    setTerminationCode(_ter) {
        this.terminationCode = _ter;
    }
    cargarDesdeASTM(flow) {
        let field = flow.split('|');
        this.setType(field[0]);
        this.setSeq(field[1]);
        this.setTerminationCode(field[2]);
    }
    toArray() {
        return ['L', '1', 'N'];
    }
    toASTM() {
        let pipe = constants_1.FIELD_SEP;
        return "L" + pipe + "1" + pipe + "N";
    }
}
exports.TerminationRecord = TerminationRecord;
