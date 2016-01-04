/**
 * Created by rburson on 3/26/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class DialogRedirection extends Redirection{

        constructor(private _dialogHandle:DialogHandle,
                    private _dialogType:string,
                    private _dialogMode:string,
                    private _paneMode:string,
                    private _objectId:string,
                    private _open:boolean,
                    private _domainClassName:string,
                    private _dialogModelClassName:string,
                    private _dialogProperties:StringDictionary,
                    private _fromDialogProperties:StringDictionary) { super(); }


        get dialogHandle():DialogHandle {
            return this._dialogHandle;
        }

        get dialogMode():string {
            return this._dialogMode;
        }

        get dialogModelClassName():string {
            return this._dialogModelClassName;
        }

        get dialogProperties():StringDictionary{
            return this._dialogProperties;
        }

        get dialogType():string {
            return this._dialogType;
        }

        get domainClassName():string {
            return this._domainClassName;
        }

        get fromDialogProperties():StringDictionary{
            return this._fromDialogProperties;
        }

        set fromDialogProperties(props:StringDictionary){
            this._fromDialogProperties = props;
        }

        get isEditor():boolean {
            return this._dialogType === 'EDITOR';
        }

        get isQuery():boolean {
            return this._dialogType === 'QUERY';
        }

        get objectId():string{
            return this._objectId;
        }

        get open():boolean{
            return this._open;
        }

        get paneMode():string{
            return this._paneMode;
        }

    }
}
