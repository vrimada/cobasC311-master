import { COMPONENT_SEP, FIELD_SEP } from "../constants.js";

/***************************************
*             HeaderRecord             *
****************************************
* Sample header record text:
* H|\^&|||host^1|||||cobas c 311|TSDWN^BATCH|P|1 [CR]
* 
* H => esta fijada, es de tipo string, maximo 1 caracter
* |\^& => caracteres fijados
* | => Message Control ID
* | => Access Password
* | host^1 => Sender Name or ID
* | => Sender Street Address
* | => Reserved Field
* | => Sender Telephone Number
* | => Characteristics of Sender
* |cobas c 311 => Receiver ID
* |TSDWN^BATCH => Comment or Special Instructions. 
*       Setting is as follows: <Meaning of message>^< Mode of message >
 
        <Meaning of message> Type: ST Max: 5
        „TSREQ‟: TS inquiry.
        „TSDWN‟: Test selection download.
        „RSUPL„: Result report
        „PCUPL„: Photometry calibration report
        „ICUPL„: ISE calibration report
        „ABUPL‟: Absorbance report
        „RSREQ‟: Inquiry for the result

        <Mode of message> Type: ST Max: 5
        „REAL‟: communication in real time.
        „BATCH‟: communication based on request from cobas c 311/HOST.
        „REPLY‟: reply to the request.

|P => Processing ID
|1 => Version No.
**/
export class HeaderRecord{
        private tipo : string;
        private emisor : string;
        private receptor : string;
        private mensaje: string;
        private modoMensaje : string;
        private proceso : string;
        private version : string;
     
        constructor(){
                this.tipo = "";
                this.emisor = "";
                this.receptor = "";
                this.proceso = "";
                this.version = "";
                this.modoMensaje = "";
        }
        // #region GetterSetter

        public setTipo(_tipo : string){
                this.tipo = _tipo;
        }
        public getTipo(){
                return this.tipo;
        }

        public getEmisor(){
                return this.emisor;
        }

        public setEmisor(emisor : string){
                this.emisor = emisor;
        }

        public getReceptor(){
                return this.receptor;
        }

        public setReceptor(receptor : string){
                this.receptor = receptor;
        }

        public getMensaje(){
                return this.mensaje;
        }

        public setMensaje(_m : string){
                this.mensaje = _m;
        }

        public getProceso(){
                return this.proceso;
        }

        public setProceso(proceso : string){
                this.proceso = proceso;
        }

        public getVersion(){
                return this.version;
        }

        public setVersion(version : string){
                this.version = version;
        }

        public setModoMensaje(_modo : string){
                this.modoMensaje = _modo;
        }

        public getModoMensaje() : string{
                return this.modoMensaje;
        }

        // #endregion


        cargarHeaderDesdeASTM(record : string) : void{
                // Decodes ASTM record message
                let field = record.split(FIELD_SEP); 
                this.setTipo(field[0]);
                // <Sender‟s device name>^<Communication program version>
                let emisor = field[4].split(COMPONENT_SEP);
                this.setEmisor(emisor[0]); //Sender Name or ID
                this.setReceptor(field[9]); //Receiver ID

                //<Meaning of message>^< Mode of message >
                let instruccion = field[10].split(COMPONENT_SEP);
                this.setMensaje(instruccion[0]); //Comment or Special Instructions
                this.setModoMensaje(instruccion[1]);

                this.setProceso(field[11]); //Processing ID 'P' fixed.
                this.setVersion(field[12]); //Version No.
        }

        toASTM() : (string | string[] | (string | null)[][] | null)[] {
                return [ this.getTipo(), [ null,'&' ] ,null,null,[ this.getEmisor(), '1' ],null,null,null,null,this.getReceptor(),[ this.getMensaje(), this.getModoMensaje() ],this.getProceso(),this.getVersion()];
        }

}
