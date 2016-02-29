/**
 * Created by rburson on 3/30/15.
 */

import {EntityRecDef} from "./EntityRecDef";
import {Binary} from "./Binary";
import {EncodedBinary} from "./Binary";
import {FormContext} from "./FormContext";
import {StringDictionary} from "../util/Types";
import {NavRequest} from "./NavRequest";
import {ObjUtil} from "../util/ObjUtil";
import {NullNavRequest} from "./NullNavRequest";
import {ActionSource} from "./ActionSource";
import {MenuDef} from "./MenuDef";
import {PropFormatter} from "./PropFormatter";
import {FormDef} from "./FormDef";
import {AppContext} from "./AppContext";
import {DialogRedirection} from "./DialogRedirection";
import {SessionContext} from "../ws/SessionContext";
import {PropDef} from "./PropDef";
import {PaneDef} from "./PaneDef";
import {XWritePropertyResult} from "./XWritePropertyResult";

/**
 * *********************************
 */

export class PaneContext {

    private static ANNO_NAME_KEY = "com.catavolt.annoName";
    private static PROP_NAME_KEY = "com.catavolt.propName";
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
    private static BINARY_CHUNK_SIZE = 250 * 1024; //size in  byes for 'read' operation

    entityRecDef:EntityRecDef;

    private _binaryCache:{ [index:string] : Array<Binary> }
    private _lastRefreshTime:Date = new Date(0);
    private _parentContext:FormContext = null;
    private _paneRef:number = null;

    static resolveSettingsFromNavRequest(initialSettings:StringDictionary,
                                         navRequest:NavRequest):StringDictionary {

        var result:StringDictionary = ObjUtil.addAllProps(initialSettings, {});
        if (navRequest instanceof FormContext) {
            ObjUtil.addAllProps(navRequest.dialogRedirection.fromDialogProperties, result);
            ObjUtil.addAllProps(navRequest.offlineProps, result);
        } else if (navRequest instanceof NullNavRequest) {
            ObjUtil.addAllProps(navRequest.fromDialogProperties, result);
        }
        var destroyed = result['fromDialogDestroyed'];
        if (destroyed) result['destroyed'] = true;
        return result;

    }

    constructor(paneRef:number) {
        this._paneRef = paneRef;
        this._binaryCache = {};
    }

    get actionSource():ActionSource {
        return this.parentContext ? this.parentContext.actionSource : null;
    }

    get dialogAlias():string {
        return this.dialogRedirection.dialogProperties['dialogAlias'];
    }

    findMenuDefAt(actionId:string) {
        var result:MenuDef = null;
        if (this.menuDefs) {
            this.menuDefs.some((md:MenuDef)=> {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    }

    formatForRead(propValue, propName:string):string {
        return PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
    }

    formatForWrite(propValue, propName:string):string {
        return PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
    }

    get formDef():FormDef {
        return this.parentContext.formDef;
    }

    get isRefreshNeeded():boolean {
        return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
    }

    get lastRefreshTime():Date {
        return this._lastRefreshTime;
    }

    set lastRefreshTime(time:Date) {
        this._lastRefreshTime = time;
    }

    get menuDefs():Array<MenuDef> {
        return this.paneDef.menuDefs;
    }

    get offlineCapable():boolean {
        return this._parentContext && this._parentContext.offlineCapable;
    }

    get paneDef():PaneDef {
        if (this.paneRef == null) {
            return this.formDef.headerDef;
        } else {
            return this.formDef.childrenDefs[this.paneRef];
        }
    }

    get paneRef():number {
        return this._paneRef;
    }

    get paneTitle():string {
        return this.paneDef.findTitle();
    }

    get parentContext():FormContext {
        return this._parentContext;
    }

    parseValue(formattedValue:string, propName:string):any {
        return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    }

    propDefAtName(propName:string):PropDef {
        return this.entityRecDef.propDefAtName(propName);
    }

    get sessionContext():SessionContext {
        return this.parentContext.sessionContext;
    }

    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility

    get dialogRedirection():DialogRedirection {
        return this.paneDef.dialogRedirection;
    }

    initialize() {
    }

    set parentContext(parentContext:FormContext) {
        this._parentContext = parentContext;
        this.initialize();
    }

    readBinaries(entityRec:EntityRec):Future<Array<Try<string>>> {
        return Future.sequence<string>(
            this.entityRecDef.propDefs.filter((propDef:PropDef)=>{
                return propDef.isBinaryType
            }).map((propDef:PropDef)=>{
                return this.readBinary(propDef.name);
            })
        );
    }

    readBinary(propName:string):Future<string> {
        let seq:number = 0;
        let buffer:string = '';
        let f:(XReadPropertyResult)=>Future<string> = (result:XReadPropertyResult) =>{
            buffer += result.data;
            if(result.hasMore) {
                return DialogService.readProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                return Future.createSuccessfulFuture<string>('readProperty', buffer);
            }
        }
        return DialogService.readProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
    }


    writeBinaries(entityRec:EntityRec):Future<Array<Try<XWritePropertyResult>>> {
        return Future.sequence<XWritePropertyResult>(
            entityRec.props.filter((prop:Prop)=> {
                return prop.value instanceof EncodedBinary;
            }).map((prop:Prop) =>{
                let pntr:number = 0;
                const encBin:EncodedBinary = prop.value as EncodedBinary;
                const data = encBin.data;
                let writeFuture:Future<XWritePropertyResult> = Future.createSuccessfulFuture<XWritePropertyResult>('startSeq', {} as XWritePropertyResult);
                while (pntr < data.length) {
                    writeFuture = writeFuture.bind((prevResult)=> {
                        const encSegment:string = (pntr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substring(pntr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(pntr);
                        return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, pntr != 0, this.sessionContext);
                    });
                    pntr += PaneContext.CHAR_CHUNK_SIZE;
                }
                return writeFuture;
            })
        );
    }
}
