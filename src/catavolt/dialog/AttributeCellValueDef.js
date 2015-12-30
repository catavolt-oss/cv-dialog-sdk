/**
 * Created by rburson on 4/16/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CellValueDef_1 = require("./CellValueDef");
var AttributeCellValueDef = (function (_super) {
    __extends(AttributeCellValueDef, _super);
    function AttributeCellValueDef(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
        _super.call(this, style);
        this._propertyName = _propertyName;
        this._presentationLength = _presentationLength;
        this._entryMethod = _entryMethod;
        this._autoFillCapable = _autoFillCapable;
        this._hint = _hint;
        this._toolTip = _toolTip;
        this._fieldActions = _fieldActions;
    }
    Object.defineProperty(AttributeCellValueDef.prototype, "autoFileCapable", {
        get: function () {
            return this._autoFillCapable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "entryMethod", {
        get: function () {
            return this._entryMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "fieldActions", {
        get: function () {
            return this._fieldActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "hint", {
        get: function () {
            return this._hint;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isComboBoxEntryMethod", {
        get: function () {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isDropDownEntryMethod", {
        get: function () {
            return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "isTextFieldEntryMethod", {
        get: function () {
            return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "presentationLength", {
        get: function () {
            return this._presentationLength;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "propertyName", {
        get: function () {
            return this._propertyName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributeCellValueDef.prototype, "toolTip", {
        get: function () {
            return this._toolTip;
        },
        enumerable: true,
        configurable: true
    });
    return AttributeCellValueDef;
})(CellValueDef_1.CellValueDef);
exports.AttributeCellValueDef = AttributeCellValueDef;
