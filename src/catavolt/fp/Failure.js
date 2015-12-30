var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Try_1 = require('./Try');
var Failure = (function (_super) {
    __extends(Failure, _super);
    function Failure(_error) {
        _super.call(this);
        this._error = _error;
    }
    Object.defineProperty(Failure.prototype, "failure", {
        get: function () {
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Failure.prototype, "isFailure", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    return Failure;
})(Try_1.Try);
exports.Failure = Failure;
