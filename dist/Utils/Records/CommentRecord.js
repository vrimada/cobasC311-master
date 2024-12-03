"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRecord = void 0;
const constants_1 = require("../constants");
class CommentRecord {
    constructor() {
        this.fixed = "";
        this.sequence = "";
        this.fuente = "";
        this.type = "";
        this.comentarios = new Array;
    }
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
    getComentarios() {
        return this.comentarios;
    }
    setComentarios(_texto) {
        this.comentarios = _texto;
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
    //Metodo que lee el mensaje de cobas  
    cargarOrderDesdeASTM(flow) {
        let field = flow.split(constants_1.FIELD_SEP);
        this.setFixed(field[0]);
        this.setSequence(field[1]);
        this.setFuente(field[2]);
        let comentarios = field[3].split(constants_1.COMPONENT_SEP);
        let comentArray = new Array;
        comentarios.forEach(coment => {
            comentArray.push(coment);
        });
        this.setComentarios(comentArray);
        this.setType(field[4]);
    }
    /* toArray() : (string | string[])[] {
         return [ 'C', '1','L',
             ['                              ','                         ','                    ','               ','          '],
         'G'];
     }
 
     toArray2() : (string | string[])[] {
         return [
             (this.getFixed() === '' ? 'C' : this.getFixed()), //Record Type ID - C‟ fixed.
             (this.getSequence()  === '' ? '1' : this.getSequence()), //Sequence Number
             (this.getFuente()  === '' ? 'L' : this.getFuente()), //Comment Source - If comment is sent from Host, "L" is displayed. If comment is send from analyzer, "I" is displayed.
             (this.getComentarios().length  === 0 ? ['                              ','                         ','                    ','               ','          ']
             : [this.getComentarios().shift()]), //Comment Text
             (this.getType()  === '' ? 'G' : this.getType()) //Comment Type
         ];
     }*/
    toASTM() {
        let pipe = constants_1.FIELD_SEP;
        let astm = "";
        let rep = constants_1.COMPONENT_SEP;
        let comentarios = "";
        if (this.getComentarios().length === 0) {
            const Comment1 = ' '.repeat(30); // Comment1 30 ST
            const Comment2 = ' '.repeat(25); // Comment2 25 ST
            const Comment3 = ' '.repeat(20); // Comment3 20 ST
            const Comment4 = ' '.repeat(15); // Comment4 15 ST
            const Comment5 = ' '.repeat(10); // Comment5 10 ST
            comentarios = Comment1 + rep + Comment2 + rep + Comment3 + rep + Comment4 + rep + Comment5;
        }
        else {
            let com = this.getComentarios();
            com.forEach(elemento => {
                comentarios += elemento + rep;
            });
            comentarios = comentarios.substring(0, comentarios.length - 1);
        }
        astm = astm + 'C' + pipe; //Record Type ID: *C* Fixed
        astm = astm + (this.getSequence() === '' ? '1' : this.getSequence()) + pipe;
        astm = astm + (this.getFuente() === '' ? 'L' : this.getFuente()) + pipe;
        astm = astm + comentarios + pipe;
        astm = astm + 'G' + constants_1.RECORD_SEP; //Comment Type: FIxed G
        return astm;
    }
}
exports.CommentRecord = CommentRecord;
