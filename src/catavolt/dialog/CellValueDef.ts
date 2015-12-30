/**
 * Created by rburson on 3/31/15.
 */

import {Try} from "../fp/Try";
import {DialogTriple} from "./DialogTriple";
import {OType} from "./OType";
import {ObjUtil} from "../util/ObjUtil";
import {Failure} from "../fp/Failure";
import {PropDef} from "./PropDef";

export class CellValueDef {

    /* Note compact deserialization will be handled normally by OType */

    static fromWS(otype:string, jsonObj):Try<CellValueDef> {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType.factoryFn);
        } else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType.factoryFn);
        } else if (jsonObj['labelCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType.factoryFn);
        } else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType.factoryFn);
        } else if (jsonObj['tabCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType.factoryFn);
        } else {
            return new Failure<CellValueDef>('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }

    constructor(private _style:string) {
    }

    get isInlineMediaStyle():boolean {
        return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }

    get style():string {
        return this._style;
    }

}
