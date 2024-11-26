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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultRecord = void 0;
var constants_1 = require("../constants");
var winston_1 = require("winston");
var ResultRecord = /** @class */ (function () {
    function ResultRecord() {
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
    ResultRecord.prototype.getType = function () {
        return this._type;
    };
    ResultRecord.prototype.setType = function (type) {
        this._type = type;
    };
    ResultRecord.prototype.getSeq = function () {
        return this._seq;
    };
    ResultRecord.prototype.setSeq = function (seq) {
        this._seq = seq;
    };
    ResultRecord.prototype.getIdItemCobas = function () {
        return this._idItemCobas;
    };
    ResultRecord.prototype.setIdItemCobas = function (test) {
        this._idItemCobas = test;
    };
    ResultRecord.prototype.getValue = function () {
        return this._value;
    };
    ResultRecord.prototype.setValue = function (value) {
        this._value = value;
    };
    ResultRecord.prototype.getUnits = function () {
        return this._units;
    };
    ResultRecord.prototype.setUnits = function (units) {
        this._units = units;
    };
    ResultRecord.prototype.getStatus = function () {
        return this._status;
    };
    ResultRecord.prototype.setStatus = function (_s) {
        this._status = _s;
    };
    ResultRecord.prototype.setNormalFlag = function (normalFlag) {
        this._normalFlag = normalFlag;
    };
    ResultRecord.prototype.getNormalFlag = function () {
        return this._normalFlag;
    };
    ResultRecord.prototype.getInstrumentIdentification = function () {
        return this._instrumentIdentification;
    };
    ResultRecord.prototype.setInstrumentIdentification = function (instrumentIdentification) {
        this._instrumentIdentification = instrumentIdentification;
    };
    // #endregion
    ResultRecord.prototype.CargarResultDesdeASTM = function (flow) {
        try {
            var record = flow.split('|');
            this.setType(record[0]); //(1)Record Type ID
            this.setSeq(record[1]); //(2)Sequence Number
            /* Indicates order.
              ^^^
              <ApplicationCode>/<Dilution>/<pre-dilution>/…
              */
            var components = record[2].split(constants_1.COMPONENT_SEP);
            var items = components[3].split('/');
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
            winston_1.default.error('Cannot build ResultRecord.' + err);
            throw new Error(err);
        }
    };
    ResultRecord.prototype.toASTM = function () {
        var astm = "";
        var pipe = constants_1.FIELD_SEP;
        var sep = constants_1.COMPONENT_SEP;
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
    };
    return ResultRecord;
}());
exports.ResultRecord = ResultRecord;
