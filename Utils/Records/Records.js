import { CommentRecord } from "./CommentRecord.js";
import { HeaderRecord } from "./HeaderRecord.js";
import { OrderRecord } from "./OrderRecord.js";
import { PatientRecord } from "./PatientRecord.js";
import { TerminationRecord } from "./TerminationRecord.js";
export class Records {
    constructor() {
        this.header = new HeaderRecord();
        this.patient = new PatientRecord();
        this.orden = new OrderRecord();
        this.comentarios = new CommentRecord();
        this.resultados = new Array();
        this.termination = new TerminationRecord();
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
    toASTM() {
        return [this.header.toASTM(), this.patient.toASTM(), this.orden.toASTM(), this.comentarios.toASTM(), this.termination.toASTM()];
    }
    toString() {
        return "[" +
            "[" + this.header.toString() + "]" + '\x0D' +
            "[" + this.patient.toString() + "]" + '\x0D' +
            "[" + this.orden.toString() + "]" + '\x0D' +
            "[" + this.comentarios.toString() + "]" + '\x0D' +
            "[" + this.resultados.toString() + "]" + '\x0D' +
            "[" + this.termination.toString() + "]" + '\x0D'
            + "]";
    }
}
