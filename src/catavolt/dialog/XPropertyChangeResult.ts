/**
 * Created by rburson on 4/1/15.
 */

import {XReadResult} from "./XReadResult";
import {EntityRecDef} from "./EntityRecDef";

export class XPropertyChangeResult {

    constructor(public availableValueChanges:Array<string>,
                public propertyName:string,
                public sideEffects:XReadResult,
                public editorRecordDef:EntityRecDef) {
    }

    get sideEffectsDef():EntityRecDef {
        return this.editorRecordDef;
    }

}
