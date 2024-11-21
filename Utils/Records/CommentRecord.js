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
    // #region GetterSetter
    getFixed() {
        return this.fixed;
    }
    setFixed(_fixed) {
        this.fixed = _fixed;
    }
    getFuente() {
        return this.fuente;
    }
    setFuente(_fuente) {
        this.fuente = _fuente;
    }
    getTexto() {
        return this.texto;
    }
    setTexto(_texto) {
        this.texto = _texto;
    }
    getType() {
        return this.type;
    }
    setType(_type) {
        this.type = _type;
    }
    setSequence(arg0) {
        this.sequence = arg0;
    }
    getSequence() {
        return this.sequence;
    }
    // #endregion
    //Metodo que lee el mensaje de cobas y 
    cargarOrderDesdeASTM(flow) {
        let field = flow.split(FIELD_SEP);
        this.setFixed(field[0]);
        this.setSequence(field[1]);
        this.setFuente(field[2]);
        this.setTexto(field[3]);
        this.setType(field[4]);
    }
    toASTM() {
        return ['C', '1', 'L',
            ['                              ', '                         ', '                    ', '               ', '          '],
            'G'];
    }
    toASTM2() {
        return [
            this.getFixed(), //Record Type ID - C‟ fixed.
            this.getSequence(), //Sequence Number
            this.getFuente(), //Comment Source - If comment is sent from Host, "L" is displayed. If comment is send from analyzer, "I" is displayed.
            this.getTexto(), //Comment Text
            this.getType() //Comment Type
        ];
    }
}
