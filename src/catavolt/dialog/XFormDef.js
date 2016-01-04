/**
 * Created by rburson on 3/30/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormDef = (function (_super) {
            __extends(XFormDef, _super);
            function XFormDef(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
                _super.call(this);
                this.borderStyle = borderStyle;
                this.formLayout = formLayout;
                this.formStyle = formStyle;
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.headerDefRef = headerDefRef;
                this.paneDefRefs = paneDefRefs;
            }
            return XFormDef;
        })(dialog.XPaneDef);
        dialog.XFormDef = XFormDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
