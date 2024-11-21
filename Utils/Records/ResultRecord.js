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
    constructor() {
        this._type = "";
        this._seq = "";
        this._idItemCobas = 0;
        this._value = 0;
        this._units = "";
    }
    // #region GetterSetter
    getType() {
        return this._type;
    }
    setType(type) {
        this._type = type;
    }
    getSeq() {
        return this._seq;
    }
    setSeq(seq) {
        this._seq = seq;
    }
    getIdItemCobas() {
        return this._idItemCobas;
    }
    setIdItemCobas(test) {
        this._idItemCobas = test;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
    }
    getUnits() {
        return this._units;
    }
    setUnits(units) {
        this._units = units;
    }
    // #endregion
    CargarResultDesdeASTM(flow) {
        try {
            let record = flow.split('|');
            this.setType(record[0]);
            this.setSeq(record[1]);
            this.setIdItemCobas(parseInt(record[2][3].slice(0, -1)));
            this.setValue(parseFloat(record[3]));
            this.setUnits(record[4]);
        }
        catch (err) {
            logger.error('Cannot build ResultRecord.' + err);
            throw new Error(err);
        }
    }
}
