/***************************************
*           TerminationRecord          *
****************************************
* Sample termination record text:
* L|1|N
* L =>  Record Type ID „L‟ fixed.
* |1 => Sequence Number. Indicates sequence No. Normally it is „1‟
* |N => Termination Code. „N‟ fixed. (normal end)
**/
export class TerminationRecord{
    private type : string;
    private seq : string;
    private terminationCode : string;

    public setType(_type : string){
        this.type = _type;
    }

    public getType(){
        return this.type;
    }

    public setSeq(_seq : string){
        this.seq = _seq;
    }

    public getSeq(){
        return this.seq;
    }

    public getTerminationCode(){
        return this.terminationCode;
    }

    public setTerminationCode(_ter : string){
        this.terminationCode = _ter;
    }

    cargarDesdeASTM(flow : string){
        let field = flow.split('|');
        this.setType(field[0]);
        this.setSeq(field[1]);
        this.setTerminationCode(field[2]);
    }
    toASTM() : string [] {
        return ['L', '1', 'N' ];
    }
}

