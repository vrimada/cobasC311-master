import { formatDate } from '../toolbox.js';
import { TestRecord } from "./TestRecord.js";
import { FIELD_SEP } from '../constants.js';
/****************************
 * OrderRecord               *
 *****************************

 Sample order record text:
  
 * (Upload)
 * O|1|0^                   806^1^^001|R1|^^^458/|R||||||N||^^||SC|||      |                              ^                         ^                    ^               ^          |||20161111095305|||F'[CR]
 *
 * (Download)
 * O|1|0^                   333^1^^001|R1|^^^458/|R||||||A||^^||SC|||      |                              ^                         ^                    ^               ^          ||||||0'[CR]

 (Upload) Decodificado:
 * Sample order record decoded
 * [ 'O',
 * '1',
 * [ '0', '                   806', '1', null, '001' ],
 * 'R1',
 * [ null, null, null, '458/' ],
 * 'R',
 * null,
 * null,
 * null,
 * null,
 * null,
 * 'N',
 * null,
 * [ null, null, null ],
 * null,
 * 'SC',
 * null,
 * null,
 * '      ',
 * [ '                              ','                         ','                    ','               ','          ' ],
 * null,
 * null,
 * '20161111095305',
 * null,
 * null,
 * 'F' ],
 **/
export class OrderRecord {
    constructor() {
        this._type = "";
        this._seq = "";
        this._sampleId = "";
        this._prefijoTipoMuestra = "";
        this._biomaterial = 0;
        this._dateTimeReported = new Date();
        this._priority = "";
        this._sampleType = "";
        this._tests = new Array;
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
    setSampleId(sampleId) {
        this._sampleId = sampleId;
    }
    getSampleId() {
        return this._sampleId;
    }
    getPrefijoTipoMuestra() {
        return this._prefijoTipoMuestra;
    }
    setPrefijoTipoMuestra(prefijoTipoMuestra) {
        this._prefijoTipoMuestra = prefijoTipoMuestra;
    }
    getBiomaterial() {
        return this._biomaterial;
    }
    setBiomaterial(biomaterial) {
        this._biomaterial = biomaterial;
    }
    getDateTimeReported() {
        return this._dateTimeReported;
    }
    setDateTimeReported(dateTimeReported) {
        this._dateTimeReported = dateTimeReported;
    }
    getTests() {
        return this._tests;
    }
    setTests(tests) {
        this._tests = tests;
    }
    getPriority() {
        return this._priority;
    }
    setPriority(priority) {
        this._priority = priority;
    }
    getSampleType() {
        return this._sampleType;
    }
    setSampleType(sampleType) {
        this._sampleType = sampleType;
    }
    // #endregion
    // #region PARA_ENIAR_A_SIL
    /** Datos de COBAS a SIL
      * Carga el flujo de datos de Cobas a la clase Order
      */
    cargarOrderDesdeASTM(flow) {
        let field = flow.split(FIELD_SEP);
        let prefijoTipoMuestra = '';
        let id = field[2];
        this.setType(field[0]);
        this.setSeq(field[1]);
        this.setSampleId(field[2]);
        this.setBiomaterial(parseInt(field[15]));
        if (id.indexOf('-') > -1) {
            let complexOrderSampleId = id.split('-');
            id = complexOrderSampleId[0]; // Nro de protocolo
            prefijoTipoMuestra = complexOrderSampleId[1]; // Prefijo del tipo de muestra
        }
        this.setPrefijoTipoMuestra(prefijoTipoMuestra);
        //Tipo de muestra
        let tipo = field[3].split('^');
        this.setSampleType(tipo[4]);
        this.setPriority((field[5] === 'Y') ? 'S' : 'R'); // Prioridad
        this.cargarIdItemCobas(field[4]); //cargar muestras a testear
    }
    // #endregion
    // #region PARA_ENVIAR_A_COBAS
    /** Datos del SIL a COBAS
     * Carga el protocol del SIL a la clase Order
     */
    cargarOrderRecordParaCobas(protocol) {
        let tipoMuestraNombre = 'Suero/Plasma';
        let testsArreglo = [];
        let test;
        let testSplit;
        let testComponents = protocol.iditem.split(';');
        let idTest = "";
        let i = 0;
        for (i = 0; i < testComponents.length; i++) {
            // Cada item tiene la forma IdItem|TipoMuestra
            testSplit = testComponents[i].split('|');
            idTest = testSplit[0];
            tipoMuestraNombre = testSplit[1];
            test = new TestRecord(idTest);
            testsArreglo.push(test);
        }
        // Tipo de muestra
        let tipoMuestra = 1;
        switch (tipoMuestraNombre) {
            case "Suero/Plasma":
                tipoMuestra = 1;
                break;
            case "Orina":
                tipoMuestra = 2;
                break;
            case "CSF":
                tipoMuestra = 3;
                break;
            case "Suprnt":
                tipoMuestra = 4;
                break;
            case "Otros":
                tipoMuestra = 5;
                break;
        }
        this.setSampleId(protocol.numeroProtocolo.trim());
        this.setBiomaterial(tipoMuestra);
        this.setSampleType('S' + tipoMuestra);
        this.setTests(testsArreglo);
        this.setPriority((protocol.urgente === 'Y') ? 'S' : 'R'); // Prioridad
    }
    cargarIdItemCobas(field) {
        /**
         * ^^^<ApplicationCode>^<Dilution>\… Repeat \ (delimiter) for multiple test selection.
         * Ejemplo
         *  ^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^
         * PROBLEMA: La cadena scopea el \ y da como resultado el string
         * ^^^717^^^^418^^^^798^^^^570^^^^435^^^^690^^^^781^
         * Conlusion: Cada 4 tenemos el id de la aplicacion
         */
        //Muestras/Codigos a analizar
        let testsArreglo = [];
        /* field.split(REPEAT_SEP).forEach(element => {
             var itemsArray = element.split(COMPONENT_SEP);
             testsArreglo.push(new TestRecord(itemsArray[3]));
         });*/
        let tests = field.split('^');
        let i = 3; //Arranca en 3 porque tiene la forma ^^^<ApplicationCode>
        while (i < tests.length) {
            let testRecord = new TestRecord(tests[i]);
            testsArreglo.push(testRecord);
            i = i + 4;
        }
        this.setTests(testsArreglo);
    }
    toASTMTestComponent(testArray) {
        var test = [null, null, null, testArray[0].getId(), null];
        if (testArray.length == 1) {
            return test;
        }
        else {
            return [test, this.toASTMTestComponent(testArray.slice(1))];
        }
    }
    toASTMTestComponente() {
        let arregloFinal = [];
        this.getTests().forEach(element => {
            //^^^<ApplicationCode>^<Dilution>\… Repeat \ (delimiter) for multiple test selection.
            arregloFinal.push(null);
            arregloFinal.push(null);
            arregloFinal.push(null);
            arregloFinal.push(element.getId());
        });
        return arregloFinal;
    }
    toASTM() {
        var timestamp = formatDate(new Date(), 'yyyyMMddHHmmss');
        return [
            this.getType(),
            this.getSeq(),
            this.getSampleId(),
            ['0', null, null, null, this.getSampleType(), 'SC'], //[ null, null, null, null, null,null], // [ '0', '50001', '001', null, 'S1','SC'], S1=Plasma, S2=Urine
            this.toASTMTestComponente(),
            this.getPriority(),
            null, // Requested/Ordered Date and Time                                
            timestamp, // Indicates reception date and time of request.  Setting is as follows.  Deletable. YYYYMMDDHHMMSS
            null,
            null,
            null,
            'A', //A: => test order form HOST. (Download)
            null,
            null,
            null,
            this.getBiomaterial(), // This field indicates the type of sample. 1=Plasma, 2=Urine
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            'O'
        ];
    }
}
