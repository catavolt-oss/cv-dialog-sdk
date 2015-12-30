/**
 * Created by rburson on 3/5/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Try_1 = require('./Try');
var Success = (function (_super) {
    __extends(Success, _super);
    function Success(_value) {
        _super.call(this);
        this._value = _value;
    }
    Object.defineProperty(Success.prototype, "isSuccess", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Success.prototype, "success", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    return Success;
})(Try_1.Try);
exports.Success = Success;
