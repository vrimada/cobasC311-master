import { CommentRecord } from "./CommentRecord.js";
import { HeaderRecord } from "./HeaderRecord.js";
import { OrderRecord } from "./OrderRecord.js";
import { PatientRecord } from "./PatientRecord.js";
import { ResultRecord } from "./ResultRecord.js";
import { TerminationRecord } from "./TerminationRecord.js";

export class Records{
    private header : HeaderRecord;
    private patient : PatientRecord;
    private orden : OrderRecord;
    private comentarios : CommentRecord;
    private resultados : Array<ResultRecord>;
    private termination : TerminationRecord;

    constructor(){
        this.header = new HeaderRecord();
        this.patient = new PatientRecord();
        this.orden = new OrderRecord();
        this.comentarios = new CommentRecord();
        this.resultados = new Array<ResultRecord>();
        this.termination = new TerminationRecord();
    }



    // #region GetterSetter

     public getHeader() : HeaderRecord{
        return this.header;
     }

     public setHeader(_header : HeaderRecord) : void{
        this.header = _header;
     }

     public getOrden() : OrderRecord{
        return this.orden;
     }

     public setOrden(_order : OrderRecord) : void{
        this.orden = this.orden;
     }

     public getPaciente() : PatientRecord{
        return this.patient;
     }

     public setPaciente(_paciente : PatientRecord) : void{
        this.patient = _paciente;
     }

     public getComentarios() : CommentRecord{
        return this.comentarios;
     }

     public setComentarios(_comentarios : CommentRecord) : void{
        this.comentarios = _comentarios;
     }

     public getResultados() : ResultRecord[] {
        return this.resultados;
     }

     public setResultados(_resultados : ResultRecord[]) : void{
        this.resultados = _resultados;
     }

     public getTermination() : TerminationRecord{
        return this.termination;
     }

     public setTermination(_termination : TerminationRecord) : void {
        this.termination = _termination;
     }
    // #endregion

     toASTM() {
      return [this.header.toASTM(), this.patient.toASTM(), this.orden.toASTM(), this.comentarios.toASTM(), this.termination.toASTM()];
     }

     toString() {

      return "["+
        
        "["+this.header.toString()+"]"+'\x0D'+
        "["+this.patient.toString()+"]"+'\x0D'+
        "["+this.orden.toString()+"]"+'\x0D'+
        "["+this.comentarios.toString()+"]"+'\x0D'+
        "["+this.resultados.toString()+"]"+'\x0D'+
        "["+this.termination.toString()+"]"+'\x0D'
        +"]";
     }

}