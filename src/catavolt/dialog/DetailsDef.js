/**
 * Created by rburson on 4/21/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DetailsDef = (function (_super) {
            __extends(DetailsDef, _super);
            function DetailsDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._cancelButtonText = _cancelButtonText;
                this._commitButtonText = _commitButtonText;
                this._editable = _editable;
                this._focusPropName = _focusPropName;
                this._graphicalMarkup = _graphicalMarkup;
                this._rows = _rows;
            }
            Object.defineProperty(DetailsDef.prototype, "cancelButtonText", {
                get: function () {
                    return this._cancelButtonText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "commitButtonText", {
                get: function () {
                    return this._commitButtonText;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "editable", {
                get: function () {
                    return this._editable;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "focusPropName", {
                get: function () {
                    return this._focusPropName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this._graphicalMarkup;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsDef.prototype, "rows", {
                get: function () {
                    return this._rows;
                },
                enumerable: true,
                configurable: true
            });
            return DetailsDef;
        })(dialog.PaneDef);
        dialog.DetailsDef = DetailsDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
