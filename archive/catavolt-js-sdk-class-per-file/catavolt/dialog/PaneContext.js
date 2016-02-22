/**
 * Created by rburson on 3/30/15.
 */
import { FormContext } from "./FormContext";
import { ObjUtil } from "../util/ObjUtil";
import { NullNavRequest } from "./NullNavRequest";
import { PropFormatter } from "./PropFormatter";
import { AppContext } from "./AppContext";
/**
 * *********************************
 */
export class PaneContext {
    constructor(paneRef) {
        this._lastRefreshTime = new Date(0);
        this._parentContext = null;
        this._paneRef = null;
        this._paneRef = paneRef;
        this._binaryCache = {};
    }
    static resolveSettingsFromNavRequest(initialSettings, navRequest) {
        var result = ObjUtil.addAllProps(initialSettings, {});
        if (navRequest instanceof FormContext) {
            ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
            ObjUtil.addAllProps(navRequest.offlineProps, result);
        }
        else if (navRequest instanceof NullNavRequest) {
            ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
        }
        var destroyed = result['fromDialogDestroyed'];
        if (destroyed)
            result['destroyed'] = true;
        return result;
    }
    get actionSource() {
        return this.parentContext ? this.parentContext.actionSource : null;
    }
    get dialogAlias() {
        return this.dialogRedirection.dialogProperties['dialogAlias'];
    }
    findMenuDefAt(actionId) {
        var result = null;
        if (this.menuDefs) {
            this.menuDefs.some((md) => {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    }
    formatForRead(propValue, propName) {
        return PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
    }
    formatForWrite(propValue, propName) {
        return PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
    }
    get formDef() {
        return this.parentContext.formDef;
    }
    get isRefreshNeeded() {
        return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
    }
    get lastRefreshTime() {
        return this._lastRefreshTime;
    }
    set lastRefreshTime(time) {
        this._lastRefreshTime = time;
    }
    get menuDefs() {
        return this.paneDef.menuDefs;
    }
    get offlineCapable() {
        return this._parentContext && this._parentContext.offlineCapable;
    }
    get paneDef() {
        if (this.paneRef == null) {
            return this.formDef.headerDef;
        }
        else {
            return this.formDef.childrenDefs[this.paneRef];
        }
    }
    get paneRef() {
        return this._paneRef;
    }
    get paneTitle() {
        return this.paneDef.findTitle();
    }
    get parentContext() {
        return this._parentContext;
    }
    parseValue(formattedValue, propName) {
        return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    }
    propDefAtName(propName) {
        return this.entityRecDef.propDefAtName(propName);
    }
    get sessionContext() {
        return this.parentContext.sessionContext;
    }
    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility
    get dialogRedirection() {
        return this.paneDef.dialogRedirection;
    }
    initialize() {
    }
    set parentContext(parentContext) {
        this._parentContext = parentContext;
        this.initialize();
    }
}
PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
