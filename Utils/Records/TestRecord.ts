

/***************************************
*              TestComponent           *
****************************************
* Use only for OrderRecord
* 
**/
export class TestRecord {
    private _id : string;

    constructor(id : string){
        this._id = id;
    }

    getId () : string{
        return this._id;
    }

    setId(id : string){
        this._id = id;
    }

    toString(){
        return "id "+this._id;
    }
}
