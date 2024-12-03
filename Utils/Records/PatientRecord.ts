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

import { TempProtocoloEnvio } from "../TempProtocoloEnvio";
import { COMPONENT_SEP, FIELD_SEP, RECORD_SEP } from "../constants.js";

export class PatientRecord{
    private _sex : string;
    private _name : string;
    private _birthdate : string;

    constructor(){ 
        this._sex = "";
        this._name = "";
        this._birthdate = "";
     }

    // #region GetterSetter
    getSex() : string{ 
        return this._sex;
    }

    setSex(sex : string){
        this._sex = sex;
    }

    getName() : string{
        return this._name;
    }

    setName(name : string){
        this._name = name;
    }

    getBirthdate() : string{
        return this._birthdate;
    }

    setBirthdate(birthdate : string){
       this._birthdate = birthdate;
    }

    // #endregion
    
    toArray() : (string | null[] | null)[] {
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
             [null,null]
        ];
    }

    cargarPatientRecord(protocol : TempProtocoloEnvio){
        this.setName(protocol.getPaciente());
        this.setBirthdate(protocol.getAnioNacimiento());
        this.setSex(protocol.getSexo());
    }

    
    cargarPatientDesdeASTM(record : string) : void {
        let field = record.split(FIELD_SEP);
        this.setBirthdate(field[7]);
        this.setSex(field[8]);
    }

    toASTM() : string {
        let pipe = FIELD_SEP;
        let astm = "P" + pipe + "1" + pipe + pipe + pipe + pipe + pipe + pipe + pipe + this.getSex();
        astm = astm  + pipe + pipe + pipe + pipe + pipe + pipe + COMPONENT_SEP + RECORD_SEP;

        return astm;
    }
    
}