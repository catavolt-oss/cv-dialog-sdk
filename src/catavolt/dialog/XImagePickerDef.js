/**
 * Created by rburson on 4/1/15.
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
        var XImagePickerDef = (function (_super) {
            __extends(XImagePickerDef, _super);
            function XImagePickerDef(paneId, name, title, URLProperty, defaultActionId) {
                _super.call(this);
                this.paneId = paneId;
                this.name = name;
                this.title = title;
                this.URLProperty = URLProperty;
                this.defaultActionId = defaultActionId;
            }
            return XImagePickerDef;
        })(dialog.XPaneDef);
        dialog.XImagePickerDef = XImagePickerDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
