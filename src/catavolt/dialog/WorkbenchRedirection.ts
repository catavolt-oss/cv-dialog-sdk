/**
 * Created by rburson on 3/27/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class WorkbenchRedirection extends Redirection{

        constructor(private _workbenchId:string,
                    private _dialogProperties:StringDictionary,
                    private _fromDialogProperties:StringDictionary){ super(); }

    }
}