/**
 * Created by rburson on 3/26/15.
 */
import { Redirection } from "./Redirection";
export class DialogRedirection extends Redirection {
    constructor(_dialogHandle, _dialogType, _dialogMode, _paneMode, _objectId, _open, _domainClassName, _dialogModelClassName, _dialogProperties, _fromDialogProperties) {
        super();
        this._dialogHandle = _dialogHandle;
        this._dialogType = _dialogType;
        this._dialogMode = _dialogMode;
        this._paneMode = _paneMode;
        this._objectId = _objectId;
        this._open = _open;
        this._domainClassName = _domainClassName;
        this._dialogModelClassName = _dialogModelClassName;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    get dialogHandle() {
        return this._dialogHandle;
    }
    get dialogMode() {
        return this._dialogMode;
    }
    get dialogModelClassName() {
        return this._dialogModelClassName;
    }
    get dialogProperties() {
        return this._dialogProperties;
    }
    get dialogType() {
        return this._dialogType;
    }
    get domainClassName() {
        return this._domainClassName;
    }
    get fromDialogProperties() {
        return this._fromDialogProperties;
    }
    set fromDialogProperties(props) {
        this._fromDialogProperties = props;
    }
    get isEditor() {
        return this._dialogType === 'EDITOR';
    }
    get isQuery() {
        return this._dialogType === 'QUERY';
    }
    get objectId() {
        return this._objectId;
    }
    get open() {
        return this._open;
    }
    get paneMode() {
        return this._paneMode;
    }
}
