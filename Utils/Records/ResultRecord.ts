/***************************************
*           ResultRecord               *
****************************************
* Sample result record text:
* R|1|^^^458/|55|mg/dl||N||F|||||P1[CR]
* 
* Sample result record decoded:
* [ 'R','1',[ null, null, null, '458/' ],'55','mg/dl',null,'N',null,'F',null,null,null,null,'P1' ]
**/


import logger from 'winston';
export class ResultRecord {
    private _type : string;
    private _seq : string;
    private _idItemCobas : number; 
    private _value : number;
    private _units : string;

    constructor(){
        this._type = "";
        this._seq = "";
        this._idItemCobas = 0;
        this._value = 0;
        this._units = "";
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

    // #endregion
    
    CargarResultDesdeASTM(flow : string) {
        try{
            let record : string[] = flow.split('|');

           this.setType(record[0]);
           this.setSeq(record[1]);
           this.setIdItemCobas(parseInt(record[2][3].slice(0,-1)));
           this.setValue(parseFloat(record[3]));
           this.setUnits(record[4]);
           
            
        }
        catch(err : any){
            logger.error('Cannot build ResultRecord.' + err);
            throw new Error(err);
        }
    }
}
