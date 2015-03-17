/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class NullRedirection extends Redirection {

        constructor(public fromDialogProps:StringDictionary){ super(); }
    }
}