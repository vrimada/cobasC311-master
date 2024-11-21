/***************************************
*              CommentRecord           *
****************************************
* Sample comment record text:
* C|1|I|                              ^                         ^                    ^               ^          |G
* 
* C => Record Type ID. C‟ fixed.
* |1 => Sequence Number. Indicates sequence No. Normally it is „1‟.
* |I => Comment Source. If comment is sent from Host, "L" is displayed. If comment is send from analyzer, "I" is displayed.
* |                              ^                         ^                    ^               ^          =>Indicates comment for sample. It is possible to display it on the screen and edit it.
*    If there is no comment, „^^^^‟ is needed to send using with no comment mode.
* |G => Comment Type. “G” fixed.
**/

import { FIELD_SEP } from "../constants.js";

export class CommentRecord {
    private fixed : string;
    private sequence : string;
    private fuente : string;
    private texto : string;
    private type : string;

    // #region GetterSetter
    public getFixed(){
        return this.fixed;
    }

    public setFixed(_fixed : string){
        this.fixed = _fixed;
    }

    public getFuente(){
        return this.fuente;
    }

    public setFuente(_fuente : string){
        this.fuente = _fuente;
    }

    public getTexto(){
        return this.texto;
    }

    public setTexto(_texto : string){
        this.texto = _texto;
    }

    public getType(){
        return this.type;
    }

    public setType(_type : string){
        this.type = _type;
    }

    public setSequence(arg0: string) {
       this.sequence = arg0;
    }

    public getSequence(){
        return this.sequence;
    }

    // #endregion

    //Metodo que lee el mensaje de cobas y 
    cargarOrderDesdeASTM(flow : string){
        let field = flow.split(FIELD_SEP);
        this.setFixed(field[0]);
        this.setSequence(field[1]);
        this.setFuente(field[2]);
        this.setTexto(field[3]);
        this.setType(field[4]);
    }
    


   
    toASTM() : (string | string[])[] {
        return [ 'C', '1','L',
            ['                              ','                         ','                    ','               ','          '], 
        'G'];
    }

    toASTM2() : (string | string[])[] {
        return [ 
            this.getFixed(), //Record Type ID - C‟ fixed.
            this.getSequence(), //Sequence Number
            this.getFuente(), //Comment Source - If comment is sent from Host, "L" is displayed. If comment is send from analyzer, "I" is displayed.
            this.getTexto(), //Comment Text
            this.getType() //Comment Type
        ];
    }
}