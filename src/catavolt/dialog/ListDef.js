/**
 * Created by rburson on 4/22/15.
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
        var ListDef = (function (_super) {
            __extends(ListDef, _super);
            function ListDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
                _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
                this._style = _style;
                this._initialColumns = _initialColumns;
                this._activeColumnDefs = _activeColumnDefs;
                this._columnsStyle = _columnsStyle;
                this._defaultActionId = _defaultActionId;
                this._graphicalMarkup = _graphicalMarkup;
            }
            Object.defineProperty(ListDef.prototype, "activeColumnDefs", {
                get: function () {
                    return this._activeColumnDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "columnsStyle", {
                get: function () {
                    return this._columnsStyle;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "defaultActionId", {
                get: function () {
                    return this._defaultActionId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this._graphicalMarkup;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "initialColumns", {
                get: function () {
                    return this._initialColumns;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isDefaultStyle", {
                get: function () {
                    return this.style && this.style === 'DEFAULT';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isDetailsFormStyle", {
                get: function () {
                    return this.style && this.style === 'DETAILS_FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isFormStyle", {
                get: function () {
                    return this.style && this.style === 'FORM';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "isTabularStyle", {
                get: function () {
                    return this.style && this.style === 'TABULAR';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListDef.prototype, "style", {
                get: function () {
                    return this._style;
                },
                enumerable: true,
                configurable: true
            });
            return ListDef;
        })(dialog.PaneDef);
        dialog.ListDef = ListDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
