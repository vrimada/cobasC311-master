import  { formatDate }  from '../toolbox.js';
import { TestRecord } from "./TestRecord.js";
import {  FIELD_SEP } from '../constants.js';
  
  
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
       private _prefijoTipoMuestra : string;  
       private _biomaterial : number;
       private _dateTimeReported : Date;
       private _priority : string;
       private _sampleType : string;
       private _tests : TestRecord[];

        constructor(){
           this._type = "";
           this._seq = "";
           this._sampleId = "";
           this._prefijoTipoMuestra = "";
           this._biomaterial = 0;
           this._dateTimeReported = new Date();
           this._priority = "";
           this._sampleType = "";
           this._tests = new Array<TestRecord>;
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
    
       // #endregion
        

       // #region PARA_ENIAR_A_SIL

       /** Datos de COBAS a SIL
         * Carga el flujo de datos de Cobas a la clase Order
         */
       
        cargarOrderDesdeASTM(flow : string){
            let field : string[] = flow.split(FIELD_SEP);
            let prefijoTipoMuestra : string = '';  
            let id : string = field[2];
            this.setType(field[0]);
            this.setSeq(field[1]);
            this.setSampleId(field[2]);
            this.setBiomaterial(parseInt(field[15]));

            if (id.indexOf('-')> -1){
                let complexOrderSampleId : string[] = id.split('-');
                id =  complexOrderSampleId[0];            // Nro de protocolo
                prefijoTipoMuestra = complexOrderSampleId[1];   // Prefijo del tipo de muestra
            }
            
            this.setPrefijoTipoMuestra(prefijoTipoMuestra);
            //Tipo de muestra
            let tipo = field[3].split('^');
            this.setSampleType( tipo[4]);
            this.setPriority((field[5] === 'Y') ?  'S' : 'R'); // Prioridad
            this.cargarIdItemCobas(field[4]); //cargar muestras a testear
        }

        // #endregion


        // #region PARA_ENVIAR_A_COBAS
        /** Datos del SIL a COBAS
         * Carga el protocol del SIL a la clase Order
         */
        cargarOrderRecordParaCobas(protocol : any){

            let tipoMuestraNombre : string = 'Suero/Plasma';
            let testsArreglo : TestRecord[] = [];
            let test : TestRecord;
            let testSplit : string[];
            let testComponents : string = protocol.iditem.split(';');
            let idTest : string = "";
            let i : number = 0;

            for (i = 0; i < testComponents.length; i++) {
                // Cada item tiene la forma IdItem|TipoMuestra
                testSplit = testComponents[i].split('|');
                idTest = testSplit[0];
                tipoMuestraNombre = testSplit[1];
                test  = new TestRecord(idTest);
                testsArreglo.push(test);
            }
             // Tipo de muestra
            let tipoMuestra : number = 1;
            switch (tipoMuestraNombre){
                    case "Suero/Plasma": tipoMuestra = 1; break;
                    case "Orina": tipoMuestra = 2; break;
                    case "CSF": tipoMuestra = 3; break;
                    case "Suprnt": tipoMuestra = 4; break;
                    case "Otros": tipoMuestra = 5; break;
            }

            this.setSampleId(protocol.numeroProtocolo.trim());
            this.setBiomaterial(tipoMuestra);
            this.setSampleType( 'S' + tipoMuestra);
            this.setTests(testsArreglo);
            this.setPriority((protocol.urgente === 'Y') ?  'S' : 'R'); // Prioridad
        }

        cargarIdItemCobas(field : string){
            /**
             * ^^^<ApplicationCode>^<Dilution>\… Repeat \ (delimiter) for multiple test selection.
             * Ejemplo 
             *  ^^^717^\^^^418^\^^^798^\^^^570^\^^^435^\^^^690^\^^^781^
             * PROBLEMA: La cadena scopea el \ y da como resultado el string 
             * ^^^717^^^^418^^^^798^^^^570^^^^435^^^^690^^^^781^ 
             * Conlusion: Cada 4 tenemos el id de la aplicacion
             */

            //Muestras/Codigos a analizar
            let testsArreglo : TestRecord[] = [];
          

           /* field.split(REPEAT_SEP).forEach(element => {
                var itemsArray = element.split(COMPONENT_SEP);
                testsArreglo.push(new TestRecord(itemsArray[3]));
            });*/
            
          
            let tests : string[] = field.split('^');
            let i : number = 3; //Arranca en 3 porque tiene la forma ^^^<ApplicationCode>
            while(i < tests.length){
                let testRecord : TestRecord  = new TestRecord(tests[i]);
                testsArreglo.push(testRecord);
                i = i + 4;
            }


            this.setTests(testsArreglo);
        }

        toASTMTestComponent (testArray : TestRecord[]) {
            var test = [null, null, null, testArray[0].getId(), null];
            if (testArray.length == 1){
                return test;
            } 
            else{
                return [test, this.toASTMTestComponent(testArray.slice(1))]
            }
        }

        toASTMTestComponente(){
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
            var timestamp = formatDate(new Date(),'yyyyMMddHHmmss');

            return [ 
                this.getType(),
                this.getSeq(),
                this.getSampleId(),
                [ '0', null, null, null, this.getSampleType(),'SC'],//[ null, null, null, null, null,null], // [ '0', '50001', '001', null, 'S1','SC'], S1=Plasma, S2=Urine
                this.toASTMTestComponente(), 
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
                'O' 
            ];
        }

        // #endregion
    }