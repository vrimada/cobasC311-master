"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRecord = void 0;
/***************************************
*              TestComponent           *
****************************************
* Use only for OrderRecord
*
**/
class TestRecord {
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
exports.TestRecord = TestRecord;
