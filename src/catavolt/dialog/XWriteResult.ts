/**
 * Created by rburson on 4/1/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class XWriteResult {

        static fromWS(otype:string, jsonObj):Try<Either<Redirection,XWriteResult>> {
            return DialogTriple.extractTriple(jsonObj, 'WSWriteResult', ()=>{
                return OType.deserializeObject<XWriteResult>(jsonObj, 'XWriteResult', OType.factoryFn);
            });
        }

        constructor(private _editorRecord:EntityRec, private _editorRecordDef:EntityRecDef,
                    private _dialogProperties:StringDictionary) {
        }

        get dialogProps():StringDictionary {
            return this._dialogProperties;
        }

        get entityRec():EntityRec {
            return this._editorRecord;
        }

        get entityRecDef():EntityRecDef {
            return this._editorRecordDef;
        }

        get isDestroyed():boolean {
            var destoyedStr = this.dialogProps['destroyed'];
            return destoyedStr && destoyedStr.toLowerCase() === 'true'
        }
    }
}