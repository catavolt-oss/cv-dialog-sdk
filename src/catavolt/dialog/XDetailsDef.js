/**
 * Created by rburson on 3/30/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/*
    @TODO

    Note! Use this as a test example!
    It has an Array of Array with subitems that also have Array of Array!!
*/
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XDetailsDef = (function (_super) {
            __extends(XDetailsDef, _super);
            function XDetailsDef(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.cancelButtonText = cancelButtonText;
                this.commitButtonText = commitButtonText;
                this.editable = editable;
                this.focusPropertyName = focusPropertyName;
                this.overrideGML = overrideGML;
                this.rows = rows;
            }
            Object.defineProperty(XDetailsDef.prototype, "graphicalMarkup", {
                get: function () {
                    return this.overrideGML;
                },
                enumerable: true,
                configurable: true
            });
            return XDetailsDef;
        })(dialog.XPaneDef);
        dialog.XDetailsDef = XDetailsDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
