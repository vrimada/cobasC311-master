"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRecord = void 0;
/***************************************
*              TestComponent           *
****************************************
* Use only for OrderRecord
*
**/
var TestRecord = /** @class */ (function () {
    function TestRecord(id) {
        this._id = id;
    }
    TestRecord.prototype.getId = function () {
        return this._id;
    };
    TestRecord.prototype.setId = function (id) {
        this._id = id;
    };
    TestRecord.prototype.toString = function () {
        return "id " + this._id;
    };
    return TestRecord;
}());
exports.TestRecord = TestRecord;
