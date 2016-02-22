/**
 * Created by rburson on 3/30/15.
 */
import { PaneContext } from "./PaneContext";
import { DialogService } from "./DialogService";
import { NullEntityRec } from "./NullEntityRec";
import { ContextAction } from "./ContextAction";
import { EditorContext } from "./EditorContext";
import { QueryContext } from "./QueryContext";
import { NullNavRequest } from "./NullNavRequest";
import { NavRequestUtil } from "./NavRequest";
export class FormContext extends PaneContext {
    constructor(_dialogRedirection, _actionSource, _formDef, _childrenContexts, _offlineCapable, _offlineData, _sessionContext) {
        super(null);
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._formDef = _formDef;
        this._childrenContexts = _childrenContexts;
        this._offlineCapable = _offlineCapable;
        this._offlineData = _offlineData;
        this._sessionContext = _sessionContext;
        this._destroyed = false;
        this._offlineProps = {};
        this._childrenContexts = _childrenContexts || [];
        this._childrenContexts.forEach((c) => {
            c.parentContext = this;
        });
    }
    get actionSource() {
        return this.parentContext ? this.parentContext.actionSource : this._actionSource;
    }
    get childrenContexts() {
        return this._childrenContexts;
    }
    close() {
        return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
    }
    get dialogRedirection() {
        return this._dialogRedirection;
    }
    get entityRecDef() {
        return this.formDef.entityRecDef;
    }
    get formDef() {
        return this._formDef;
    }
    get headerContext() {
        throw new Error('FormContext::headerContext: Needs Impl');
    }
    performMenuAction(menuDef) {
        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, NullEntityRec.singleton, this.sessionContext).bind((value) => {
            var destroyedStr = value.fromDialogProperties['destroyed'];
            if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                this._destroyed = true;
            }
            var ca = new ContextAction(menuDef.actionId, this.dialogRedirection.objectId, this.actionSource);
            return NavRequestUtil.fromRedirection(value, ca, this.sessionContext);
        });
    }
    get isDestroyed() {
        return this._destroyed || this.isAnyChildDestroyed;
    }
    get offlineCapable() {
        return this._offlineCapable;
    }
    get menuDefs() {
        return this.formDef.menuDefs;
    }
    get offlineProps() {
        return this._offlineProps;
    }
    get paneDef() {
        return this.formDef;
    }
    get sessionContext() {
        return this._sessionContext;
    }
    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility (no such thing (yet!))
    get isAnyChildDestroyed() {
        return this.childrenContexts.some((paneContext) => {
            if (paneContext instanceof EditorContext || paneContext instanceof QueryContext) {
                return paneContext.isDestroyed;
            }
            return false;
        });
    }
    processNavRequestForDestroyed(navRequest) {
        var fromDialogProps = {};
        if (navRequest instanceof FormContext) {
            fromDialogProps = navRequest.offlineProps;
        }
        else if (navRequest instanceof NullNavRequest) {
            fromDialogProps = navRequest.fromDialogProperties;
        }
        var destroyedStr = fromDialogProps['destroyed'];
        if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
            this._destroyed = true;
        }
        var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
        if (fromDialogDestroyed) {
            this._destroyed = true;
        }
    }
}
