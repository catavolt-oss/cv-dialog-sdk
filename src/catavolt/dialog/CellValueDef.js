/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
/*
    @TODO
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CellValueDef = (function () {
            function CellValueDef(_style) {
                this._style = _style;
            }
            /* Note compact deserialization will be handled normally by OType */
            CellValueDef.fromWS = function (otype, jsonObj) {
                if (jsonObj['attributeCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['forcedLineCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['labelCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['substitutionCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', dialog.OType.factoryFn);
                }
                else if (jsonObj['tabCellValueDef']) {
                    return dialog.DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', dialog.OType.factoryFn);
                }
                else {
                    return new Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
                }
            };
            Object.defineProperty(CellValueDef.prototype, "isInlineMediaStyle", {
                get: function () {
                    return this.style && (this.style === dialog.PropDef.STYLE_INLINE_MEDIA || this.style === dialog.PropDef.STYLE_INLINE_MEDIA2);
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
        dialog.CellValueDef = CellValueDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
