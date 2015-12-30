/**
 * Created by rburson on 4/22/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PaneDef_1 = require("./PaneDef");
var ImagePickerDef = (function (_super) {
    __extends(ImagePickerDef, _super);
    function ImagePickerDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._URLPropName = _URLPropName;
        this._defaultActionId = _defaultActionId;
    }
    Object.defineProperty(ImagePickerDef.prototype, "defaultActionId", {
        get: function () {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImagePickerDef.prototype, "URLPropName", {
        get: function () {
            return this._URLPropName;
        },
        enumerable: true,
        configurable: true
    });
    return ImagePickerDef;
})(PaneDef_1.PaneDef);
exports.ImagePickerDef = ImagePickerDef;
