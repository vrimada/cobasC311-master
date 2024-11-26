"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRecord = void 0;
var toolbox_1 = require("../toolbox");
var TestRecord_1 = require("./TestRecord");
var constants_1 = require("../constants");
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
var OrderRecord = /** @class */ (function () {
    function OrderRecord() {
        this._type = "";
        this._seq = "";
        this._sampleId = "";
        this._instrument = [];
        this._prefijoTipoMuestra = "";
        this._biomaterial = 0;
        this._dateTimeReported = new Date();
        this._priority = "";
        this._sampleType = "";
        this._tests = new Array;
        this._accion = "";
        this.reportTipo = "";
    }
    // #region GetterSetter
    OrderRecord.prototype.getType = function () {
        return this._type;
    };
    OrderRecord.prototype.setType = function (type) {
        this._type = type;
    };
    OrderRecord.prototype.getSeq = function () {
        return this._seq;
    };
    OrderRecord.prototype.setSeq = function (seq) {
        this._seq = seq;
    };
    OrderRecord.prototype.setSampleId = function (sampleId) {
        this._sampleId = sampleId;
    };
    OrderRecord.prototype.getSampleId = function () {
        return this._sampleId;
    };
    OrderRecord.prototype.setInstrument = function (_ins) {
        this._instrument = _ins;
    };
    OrderRecord.prototype.getInstrument = function () {
        return this._instrument;
    };
    OrderRecord.prototype.getPrefijoTipoMuestra = function () {
        return this._prefijoTipoMuestra;
    };
    OrderRecord.prototype.setPrefijoTipoMuestra = function (prefijoTipoMuestra) {
        this._prefijoTipoMuestra = prefijoTipoMuestra;
    };
    OrderRecord.prototype.getBiomaterial = function () {
        return this._biomaterial;
    };
    OrderRecord.prototype.setBiomaterial = function (biomaterial) {
        this._biomaterial = biomaterial;
    };
    OrderRecord.prototype.getDateTimeReported = function () {
        return this._dateTimeReported;
    };
    OrderRecord.prototype.setDateTimeReported = function (dateTimeReported) {
        this._dateTimeReported = dateTimeReported;
    };
    OrderRecord.prototype.getTests = function () {
        return this._tests;
    };
    OrderRecord.prototype.setTests = function (tests) {
        this._tests = tests;
    };
    OrderRecord.prototype.getPriority = function () {
        return this._priority;
    };
    OrderRecord.prototype.setPriority = function (priority) {
        this._priority = priority;
    };
    OrderRecord.prototype.getSampleType = function () {
        return this._sampleType;
    };
    OrderRecord.prototype.setSampleType = function (sampleType) {
        this._sampleType = sampleType;
    };
    OrderRecord.prototype.getAccion = function () {
        return this._accion;
    };
    OrderRecord.prototype.setAccion = function (_acc) {
        this._accion = _acc;
    };
    OrderRecord.prototype.setReportTipo = function (_reportTipo) {
        this.reportTipo = _reportTipo;
    };
    OrderRecord.prototype.getReportTipo = function () {
        return this.reportTipo;
    };
    // #endregion
    // #region PARA_ENVIAR_A_SIL
    /** Datos de COBAS a SIL
      * Carga el flujo de datos de Cobas a la clase Order
      * Se utilizo el PDF del repositorio para identificar la estructura del Order Record
      */
    OrderRecord.prototype.cargarOrderDesdeASTM = function (flow) {
        var field = flow.split(constants_1.FIELD_SEP);
        var prefijoTipoMuestra = '';
        var id = field[2];
        this.setType(field[0]); //(1)Record Type ID
        this.setSeq(field[1]); //(2)Sequence Number
        this.setSampleId(field[2]); //(3)Specimen ID
        var instrument = field[3].split('^'); //(4)Instrument Specimen ID
        this.setInstrument(instrument);
        //Setting is as follows:
        //< SequenceNo>^<Rack ID>^<PositionNo>^ ^
        //<SampleType>^<ContainerType>
        // console.dir("instrument < SequenceNo> "+ instrument[0]);
        // console.dir("instrument <Rack ID> "+ instrument[1]);
        // console.dir("instrument <PositionNo> "+ instrument[2]);
        // console.dir("instrument "+ instrument[3]);
        // console.dir("instrument <SampleType> "+ instrument[4]);
        // console.dir("instrument <ContainerType> "+ instrument[5]);
        this.setSampleType(instrument[4]); //Tipo de muestra
        // #region ArrayTestMuestras
        //cargar muestras a testear
        var testsArreglo = [];
        var tests = field[4].split('^');
        var i = 3; //Arranca en 3 porque tiene la forma ^^^<ApplicationCode>
        while (i < tests.length) {
            var testRecord = new TestRecord_1.TestRecord(tests[i]);
            testsArreglo.push(testRecord);
            i = i + 4;
        }
        // #endregion
        this.setTests(testsArreglo); //(5)Universal Test ID
        this.setPriority((field[5] === 'Y') ? 'S' : 'R'); //(6)Prioridad
        this.setAccion(field[11]); //(12)Action Code
        this.setBiomaterial(parseInt(field[15])); //(16)Specimen Descriptor
        this.setReportTipo(field[25]); //(26) Report Types
        if (id.indexOf('-') > -1) {
            var complexOrderSampleId = id.split('-');
            id = complexOrderSampleId[0]; // Nro de protocolo
            prefijoTipoMuestra = complexOrderSampleId[1]; // Prefijo del tipo de muestra
        }
        this.setPrefijoTipoMuestra(prefijoTipoMuestra);
    };
    // #endregion
    // #region PARA_ENVIAR_A_COBAS
    /** Datos del SIL a COBAS
     * Carga el protocol del SIL a la clase Order
     */
    OrderRecord.prototype.cargarOrderRecordParaCobas = function (protocol) {
        var tipoMuestraNombre = 'Suero/Plasma';
        var testsArreglo = [];
        var test;
        var testSplit;
        var testComponents = protocol[0].iditem.split(';');
        var idTest = "";
        var i = 0;
        this.setType('O');
        this.setSeq('1');
        for (i = 0; i < testComponents.length; i++) {
            // Cada item tiene la forma IdItem|TipoMuestra
            testSplit = testComponents[i].split('|');
            idTest = testSplit[0];
            tipoMuestraNombre = testSplit[1];
            test = new TestRecord_1.TestRecord(idTest);
            testsArreglo.push(test);
        }
        this.setTests(testsArreglo);
        // Tipo de muestra
        var tipoMuestra = 1;
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
        this.setSampleId(protocol[0].numeroProtocolo.trim());
        this.setBiomaterial(tipoMuestra);
        this.setSampleType('S' + tipoMuestra);
        // <SequenceNo>^<Rack ID>^<PositionNo>^ ^<SampleType>^<ContainerType>
        var arrayInstrument = [];
        arrayInstrument.push("0"); //<SequenceNo>
        arrayInstrument.push(""); //<Rack ID>
        arrayInstrument.push(""); //<PositionNo>
        arrayInstrument.push(("S" + tipoMuestra)); //<SampleType>
        arrayInstrument.push("SC"); //<SampleType> „SC‟: Standerd cup. „MC‟:Micro cup.
        this.setInstrument(arrayInstrument); //
        this.setPriority((protocol[0].urgente === 'Y') ? 'S' : 'R'); // Prioridad
        this.setAccion("A");
        this.setReportTipo("O");
    };
    /**
     * cobas type (Upload) : se tiene que poner al final 'F'  @type Tiene que ir en True (de Cobas a Sil)
     * cobas type (Download) : se tiene que poner al final 'O' @type tiene que ir en False (de Sil a Cobas)
     */
    OrderRecord.prototype.toArray = function () {
        var timestamp = (0, toolbox_1.formatDate)(new Date(), 'yyyyMMddHHmmss');
        var arregloFinal = [];
        this.getTests().forEach(function (element) {
            var arregloItem = [];
            //^^^<ApplicationCode>^<Dilution>\… Repeat \ (delimiter) for multiple test selection.
            arregloItem.push(null);
            arregloItem.push(null);
            arregloItem.push(null);
            arregloItem.push(element.getId());
            arregloFinal.push(arregloItem);
        });
        return [
            this.getType(),
            this.getSeq(),
            this.getSampleId(),
            ['0', null, null, null, this.getSampleType(), 'SC'], //[ null, null, null, null, null,null], // [ '0', '50001', '001', null, 'S1','SC'], S1=Plasma, S2=Urine
            arregloFinal,
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
            this.getReportTipo()
        ];
    };
    // #endregion
    OrderRecord.prototype.toASTM = function () {
        var astm = "";
        var pipe = constants_1.FIELD_SEP;
        var sep = constants_1.COMPONENT_SEP;
        var timestamp = (0, toolbox_1.formatDate)(new Date(), 'yyyyMMddHHmmss');
        var instrument = this.getInstrument();
        var tests = this.getTests();
        var muestrasAnalizar = "";
        tests.forEach(function (element) {
            muestrasAnalizar += sep.repeat(3) + element.getId() + sep + constants_1.REPEAT_SEP;
        });
        muestrasAnalizar = muestrasAnalizar.substring(0, muestrasAnalizar.length - 1);
        astm += 'O' + pipe; //(1)/Record Type ID
        astm += (this.getSeq() === '' ? "1" : this.getSeq()) + pipe; //(2)Sequence Number
        astm += this.getSampleId() + pipe; //(3)Specimen ID 
        astm += instrument[0] + sep + instrument[1] + sep + instrument[2] + sep + instrument[3] + sep + instrument[4] + sep + instrument[5] + pipe; //(4)Instrument Specimen ID:   <SequenceNo>^<Rack ID>^<PositionNo>^ ^<SampleType>^<ContainerType>
        astm += muestrasAnalizar + pipe; //(5)Universal Test ID
        astm += (this.getPriority() === '' ? 'R' : this.getPriority()) + pipe.repeat(2); //(6)Priority
        astm += timestamp + pipe.repeat(4); //(8)Specimen Collection Date and Time
        astm += this.getAccion() + pipe.repeat(4); //(12)Action Code
        astm += this.getBiomaterial() + pipe.repeat(10); //(16)Specimen Descriptor
        astm += this.getReportTipo(); //(26)Report Types
        astm += constants_1.RECORD_SEP;
        return astm;
    };
    return OrderRecord;
}());
exports.OrderRecord = OrderRecord;
