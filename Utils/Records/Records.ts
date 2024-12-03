import { RECORD_SEP } from "../constants";
import { CommentRecord } from "./CommentRecord";
import { HeaderRecord } from "./HeaderRecord";
import { OrderRecord } from "./OrderRecord";
import { PatientRecord } from "./PatientRecord";
import { ResultRecord } from "./ResultRecord";
import { TerminationRecord } from "./TerminationRecord";

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

     /*toArray() {
      return [this.header.toArray(), this.patient.toArray(), this.orden.toArray(), this.comentarios.toArray(), this.termination.toArray()];
     }*/

     toASTM(){
      let _resultados = "";
      
      if(this.resultados.length !== 0){
         let resultados = this.getResultados();
        // console.dir(resultados);
         resultados.forEach(r => {
         _resultados += r.toASTM() + RECORD_SEP;
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

      const final = [this.getHeader().toASTM() , this.getPaciente().toASTM() , this.getOrden().toASTM() , _resultados, this.getComentarios().toASTM() , this.getTermination().toASTM()].join('');
 
      return final;
     }

}