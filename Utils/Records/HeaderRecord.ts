import { COMPONENT_SEP, FIELD_SEP, RECORD_SEP, REPEAT_SEP, STX } from "../constants.js";


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
                this.mensaje = "";
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

        toArray() : (string | string[] | (string | null)[][] | null)[] {
                //Si las variables del constructor estan vacias podemos suponer que es porque se esta armando
                //el mensaje desde el SIL al COBAS
                return [ 
                        (this.getTipo() === '' ? 'H' : this.getTipo()),
                        [ [null], [null,'&'] ],
                        null,
                        null,
                        [(this.getEmisor() === '') ? 'SIL' : this.getEmisor(), '1'],
                        null,
                        null,
                        null,
                        null,
                        (this.getReceptor() === '') ? 'CobasC311' : this.getReceptor(),
                        [(this.getMensaje() === '') ? 'TSDWN' : this.getMensaje(),
                        (this.getModoMensaje() === '') ? 'BATCH' : this.getModoMensaje()], //estos valores son tomados del record.js original que tenia COBAS en produccion antes de la migracion
                        (this.getProceso() === '') ? 'P': this.getProceso(),
                        (this.getVersion() === '') ? '1' : this.getVersion()
                ];
        }

        toASTM() : string {
                let astm = "";
                let pipe = FIELD_SEP;
                astm += 'H' + pipe; //(1) Record Type ID
                astm += REPEAT_SEP  + "^&" +  pipe.repeat(3); //(2) Delimiter Definition
                astm += (this.getEmisor() === '' ? 'host' : this.getEmisor()) + COMPONENT_SEP + '1' + pipe.repeat(5); //(5) Sender Name or ID <Sender‟s device name>^<Communication program version>
                astm += (this.getReceptor() === '' ? 'cobas c 311' : this.getReceptor()) + pipe; //(10) Receiver ID
                astm += (this.getMensaje() === '' ? 'TSDWN' : this.getMensaje())+ COMPONENT_SEP; //(11) Comment or Special Instructions
                astm += (this.getModoMensaje()  === '' ? 'BATCH' : this.getModoMensaje()) + pipe;//(11) Comment or Special Instructions
                astm += (this.getProceso() === '' ? 'P': this.getProceso()) + pipe;//(12) Processing ID
                astm += (this.getVersion()  === '' ? '1' : this.getVersion());//(13) Version No.
                astm += RECORD_SEP; // \r //
                return astm;
        }
}
