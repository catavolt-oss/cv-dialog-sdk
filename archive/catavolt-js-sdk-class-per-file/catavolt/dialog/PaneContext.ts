/**
 * Created by rburson on 3/30/15.
 */

import {EntityRecDef} from "./EntityRecDef";
import {EntityRec} from "./EntityRec";
import {Binary} from "./Binary";
import {EncodedBinary} from "./Binary";
import {UrlBinary} from "./Binary";
import {BinaryRef} from "./BinaryRef";
import {InlineBinaryRef} from "./BinaryRef";
import {ObjectBinaryRef} from "./BinaryRef";
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
import {XReadPropertyResult} from "./XReadPropertyResult";
import {Prop} from "./Prop"
import {Future} from "../fp/Future"
import {Try} from "../fp/Try"
import {DialogService} from "./DialogService"

/**
 * *********************************
 */


export class PaneContext {

    private static ANNO_NAME_KEY = "com.catavolt.annoName";
    private static PROP_NAME_KEY = "com.catavolt.propName";
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
    private static BINARY_CHUNK_SIZE = 32 * 1024; //size in  byes for 'read' operation

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

    binaryAt(propName:string, entityRec:EntityRec):Future<Binary> {
        const prop:Prop = entityRec.propAtName(propName)
        if(prop.value instanceof InlineBinaryRef) {
            const binRef = prop.value as InlineBinaryRef;
            return Future.createSuccessfulFuture('binaryAt', new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
        } else if(prop.value instanceof ObjectBinaryRef) {
            const binRef = prop.value as ObjectBinaryRef;
            if(binRef.settings['webURL']) {
                return Future.createSuccessfulFuture('binaryAt', new UrlBinary(binRef.settings['webURL']));
            } else {
                return this.readBinary(propName);
            }
        } else if(typeof prop.value === 'string') {
            return Future.createSuccessfulFuture('binaryAt', new UrlBinary(prop.value));
        } else {
            return Future.createFailedFuture<Binary>('binaryAt', 'No binary found at ' + propName);
        }
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

    readBinaries(entityRec:EntityRec):Future<Array<Try<Binary>>> {
        return Future.sequence<Binary>(
            this.entityRecDef.propDefs.filter((propDef:PropDef)=>{
                return propDef.isBinaryType
            }).map((propDef:PropDef)=>{
                return this.readBinary(propDef.name);
            })
        );
    }

    readBinary(propName:string):Future<Binary> {
        let seq:number = 0;
        let buffer:string = '';
        let f:(XReadPropertyResult)=>Future<Binary> = (result:XReadPropertyResult) =>{
            buffer += result.data;
            if(result.hasMore) {
                return DialogService.readProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                return Future.createSuccessfulFuture<Binary>('readProperty', new EncodedBinary(buffer));
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
                let ptr:number = 0;
                const encBin:EncodedBinary = prop.value as EncodedBinary;
                const data = encBin.data;
                let writeFuture:Future<XWritePropertyResult> = Future.createSuccessfulFuture<XWritePropertyResult>('startSeq', {} as XWritePropertyResult);
                while (ptr < data.length) {
                    const boundPtr = (ptr:number) => {
                        writeFuture = writeFuture.bind((prevResult)=> {
                            const encSegment:string = (ptr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substring(ptr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(ptr);
                            return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.sessionContext);
                        });
                    }
                    boundPtr(ptr);
                    ptr += PaneContext.CHAR_CHUNK_SIZE;
                }
                return writeFuture;
            })
        );
    }
}
