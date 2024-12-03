"use strict";
/***************************************
*           ResultRecord               *
****************************************
* Sample result record text:
* R|1|^^^458/|55|mg/dl||N||F|||||P1[CR]
*
* Sample result record decoded:
* [ 'R','1',[ null, null, null, '458/' ],'55','mg/dl',null,'N',null,'F',null,null,null,null,'P1' ]
**/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultRecord = void 0;
const constants_1 = require("../constants");
const winston_1 = __importDefault(require("winston"));
class ResultRecord {
    constructor() {
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
    getStatus() {
        return this._status;
    }
    setStatus(_s) {
        this._status = _s;
    }
    setNormalFlag(normalFlag) {
        this._normalFlag = normalFlag;
    }
    getNormalFlag() {
        return this._normalFlag;
    }
    getInstrumentIdentification() {
        return this._instrumentIdentification;
    }
    setInstrumentIdentification(instrumentIdentification) {
        this._instrumentIdentification = instrumentIdentification;
    }
    // #endregion
    CargarResultDesdeASTM(flow) {
        try {
            let record = flow.split('|');
            this.setType(record[0]); //(1)Record Type ID
            this.setSeq(record[1]); //(2)Sequence Number
            /* Indicates order.
              ^^^
              <ApplicationCode>/<Dilution>/<pre-dilution>/…
              */
            let components = record[2].split(constants_1.COMPONENT_SEP);
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
        catch (err) {
            winston_1.default.error('No se pudo armar ResultRecord.' + err);
            throw new Error(err);
        }
    }
    toASTM() {
        let astm = "";
        let pipe = constants_1.FIELD_SEP;
        let sep = constants_1.COMPONENT_SEP;
        astm += this.getType() + pipe; //(1)Record Type ID
        astm += this.getSeq() + pipe; //(2)Sequence Number
        astm += sep.repeat(3) + this.getIdItemCobas() + '/' + pipe; //(3)Universal Test ID 
        astm += this.getValue() + pipe; //(4)Data or Measurement Value
        astm += this.getUnits() + pipe.repeat(2); //(5)Units
        astm += this.getNormalFlag() + pipe.repeat(2); //(7)Result Abnormal Flags
        astm += this.getStatus() + pipe.repeat(5); //(9)Result Status
        astm += this.getInstrumentIdentification(); //(14) Instrument Identification
        astm += constants_1.RECORD_SEP;
        return astm;
    }
}
exports.ResultRecord = ResultRecord;
