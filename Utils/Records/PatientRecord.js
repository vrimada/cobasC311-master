"use strict";
/***************************************
*              PatientRecord           *
****************************************
* Sample patient record text:
* P|1||||||20070921|M||||||35^Y[CR]

Explicación de los conceptos del ejemplo:
* P => Record Type ID. 'P' fixed.
* |1 => Sequence Number. Indicates sequence No. Normally it is '1'
* | => Practice Assigned Patient ID. Field does not contain data
* | => Laboratory Assigned Patient ID. Field does not contain data
* | => Patient ID No. 3. Field does not contain data
* | => Patient Name. Field does not contain data
* | => Mother's Maiden Name. Field does not contain data
* |20070921 => Birthdates. Date as defined by ASTM 6.6.2
* |M => Patient Sex. M Male, F Female, U Unknown
* | => Patient Race. Field does not contain data.
* | => Patient Address. Field does not contain data.
* | => Reserved Field. Field does not contain data.
* | => Patient Phone Nro. Field does not contain data.
* | => Attending Physician ID. Field does not contain data.
* |35^Y => Special Field 1. Format <Age>^<Age Unit>
        -  Age: Age of the Patient from whom the sample was collected. Range 1-200
        -  Age Unit Specify: 'Y', 'M' or 'D'. Indicates unit of the age.
        'Y' is the year, 'M' is the month, and 'D' is the day.
**/
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientRecord = void 0;
var constants_js_1 = require("../constants.js");
var PatientRecord = /** @class */ (function () {
    function PatientRecord() {
        this._sex = "";
        this._name = "";
        this._birthdate = "";
    }
    // #region GetterSetter
    PatientRecord.prototype.getSex = function () {
        return this._sex;
    };
    PatientRecord.prototype.setSex = function (sex) {
        this._sex = sex;
    };
    PatientRecord.prototype.getName = function () {
        return this._name;
    };
    PatientRecord.prototype.setName = function (name) {
        this._name = name;
    };
    PatientRecord.prototype.getBirthdate = function () {
        return this._birthdate;
    };
    PatientRecord.prototype.setBirthdate = function (birthdate) {
        this._birthdate = birthdate;
    };
    // #endregion
    PatientRecord.prototype.toArray = function () {
        return [
            'P',
            '1',
            null,
            null,
            null,
            null,
            null,
            null,
            this.getSex(),
            null,
            null,
            null,
            null,
            null,
            [null, null]
        ];
    };
    PatientRecord.prototype.cargarPatientRecord = function (protocol) {
        this.setName(protocol[0].paciente);
        this.setBirthdate(protocol[0].anioNacimiento);
        this.setSex(protocol[0].sexo);
    };
    PatientRecord.prototype.cargarPatientDesdeASTM = function (record) {
        var field = record.split(constants_js_1.FIELD_SEP);
        this.setBirthdate(field[7]);
        this.setSex(field[8]);
    };
    PatientRecord.prototype.toASTM = function () {
        var pipe = constants_js_1.FIELD_SEP;
        var astm = "P" + pipe + "1" + pipe + pipe + pipe + pipe + pipe + pipe + pipe + this.getSex();
        astm = astm + pipe + pipe + pipe + pipe + pipe + pipe + constants_js_1.COMPONENT_SEP + constants_js_1.RECORD_SEP;
        return astm;
    };
    return PatientRecord;
}());
exports.PatientRecord = PatientRecord;
