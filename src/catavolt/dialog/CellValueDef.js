/**
 * Created by rburson on 3/31/15.
 */
var DialogTriple_1 = require("./DialogTriple");
var OType_1 = require("./OType");
var ObjUtil_1 = require("../util/ObjUtil");
var Failure_1 = require("../fp/Failure");
var PropDef_1 = require("./PropDef");
var CellValueDef = (function () {
    function CellValueDef(_style) {
        this._style = _style;
    }
    /* Note compact deserialization will be handled normally by OType */
    CellValueDef.fromWS = function (otype, jsonObj) {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['labelCellValueDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType_1.OType.factoryFn);
        }
        else if (jsonObj['tabCellValueDef']) {
            return DialogTriple_1.DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType_1.OType.factoryFn);
        }
        else {
            return new Failure_1.Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil_1.ObjUtil.formatRecAttr(jsonObj));
        }
    };
    Object.defineProperty(CellValueDef.prototype, "isInlineMediaStyle", {
        get: function () {
            return this.style && (this.style === PropDef_1.PropDef.STYLE_INLINE_MEDIA || this.style === PropDef_1.PropDef.STYLE_INLINE_MEDIA2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellValueDef.prototype, "style", {
        get: function () {
            return this._style;
        },
        enumerable: true,
        configurable: true
    });
    return CellValueDef;
})();
exports.CellValueDef = CellValueDef;
