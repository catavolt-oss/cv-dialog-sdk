/**
 * Created by rburson on 3/31/15.
 */
import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
import { ObjUtil } from "../util/ObjUtil";
import { Failure } from "../fp/Failure";
import { PropDef } from "./PropDef";
export class CellValueDef {
    constructor(_style) {
        this._style = _style;
    }
    /* Note compact deserialization will be handled normally by OType */
    static fromWS(otype, jsonObj) {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['labelCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['tabCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType.factoryFn);
        }
        else {
            return new Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }
    get isInlineMediaStyle() {
        return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }
    get style() {
        return this._style;
    }
}
