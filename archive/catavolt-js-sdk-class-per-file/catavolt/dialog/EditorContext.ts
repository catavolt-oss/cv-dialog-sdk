/**
 * Created by rburson on 4/27/15.
 */


import {PaneContext} from "./PaneContext";
import {EntityBuffer} from "./EntityBuffer";
import {EntityRecDef} from "./EntityRecDef";
import {StringDictionary} from "../util/Types";
import {NullEntityRec} from "./NullEntityRec";
import {PaneMode} from "./PaneMode";
import {Future} from "../fp/Future";
import {DialogService} from "./DialogService";
import {XChangePaneModeResult} from "./XChangePaneModeResult";
import {EntityRec} from "./EntityRec";
import {EncodedBinary} from "./Binary";
import {XGetAvailableValuesResult} from "./XGetAvailableValuesResult";
import {AttributeCellValueDef} from "./AttributeCellValueDef";
import {MenuDef} from "./MenuDef";
import {NavRequest} from "./NavRequest";
import {ContextAction} from "./ContextAction";
import {Redirection} from "./Redirection";
import {AppContext} from "./AppContext";
import {XPropertyChangeResult} from "./XPropertyChangeResult";
import {Prop} from "./Prop";
import {XReadResult} from "./XReadResult";
import {Either} from "../fp/Either";
import {XWriteResult} from "./XWriteResult";
import {XWritePropertyResult} from "./XWritePropertyResult";
import {ObjUtil} from "../util/ObjUtil";
import {Try} from "../fp/Try";
import {NavRequestUtil} from "./NavRequest";
import {EntityRecUtil} from "./EntityRec";

enum EditorState{ READ, WRITE, DESTROYED }

export class EditorContext extends PaneContext {

    private static GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
    private static GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';
    private static CHAR_CHUNK_SIZE = 256 * 1000;

    private _buffer:EntityBuffer;
    private _editorState:EditorState;
    private _entityRecDef:EntityRecDef;
    private _settings:StringDictionary;

    constructor(paneRef:number) {
        super(paneRef);
    }

    get buffer():EntityBuffer {
        if (!this._buffer) {
            this._buffer = new EntityBuffer(NullEntityRec.singleton);
        }
        return this._buffer;
    }

    changePaneMode(paneMode:PaneMode):Future<EntityRecDef> {
        return DialogService.changePaneMode(this.paneDef.dialogHandle, paneMode,
            this.sessionContext).bind((changePaneModeResult:XChangePaneModeResult)=> {
            this.putSettings(changePaneModeResult.dialogProps);
            if (this.isDestroyedSetting) {
                this._editorState = EditorState.DESTROYED;
            } else {
                this.entityRecDef = changePaneModeResult.entityRecDef;
                if (this.isReadModeSetting) {
                    this._editorState = EditorState.READ;
                } else {
                    this._editorState = EditorState.WRITE;
                }
            }
            return Future.createSuccessfulFuture('EditorContext::changePaneMode', this.entityRecDef);
        });
    }

    get entityRec():EntityRec {
        return this._buffer.toEntityRec();
    }

    get entityRecNow():EntityRec {
        return this.entityRec;
    }

    get entityRecDef():EntityRecDef {
        return this._entityRecDef;
    }

    set entityRecDef(entityRecDef:EntityRecDef) {
        this._entityRecDef = entityRecDef;
    }

    getAvailableValues(propName:string):Future<Array<Object>> {

        return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName,
            this.buffer.afterEffects(), this.sessionContext).map((valuesResult:XGetAvailableValuesResult)=> {
            return valuesResult.list;
        });

    }

    isBinary(cellValueDef:AttributeCellValueDef):boolean {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValueDef.isInlineMediaStyle));
    }

    get isDestroyed():boolean {
        return this._editorState === EditorState.DESTROYED;
    }

    get isReadMode():boolean {
        return this._editorState === EditorState.READ;
    }

    isReadModeFor(propName:string):boolean {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.maintainable || !propDef.writeEnabled;
        }
        return true;
    }

    get isWriteMode():boolean {
        return this._editorState === EditorState.WRITE;
    }

    performMenuAction(menuDef:MenuDef, pendingWrites:EntityRec):Future<NavRequest> {
        return DialogService.performEditorAction(this.paneDef.dialogHandle, menuDef.actionId,
            pendingWrites, this.sessionContext).bind((redirection:Redirection)=> {
            var ca = new ContextAction(menuDef.actionId, this.parentContext.dialogRedirection.objectId,
                this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca,
                this.sessionContext).map((navRequest:NavRequest)=> {
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

    processSideEffects(propertyName:string, value:any):Future<void> {

        var sideEffectsFr:Future<EntityRec> = DialogService.processSideEffects(this.paneDef.dialogHandle,
            this.sessionContext, propertyName, value, this.buffer.afterEffects()).map((changeResult:XPropertyChangeResult)=> {
            return changeResult.sideEffects ? changeResult.sideEffects.entityRec : new NullEntityRec();
        });

        return sideEffectsFr.map((sideEffectsRec:EntityRec)=> {
            var originalProps = this.buffer.before.props;
            var userEffects = this.buffer.afterEffects().props;
            var sideEffects = sideEffectsRec.props;
            sideEffects = sideEffects.filter((prop:Prop)=> {
                return prop.name !== propertyName;
            });
            this._buffer = EntityBuffer.createEntityBuffer(this.buffer.objectId,
                EntityRecUtil.union(originalProps, sideEffects),
                EntityRecUtil.union(originalProps, EntityRecUtil.union(userEffects, sideEffects)));
            return null;
        });
    }

    read():Future<EntityRec> {

        return DialogService.readEditorModel(this.paneDef.dialogHandle,
            this.sessionContext).map((readResult:XReadResult)=> {
            this.entityRecDef = readResult.entityRecDef;
            return readResult.entityRec;
        }).map((entityRec:EntityRec)=> {
            this.initBuffer(entityRec);
            this.lastRefreshTime = new Date();
            return entityRec;
        });
    }

    requestedAccuracy():number {
        var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
        return accuracyStr ? Number(accuracyStr) : 500;
    }

    requestedTimeoutSeconds():number {
        var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
        return timeoutStr ? Number(timeoutStr) : 30;
    }

    write():Future<Either<NavRequest,EntityRec>> {

        const deltaRec:EntityRec = this.buffer.afterEffects();
        return this.writeBinaries(deltaRec).bind((binResult) => {
            var result = DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, deltaRec,
                this.sessionContext).bind((either:Either<Redirection,XWriteResult>)=> {
                if (either.isLeft) {
                    var ca = new ContextAction('#write', this.parentContext.dialogRedirection.objectId, this.actionSource);
                    var navRequestFr:Future<NavRequest> =
                        NavRequestUtil.fromRedirection(either.left, ca,
                            this.sessionContext).map((navRequest:NavRequest)=> {
                            return Either.left<NavRequest,EntityRec>(navRequest);
                        });
                } else {
                    var writeResult:XWriteResult = either.right;
                    this.putSettings(writeResult.dialogProps);
                    this.entityRecDef = writeResult.entityRecDef;
                    return Future.createSuccessfulFuture('EditorContext::write', Either.right(writeResult.entityRec));
                }
            });

            return result.map((successfulWrite:Either<NavRequest,EntityRec>)=> {
                var now = new Date();
                AppContext.singleton.lastMaintenanceTime = now;
                this.lastRefreshTime = now;
                if (successfulWrite.isLeft) {
                    this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, successfulWrite.left);
                } else {
                    this.initBuffer(successfulWrite.right);
                }
                if (this.isDestroyedSetting) {
                    this._editorState = EditorState.DESTROYED;
                } else {
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

    get settings():StringDictionary {
        return this._settings;
    }


    //Private methods

    private initBuffer(entityRec:EntityRec) {
        this._buffer = entityRec ? new EntityBuffer(entityRec) : new EntityBuffer(NullEntityRec.singleton);
    }

    private get isDestroyedSetting():boolean {
        var str = this._settings['destroyed'];
        return str && str.toLowerCase() === 'true';
    }

    private get isGlobalRefreshSetting():boolean {
        var str = this._settings['globalRefresh'];
        return str && str.toLowerCase() === 'true';
    }

    private get isLocalRefreshSetting():boolean {
        var str = this._settings['localRefresh'];
        return str && str.toLowerCase() === 'true';
    }

    private get isReadModeSetting():boolean {
        var paneMode = this.paneModeSetting;
        return paneMode && paneMode.toLowerCase() === 'read';
    }

    private get isRefreshSetting():boolean {
        return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
    }

    private get paneModeSetting():string {
        return this._settings['paneMode'];
    }

    private putSetting(key:string, value:any) {
        this._settings[key] = value;
    }

    private putSettings(settings:StringDictionary) {
        ObjUtil.addAllProps(settings, this._settings);
    }

    private writeBinaries(entityRec:EntityRec):Future<Array<Try<XWritePropertyResult>>> {

        const binariesWriteSeq:Array<Future<XWritePropertyResult>> = [];
        entityRec.props.forEach((prop:Prop)=> {
            if (prop.value instanceof EncodedBinary) {
                let pntr:number = 0;
                const encBin:EncodedBinary = prop.value as EncodedBinary;
                const data = encBin.data;
                let writeFuture:Future<XWritePropertyResult> = Future.createSuccessfulFuture<XWritePropertyResult>('startSeq', {} as XWritePropertyResult);
                while (pntr < data.length) {
                    writeFuture = writeFuture.bind((prevResult)=> {
                        const encSegment:string = (pntr + EditorContext.CHAR_CHUNK_SIZE) <= data.length ? data.substring(pntr, EditorContext.CHAR_CHUNK_SIZE) : data.substring(pntr);
                        return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, pntr != 0, this.sessionContext);
                    });
                    pntr += EditorContext.CHAR_CHUNK_SIZE;
                }
                binariesWriteSeq.push(writeFuture);
            }
        });
        return Future.sequence<XWritePropertyResult>(binariesWriteSeq);
    }
}
