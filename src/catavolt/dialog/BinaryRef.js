/**
 * Created by rburson on 4/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Base64_1 = require("../util/Base64");
var Success_1 = require("../fp/Success");
var BinaryRef = (function () {
    function BinaryRef(_settings) {
        this._settings = _settings;
    }
    BinaryRef.fromWSValue = function (encodedValue, settings) {
        if (encodedValue && encodedValue.length > 0) {
            return new Success_1.Success(new InlineBinaryRef(Base64_1.Base64.decode(encodedValue), settings));
        }
        else {
            return new Success_1.Success(new ObjectBinaryRef(settings));
        }
    };
    Object.defineProperty(BinaryRef.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        enumerable: true,
        configurable: true
    });
    return BinaryRef;
})();
exports.BinaryRef = BinaryRef;
var InlineBinaryRef = (function (_super) {
    __extends(InlineBinaryRef, _super);
    function InlineBinaryRef(_inlineData, settings) {
        _super.call(this, settings);
        this._inlineData = _inlineData;
    }
    Object.defineProperty(InlineBinaryRef.prototype, "inlineData", {
        /* Base64 encoded data */
        get: function () {
            return this._inlineData;
        },
        enumerable: true,
        configurable: true
    });
    return InlineBinaryRef;
})(BinaryRef);
exports.InlineBinaryRef = InlineBinaryRef;
var ObjectBinaryRef = (function (_super) {
    __extends(ObjectBinaryRef, _super);
    function ObjectBinaryRef(settings) {
        _super.call(this, settings);
    }
    return ObjectBinaryRef;
})(BinaryRef);
