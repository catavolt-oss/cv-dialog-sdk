/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

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
}