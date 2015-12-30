/**
 * Created by rburson on 4/1/15.
 */

import {EntityRec} from './EntityRec';
import {EntityRecDef} from './EntityRecDef';
import {StringDictionary} from '../util/Types';

export class XReadResult {

    constructor(private _editorRecord:EntityRec,
                private _editorRecordDef:EntityRecDef,
                private _dialogProperties:StringDictionary) {
    }

    get entityRec():EntityRec {
        return this._editorRecord;
    }

    get entityRecDef():EntityRecDef {
        return this._editorRecordDef;
    }

    get dialogProps():StringDictionary {
        return this._dialogProperties;
    }

}
