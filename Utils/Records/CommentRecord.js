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
var constants_1 = require("../constants");
var CommentRecord = /** @class */ (function () {
    function CommentRecord() {
        this.fixed = "";
        this.sequence = "";
        this.fuente = "";
        this.type = "";
        this.comentarios = new Array;
    }
    // #region GetterSetter
    CommentRecord.prototype.getFixed = function () {
        return this.fixed;
    };
    CommentRecord.prototype.setFixed = function (_fixed) {
        this.fixed = _fixed;
    };
    CommentRecord.prototype.getFuente = function () {
        return this.fuente;
    };
    CommentRecord.prototype.setFuente = function (_fuente) {
        this.fuente = _fuente;
    };
    CommentRecord.prototype.getComentarios = function () {
        return this.comentarios;
    };
    CommentRecord.prototype.setComentarios = function (_texto) {
        this.comentarios = _texto;
    };
    CommentRecord.prototype.getType = function () {
        return this.type;
    };
    CommentRecord.prototype.setType = function (_type) {
        this.type = _type;
    };
    CommentRecord.prototype.setSequence = function (arg0) {
        this.sequence = arg0;
    };
    CommentRecord.prototype.getSequence = function () {
        return this.sequence;
    };
    // #endregion
    //Metodo que lee el mensaje de cobas  
    CommentRecord.prototype.cargarOrderDesdeASTM = function (flow) {
        var field = flow.split(constants_1.FIELD_SEP);
        this.setFixed(field[0]);
        this.setSequence(field[1]);
        this.setFuente(field[2]);
        var comentarios = field[3].split(constants_1.COMPONENT_SEP);
        var comentArray = new Array;
        comentarios.forEach(function (coment) {
            comentArray.push(coment);
        });
        this.setComentarios(comentArray);
        this.setType(field[4]);
    };
    CommentRecord.prototype.toArray = function () {
        return ['C', '1', 'L',
            ['                              ', '                         ', '                    ', '               ', '          '],
            'G'];
    };
    CommentRecord.prototype.toArray2 = function () {
        return [
            (this.getFixed() === '' ? 'C' : this.getFixed()), //Record Type ID - C‟ fixed.
            (this.getSequence() === '' ? '1' : this.getSequence()), //Sequence Number
            (this.getFuente() === '' ? 'L' : this.getFuente()), //Comment Source - If comment is sent from Host, "L" is displayed. If comment is send from analyzer, "I" is displayed.
            (this.getComentarios().length === 0 ? ['                              ', '                         ', '                    ', '               ', '          ']
                : [this.getComentarios().shift()]), //Comment Text
            (this.getType() === '' ? 'G' : this.getType()) //Comment Type
        ];
    };
    CommentRecord.prototype.toASTM = function () {
        var pipe = constants_1.FIELD_SEP;
        var astm = "";
        var rep = constants_1.COMPONENT_SEP;
        var comentarios = "";
        if (this.getComentarios().length === 0) {
            var Comment1 = ' '.repeat(30); // Comment1 30 ST
            var Comment2 = ' '.repeat(25); // Comment2 25 ST
            var Comment3 = ' '.repeat(20); // Comment3 20 ST
            var Comment4 = ' '.repeat(15); // Comment4 15 ST
            var Comment5 = ' '.repeat(10); // Comment5 10 ST
            comentarios = Comment1 + rep + Comment2 + rep + Comment3 + rep + Comment4 + rep + Comment5;
        }
        else {
            var com = this.getComentarios();
            com.forEach(function (elemento) {
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
    };
    return CommentRecord;
}());
exports.CommentRecord = CommentRecord;
