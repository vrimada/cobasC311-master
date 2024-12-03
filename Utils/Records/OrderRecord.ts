import  { formatDate }  from '../toolbox';
import { TestRecord } from "./TestRecord";
import {  COMPONENT_SEP, FIELD_SEP, RECORD_SEP, REPEAT_SEP } from '../constants';
import { TempProtocoloEnvio } from '../TempProtocoloEnvio';
  
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

    export class OrderRecord{
       private _type : string;
       private _seq : string;
       private _sampleId : string; 
       private _instrument : string[];
       private _prefijoTipoMuestra : string;  
       private _biomaterial : number;
       private _dateTimeReported : Date;
       private _priority : string;
       private _sampleType : string;
       private _tests : TestRecord[];
       private _accion : string;
       private reportTipo : string;

        constructor(){
           this._type = "";
           this._seq = "";
           this._sampleId = "";
           this._instrument = [];
           this._prefijoTipoMuestra = "";
           this._biomaterial = 0;
           this._dateTimeReported = new Date();
           this._priority = "";
           this._sampleType = "";
           this._tests = new Array<TestRecord>;
           this._accion = "";
           this.reportTipo = "";
        }
        
      
        // #region GetterSetter
        getType() : string{
            return this._type;
        }
    
        setType(type : string){
            this._type = type;
        }
    
        getSeq(){
            return this._seq;
        }
    
        setSeq(seq : string){
            this._seq = seq;
        }
    
        setSampleId(sampleId : string){
            this._sampleId = sampleId;
        }
    
        getSampleId() : string{
            return this._sampleId;
        }

        setInstrument(_ins : string[]){
            this._instrument = _ins;
        }

        getInstrument(){
            return this._instrument;
        }
    
        getPrefijoTipoMuestra() : string{
            return this._prefijoTipoMuestra;
        }
    
        setPrefijoTipoMuestra(prefijoTipoMuestra : string){
            this._prefijoTipoMuestra = prefijoTipoMuestra;
        }
    
        getBiomaterial() : number{
            return this._biomaterial;
        }
    
        setBiomaterial(biomaterial : number){
            this._biomaterial = biomaterial;
        }
    
        getDateTimeReported() : Date{
            return this._dateTimeReported;
        }
    
        setDateTimeReported(dateTimeReported : Date){
            this._dateTimeReported = dateTimeReported;
        }
    
        getTests() : TestRecord[]{
            return this._tests;
        }
    
        setTests(tests : TestRecord[]){
            this._tests = tests;
        }
    
        getPriority(): string{
            return this._priority;
        }
    
        setPriority(priority : string){
            this._priority = priority;
        }
    
        getSampleType() : string{
            return this._sampleType;
        }
    
        setSampleType(sampleType : string){
            this._sampleType = sampleType;
        }

        getAccion(){
            return this._accion;
        }

        setAccion(_acc : string){
            this._accion = _acc;
        }
    
        setReportTipo(_reportTipo : string){
            this.reportTipo = _reportTipo;
        }

        getReportTipo(){
            return this.reportTipo;
        }
       // #endregion
        

       // #region PARA_ENVIAR_A_SIL

       /** Datos de COBAS a SIL
         * Carga el flujo de datos de Cobas a la clase Order
         * Se utilizo el PDF del repositorio para identificar la estructura del Order Record
         */
       
        cargarOrderDesdeASTM(flow : string){
            let field : string[] = flow.split(FIELD_SEP);
            let prefijoTipoMuestra : string = '';  
            let id : string = field[2];

            this.setType(field[0]); //(1)Record Type ID
            this.setSeq(field[1]); //(2)Sequence Number
            this.setSampleId(field[2]); //(3)Specimen ID

            let instrument = field[3].split('^'); //(4)Instrument Specimen ID
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
            this.setSampleType(instrument[4]);   //Tipo de muestra

            // #region ArrayTestMuestras
            //cargar muestras a testear
            let testsArreglo : TestRecord[] = [];
            let tests : string[] = field[4].split('^');
            let i : number = 3; //Arranca en 3 porque tiene la forma ^^^<ApplicationCode>
            while(i < tests.length){
                let testRecord : TestRecord  = new TestRecord(tests[i]);
                testsArreglo.push(testRecord);
                i = i + 4;
            }
            // #endregion

            this.setTests(testsArreglo); //(5)Universal Test ID


            this.setPriority((field[5] === 'Y') ?  'S' : 'R'); //(6)Prioridad
            this.setAccion(field[11]); //(12)Action Code
            this.setBiomaterial(parseInt(field[15])); //(16)Specimen Descriptor
            this.setReportTipo(field[25]); //(26) Report Types
            if (id.indexOf('-')> -1){
                let complexOrderSampleId : string[] = id.split('-');
                id =  complexOrderSampleId[0];            // Nro de protocolo
                prefijoTipoMuestra = complexOrderSampleId[1];   // Prefijo del tipo de muestra
            }
            this.setPrefijoTipoMuestra(prefijoTipoMuestra);
            
        }

        // #endregion


        // #region PARA_ENVIAR_A_COBAS
        /** Datos del SIL a COBAS
         * Carga el protocol del SIL a la clase Order
         */
        cargarOrderRecordParaCobas(protocol : TempProtocoloEnvio){
            let tipoMuestraNombre : string = 'Suero/Plasma';
            let testsArreglo : TestRecord[] = [];
            let test : TestRecord;
            let testSplit : string[];
            let testComponents : string[] = protocol.getIdItem().split(';');
            let idTest : string = "";
            let i : number = 0;

            this.setType('O');
            this.setSeq('1');

            for (i = 0; i < testComponents.length; i++) {
                // Cada item tiene la forma IdItem|TipoMuestra
                testSplit = testComponents[i].split('|');
                idTest = testSplit[0];
                tipoMuestraNombre = testSplit[1];
                test  = new TestRecord(idTest);
                testsArreglo.push(test);
            }
            this.setTests(testsArreglo);
             // Tipo de muestra
            let tipoMuestra : number = 1;
            switch (tipoMuestraNombre){
                case "Suero/Plasma": tipoMuestra = 1; break;
                case "Orina": tipoMuestra = 2; break;
                case "CSF": tipoMuestra = 3; break;
                case "Suprnt": tipoMuestra = 4; break;
                case "Otros": tipoMuestra = 5; break;
            }
            this.setSampleId(protocol.getNumeroProtocolo().trim());
            this.setBiomaterial(tipoMuestra);
            this.setSampleType( 'S' + tipoMuestra);

            // <SequenceNo>^<Rack ID>^<PositionNo>^ ^<SampleType>^<ContainerType>
            this.setInstrument(["0", "", "", "S"+ tipoMuestra, "SC"]);
           

            this.setPriority((protocol.getUrgente() === 'Y') ?  'S' : 'R'); // Prioridad
            this.setAccion("A");
            this.setReportTipo("O");
        }

       
        
        /**
         * cobas type (Upload) : se tiene que poner al final 'F'  @type Tiene que ir en True (de Cobas a Sil)
         * cobas type (Download) : se tiene que poner al final 'O' @type tiene que ir en False (de Sil a Cobas)
         */
       /* toArray() {
            var timestamp = formatDate(new Date(),'yyyyMMddHHmmss');
            let arregloFinal : any = [];

            this.getTests().forEach(element => {
                let arregloItem = [];
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
                [ '0', null, null, null, this.getSampleType(),'SC'],//[ null, null, null, null, null,null], // [ '0', '50001', '001', null, 'S1','SC'], S1=Plasma, S2=Urine
                arregloFinal, 
                this.getPriority(),
                null,                       // Requested/Ordered Date and Time                                
                timestamp,                  // Indicates reception date and time of request.  Setting is as follows.  Deletable. YYYYMMDDHHMMSS
                null,
                null,
                null,
                'A', //A: => test order form HOST. (Download)
                null,
                null,
                null,
                this.getBiomaterial(),           // This field indicates the type of sample. 1=Plasma, 2=Urine
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
        }*/
        // #endregion

        toASTM() : string{
              let astm : string = "";
            let pipe : string = FIELD_SEP;
            let sep : string = COMPONENT_SEP;
            var timestamp : string = formatDate(new Date(),'yyyyMMddHHmmss');
            let instrument : string[] = this.getInstrument();
            let tests : TestRecord[] = this.getTests();
            let muestrasAnalizar : string= "";
            tests.forEach(element => {
                muestrasAnalizar += sep.repeat(3) + element.getId() + sep + REPEAT_SEP;
            });
            muestrasAnalizar = muestrasAnalizar.substring(0,muestrasAnalizar.length-1);
            
            astm += 'O'  + pipe;//(1)/Record Type ID
            astm += (this.getSeq() === '' ? "1" : this.getSeq()) + pipe; //(2)Sequence Number
            astm += this.getSampleId() + pipe;//(3)Specimen ID 
            astm += instrument[0] + sep + instrument[1] + sep + instrument[2] + sep + instrument[3] + sep + instrument[4] + pipe;  //(4)Instrument Specimen ID:   <SequenceNo>^<Rack ID>^<PositionNo>^ ^<SampleType>^<ContainerType>
            astm += muestrasAnalizar + pipe;//(5)Universal Test ID
            astm += (this.getPriority() === '' ? 'R' : this.getPriority()) + pipe.repeat(2);//(6)Priority
            astm += timestamp + pipe.repeat(4);//(8)Specimen Collection Date and Time
            astm += this.getAccion() + pipe.repeat(4); //(12)Action Code
            astm += this.getBiomaterial() + pipe.repeat(10);//(16)Specimen Descriptor
            astm += this.getReportTipo();//(26)Report Types
            astm += RECORD_SEP;
            return astm;
        }
    }