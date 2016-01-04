/**
 * Created by rburson on 3/27/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class WebRedirection extends Redirection implements NavRequest{

        constructor(private _webURL:string,
            private _open:boolean,
            private _dialogProperties:StringDictionary,
            private _fromDialogProperties:StringDictionary){ super(); }

        get fromDialogProperties():StringDictionary{
            return this._fromDialogProperties;
        }

        set fromDialogProperties(props:StringDictionary){
            this._fromDialogProperties = props;
        }



    }
}