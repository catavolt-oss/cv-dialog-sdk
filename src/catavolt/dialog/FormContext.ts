/**
 * Created by rburson on 3/30/15.
 */

import {PaneContext} from "./PaneContext";
import {StringDictionary} from "../util/Types";
import {DialogRedirection} from "./DialogRedirection";
import {ActionSource} from "./ActionSource";
import {FormDef} from "./FormDef";
import {SessionContext} from "../ws/SessionContext";
import {Future} from "../fp/Future";
import {VoidResult} from "./VoidResult";
import {DialogService} from "./DialogService";
import {EntityRecDef} from "./EntityRecDef";
import {MenuDef} from "./MenuDef";
import {NavRequest} from "./NavRequest";
import {NullEntityRec} from "./NullEntityRec";
import {Redirection} from "./Redirection";
import {ContextAction} from "./ContextAction";
import {PaneDef} from "./PaneDef";
import {EditorContext} from "./EditorContext";
import {QueryContext} from "./QueryContext";
import {NullNavRequest} from "./NullNavRequest";
import {NavRequestUtil} from "./NavRequest";

export class FormContext extends PaneContext {

    private _destroyed:boolean = false;
    private _offlineProps:StringDictionary = {};

    constructor(private _dialogRedirection:DialogRedirection, private _actionSource:ActionSource,
                private _formDef:FormDef, private _childrenContexts:Array<PaneContext>, private _offlineCapable:boolean,
                private _offlineData:boolean, private _sessionContext:SessionContext) {
        super(null);
        this._childrenContexts = _childrenContexts || [];
        this._childrenContexts.forEach((c:PaneContext)=> {
            c.parentContext = this
        });
    }

    get actionSource():ActionSource {
        return this.parentContext ? this.parentContext.actionSource : this._actionSource;
    }

    get childrenContexts():Array<PaneContext> {
        return this._childrenContexts;
    }

    close():Future<VoidResult> {
        return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
    }

    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    get entityRecDef():EntityRecDef {
        return this.formDef.entityRecDef;
    }

    get formDef():FormDef {
        return this._formDef;
    }

    get headerContext():PaneContext {
        throw new Error('FormContext::headerContext: Needs Impl');
    }

    performMenuAction(menuDef:MenuDef):Future<NavRequest> {

        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId,
            NullEntityRec.singleton, this.sessionContext).bind((value:Redirection)=> {
            var destroyedStr:string = value.fromDialogProperties['destroyed'];
            if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
                this._destroyed = true;
            }
            var ca:ContextAction = new ContextAction(menuDef.actionId, this.dialogRedirection.objectId, this.actionSource);
            return NavRequestUtil.fromRedirection(value, ca, this.sessionContext);
        });
    }

    get isDestroyed():boolean {
        return this._destroyed || this.isAnyChildDestroyed;
    }

    get offlineCapable():boolean {
        return this._offlineCapable;
    }

    get menuDefs():Array<MenuDef> {
        return this.formDef.menuDefs;
    }

    get offlineProps():StringDictionary {
        return this._offlineProps;
    }

    get paneDef():PaneDef {
        return this.formDef;
    }

    get sessionContext():SessionContext {
        return this._sessionContext;
    }


    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility (no such thing (yet!))

    get isAnyChildDestroyed():boolean {
        return this.childrenContexts.some((paneContext:PaneContext)=> {
            if (paneContext instanceof EditorContext || paneContext instanceof QueryContext) {
                return paneContext.isDestroyed;
            }
            return false;
        });
    }

    processNavRequestForDestroyed(navRequest:NavRequest) {

        var fromDialogProps:StringDictionary = {};
        if (navRequest instanceof FormContext) {
            fromDialogProps = navRequest.offlineProps;
        } else if (navRequest instanceof NullNavRequest) {
            fromDialogProps = navRequest.fromDialogProperties;
        }
        var destroyedStr:string = fromDialogProps['destroyed'];
        if (destroyedStr && destroyedStr.toLowerCase() === 'true') {
            this._destroyed = true;
        }
        var fromDialogDestroyed = fromDialogProps['fromDialogDestroyed'];
        if (fromDialogDestroyed) {
            this._destroyed = true;
        }
    }
}
