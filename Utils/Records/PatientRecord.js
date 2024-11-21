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
import { FIELD_SEP } from "../constants.js";
export class PatientRecord {
    constructor() {
        this._sex = "";
        this._name = "";
        this._birthdate = "";
    }
    // #region GetterSetter
    getSex() {
        return this._sex;
    }
    setSex(sex) {
        this._sex = sex;
    }
    getName() {
        return this._name;
    }
    setName(name) {
        this._name = name;
    }
    getBirthdate() {
        return this._birthdate;
    }
    setBirthdate(birthdate) {
        this._birthdate = birthdate;
    }
    // #endregion
    toASTM() {
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
    }
    cargarPatientRecord(protocol) {
        this.setName(protocol.paciente);
        this.setBirthdate(protocol.anioNacimiento);
        this.setSex(protocol.sexo);
    }
    cargarPatientDesdeASTM(record) {
        let field = record.split(FIELD_SEP);
        this.setBirthdate(field[7]);
        this.setSex(field[8]);
    }
}
