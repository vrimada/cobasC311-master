/***************************************
*           ResultRecord               *
****************************************
* Sample result record text:
* R|1|^^^458/|55|mg/dl||N||F|||||P1[CR]
* 
* Sample result record decoded:
* [ 'R','1',[ null, null, null, '458/' ],'55','mg/dl',null,'N',null,'F',null,null,null,null,'P1' ]
**/


import { COMPONENT_SEP, FIELD_SEP, RECORD_SEP } from '../constants';
import logger from 'winston';
export class ResultRecord {
    private _type : string;
    private _seq : string;
    private _idItemCobas : number; 
    private _value : number;
    private _units : string;
    private _status : string;
    private _normalFlag : string;
    private _instrumentIdentification : string;

    constructor(){
        this._type = "";
        this._seq = "";
        this._idItemCobas = 0;
        this._value = 0;
        this._units = "";
        this._status = "";
        this._normalFlag = "";
        this._instrumentIdentification = "";
    }
    
    // #region GetterSetter
    public getType() : string {
        return this._type;
    }

    public setType(type : string){
        this._type = type;
    }

    public getSeq() : string{
        return this._seq;
    }

    public setSeq(seq : string){
        this._seq = seq;
    }

    public getIdItemCobas() : number{
        return this._idItemCobas;
    }

    public setIdItemCobas(test : number){
        this._idItemCobas = test;
    }

    public getValue() : number{
        return this._value;
    }

    public setValue(value : number){
        this._value = value;
    }

    public getUnits () : string{
        return this._units;
    }

    public setUnits(units : string){
        this._units = units;
    }

    public getStatus(){
        return this._status;
    }

    public setStatus(_s : string){
        this._status = _s;
    }

    public setNormalFlag(normalFlag : string){
        this._normalFlag = normalFlag;
    }
    public getNormalFlag(){
        return this._normalFlag;
    }

    public getInstrumentIdentification(){
        return this._instrumentIdentification;
    }
    public setInstrumentIdentification(instrumentIdentification : string){
        this._instrumentIdentification = instrumentIdentification;
    }
    // #endregion
    
    CargarResultDesdeASTM(flow : string) {
        try{
            let record : string[] = flow.split('|');
            
           this.setType(record[0]); //(1)Record Type ID
           this.setSeq(record[1]); //(2)Sequence Number

           /* Indicates order.
             ^^^
             <ApplicationCode>/<Dilution>/<pre-dilution>/…
             */
          
           let components : string [] = record[2].split(COMPONENT_SEP);
           let items = components[3].split('/');
           //console.dir(record[2] + " "+ items[0]);
           
           this.setIdItemCobas(parseInt(items[0]));
           this.setValue(parseFloat(record[3])); //(4)Data or Measurement Value
           this.setUnits(record[4]); //(5)Units

           /*Indicates normal/abnormal of measurement results.
            „L‟: less than normal range.
            „H‟: more than normal range.
            „LL‟: less than Technical Limit range.
            „HH‟: more than Technical Limit range.
            „N‟: Normal.
            „A‟: Abnormal.
            */
           this.setNormalFlag(record[6]); //(7)Result Abnormal Flags
           
           /*
           Indicates the number of the test conducted for the analytical data.
            „F‟: initial result.
            „C‟: rerun result. */
           this.setStatus(record[8]); //(9)Result Status
          
           /*Indicates the ID of the analytical unit (module) that performed the analysis.
            Module          Description
            ------          --------------------------
            P1              cobas c 311 analyzer Module
            ISE1            ISE Test
            Non             Calculate Test or Not measured test */
            //console.dir(record[13]);
            this.setInstrumentIdentification(record[13]); //(14) Instrument Identification
            //console.dir(this.getInstrumentIdentification());
        }
        catch(err : any){
            logger.error('No se pudo armar ResultRecord.' + err);
            throw new Error(err);
        }
    }

    toASTM(){
        let astm = "";
        let pipe = FIELD_SEP;
        let sep = COMPONENT_SEP;
        
        astm += this.getType() + pipe; //(1)Record Type ID
        astm += this.getSeq() + pipe; //(2)Sequence Number
        astm += sep.repeat(3) + this.getIdItemCobas() +'/'+ pipe ; //(3)Universal Test ID 
        astm += this.getValue() + pipe ; //(4)Data or Measurement Value
        astm += this.getUnits() + pipe.repeat(2); //(5)Units
        astm += this.getNormalFlag() + pipe.repeat(2) ; //(7)Result Abnormal Flags
        astm += this.getStatus() + pipe.repeat(5); //(9)Result Status
        astm += this.getInstrumentIdentification(); //(14) Instrument Identification
        astm +=  RECORD_SEP;

        return astm;
    }
}
