/**
 * Created by rburson on 4/27/15.
 */
import { PaneContext } from "./PaneContext";
import { EntityBuffer } from "./EntityBuffer";
import { NullEntityRec } from "./NullEntityRec";
import { Future } from "../fp/Future";
import { DialogService } from "./DialogService";
import { ContextAction } from "./ContextAction";
import { AppContext } from "./AppContext";
import { Either } from "../fp/Either";
import { ObjUtil } from "../util/ObjUtil";
import { NavRequestUtil } from "./NavRequest";
import { EntityRecUtil } from "./EntityRec";
var EditorState;
(function (EditorState) {
    EditorState[EditorState["READ"] = 0] = "READ";
    EditorState[EditorState["WRITE"] = 1] = "WRITE";
    EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
})(EditorState || (EditorState = {}));
export class EditorContext extends PaneContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get buffer() {
        if (!this._buffer) {
            this._buffer = new EntityBuffer(NullEntityRec.singleton);
        }
        return this._buffer;
    }
    changePaneMode(paneMode) {
        return DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode, this.sessionContext).bind((changePaneModeResult) => {
            this.putSettings(changePaneModeResult.dialogProps);
            if (this.isDestroyedSetting) {
                this._editorState = EditorState.DESTROYED;
            }
            else {
                this.entityRecDef = changePaneModeResult.entityRecDef;
                if (this.isReadModeSetting) {
                    this._editorState = EditorState.READ;
                }
                else {
                    this._editorState = EditorState.WRITE;
                }
            }
            return Future.createSuccessfulFuture('EditorContext::changePaneMode', this.entityRecDef);
        });
    }
    get entityRec() {
        return this._buffer.toEntityRec();
    }
    get entityRecNow() {
        return this.entityRec;
    }
    get entityRecDef() {
        return this._entityRecDef;
    }
    set entityRecDef(entityRecDef) {
        this._entityRecDef = entityRecDef;
    }
    getAvailableValues(propName) {
        return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName, this.buffer.afterEffects(), this.sessionContext).map((valuesResult) => {
            return valuesResult.list;
        });
    }
    isBinary(cellValueDef) {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValueDef.isInlineMediaStyle));
    }
    get isDestroyed() {
        return this._editorState === EditorState.DESTROYED;
    }
    get isReadMode() {
        return this._editorState === EditorState.READ;
    }
    isReadModeFor(propName) {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.maintainable || !propDef.writeEnabled;
        }
        return true;
    }
    get isWriteMode() {
        return this._editorState === EditorState.WRITE;
    }
    performMenuAction(menuDef, pendingWrites) {
        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId, pendingWrites, this.sessionContext).bind((redirection) => {
            var ca = new ContextAction(menuDef.actionId, this.parentContext.dialogRedirection.objectId, this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, this.sessionContext).map((navRequest) => {
                this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, navRequest);
                if (this.isDestroyedSetting) {
                    this._editorState = EditorState.DESTROYED;
                }
                if (this.isRefreshSetting) {
                    AppContext.singleton.lastMaintenanceTime = new Date();
                }
                return navRequest;
            });
        });
    }
    processSideEffects(propertyName, value) {
        var sideEffectsFr = DialogService.processSideEffects(this.paneDef.dialogHandle, this.sessionContext, propertyName, value, this.buffer.afterEffects()).map((changeResult) => {
            return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new NullEntityRec();
        });
        return sideEffectsFr.map((sideEffectsRec) => {
            var originalProps = this.buffer.before.props;
            var userEffects = this.buffer.afterEffects().props;
            var sideEffects = sideEffectsRec.props;
            sideEffects = sideEffects.filter((prop) => {
                return prop.name !== propertyName;
            });
            this._buffer = EntityBuffer.createEntityBuffer(this.buffer.objectId, EntityRecUtil.union(originalProps, sideEffects), EntityRecUtil.union(originalProps, EntityRecUtil.union(userEffects, sideEffects)));
            return null;
        });
    }
    read() {
        return DialogService.readEditorModel(this.paneDef.dialogHandle, this.sessionContext).map((readResult) => {
            this.entityRecDef = readResult.entityRecDef;
            return readResult.entityRec;
        }).map((entityRec) => {
            this.initBuffer(entityRec);
            this.lastRefreshTime = new Date();
            return entityRec;
        });
    }
    requestedAccuracy() {
        var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
        return accuracyStr ? Number(accuracyStr) : 500;
    }
    requestedTimeoutSeconds() {
        var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
        return timeoutStr ? Number(timeoutStr) : 30;
    }
    write() {
        const deltaRec = this.buffer.afterEffects();
        return this.writeBinaries(deltaRec).bind((binResult) => {
            var result = DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, deltaRec, this.sessionContext).bind((either) => {
                if (either.isLeft) {
                    var ca = new ContextAction('#write', this.parentContext.dialogRedirection.objectId, this.actionSource);
                    var navRequestFr = NavRequestUtil.fromRedirection(either.left, ca, this.sessionContext).map((navRequest) => {
                        return Either.left(navRequest);
                    });
                }
                else {
                    var writeResult = either.right;
                    this.putSettings(writeResult.dialogProps);
                    this.entityRecDef = writeResult.entityRecDef;
                    return Future.createSuccessfulFuture('EditorContext::write', Either.right(writeResult.entityRec));
                }
            });
            return result.map((successfulWrite) => {
                var now = new Date();
                AppContext.singleton.lastMaintenanceTime = now;
                this.lastRefreshTime = now;
                if (successfulWrite.isLeft) {
                    this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, successfulWrite.left);
                }
                else {
                    this.initBuffer(successfulWrite.right);
                }
                if (this.isDestroyedSetting) {
                    this._editorState = EditorState.DESTROYED;
                }
                else {
                    if (this.isReadModeSetting) {
                        this._editorState = EditorState.READ;
                    }
                }
                return successfulWrite;
            });
        });
    }
    //Module level methods
    initialize() {
        this._entityRecDef = this.paneDef.entityRecDef;
        this._settings = ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
        this._editorState = this.isReadModeSetting ? EditorState.READ : EditorState.WRITE;
    }
    get settings() {
        return this._settings;
    }
    //Private methods
    initBuffer(entityRec) {
        this._buffer = entityRec ? new EntityBuffer(entityRec) : new EntityBuffer(NullEntityRec.singleton);
    }
    get isDestroyedSetting() {
        var str = this._settings['destroyed'];
        return str && str.toLowerCase() === 'true';
    }
    get isGlobalRefreshSetting() {
        var str = this._settings['globalRefresh'];
        return str && str.toLowerCase() === 'true';
    }
    get isLocalRefreshSetting() {
        var str = this._settings['localRefresh'];
        return str && str.toLowerCase() === 'true';
    }
    get isReadModeSetting() {
        var paneMode = this.paneModeSetting;
        return paneMode && paneMode.toLowerCase() === 'read';
    }
    get isRefreshSetting() {
        return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
    }
    get paneModeSetting() {
        return this._settings['paneMode'];
    }
    putSetting(key, value) {
        this._settings[key] = value;
    }
    putSettings(settings) {
        ObjUtil.addAllProps(settings, this._settings);
    }
}
EditorContext.GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
EditorContext.GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
