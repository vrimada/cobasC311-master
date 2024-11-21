/***************************************
*              TestComponent           *
****************************************
* Use only for OrderRecord
*
**/
export class TestRecord {
    constructor(id) {
        this._id = id;
    }
    getId() {
        return this._id;
    }
    setId(id) {
        this._id = id;
    }
    toString() {
        return "id " + this._id;
    }
}
