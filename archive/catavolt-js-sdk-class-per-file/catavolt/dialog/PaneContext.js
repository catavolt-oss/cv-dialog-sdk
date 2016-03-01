/**
 * Created by rburson on 3/30/15.
 */
import { EncodedBinary } from "./Binary";
import { UrlBinary } from "./Binary";
import { InlineBinaryRef } from "./BinaryRef";
import { ObjectBinaryRef } from "./BinaryRef";
import { FormContext } from "./FormContext";
import { ObjUtil } from "../util/ObjUtil";
import { NullNavRequest } from "./NullNavRequest";
import { PropFormatter } from "./PropFormatter";
import { AppContext } from "./AppContext";
import { Future } from "../fp/Future";
import { DialogService } from "./DialogService";
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
    binaryAt(propName, entityRec) {
        const prop = entityRec.propAtName(propName);
        if (prop.value instanceof InlineBinaryRef) {
            const binRef = prop.value;
            return Future.createSuccessfulFuture('binaryAt', new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
        }
        else if (prop.value instanceof ObjectBinaryRef) {
            const binRef = prop.value;
            if (binRef.settings['webURL']) {
                return Future.createSuccessfulFuture('binaryAt', new UrlBinary(binRef.settings['webURL']));
            }
            else {
                return this.readBinary(propName);
            }
        }
        else if (typeof prop.value === 'string') {
            return Future.createSuccessfulFuture('binaryAt', new UrlBinary(prop.value));
        }
        else {
            return Future.createFailedFuture('binaryAt', 'No binary found at ' + propName);
        }
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
    readBinaries(entityRec) {
        return Future.sequence(this.entityRecDef.propDefs.filter((propDef) => {
            return propDef.isBinaryType;
        }).map((propDef) => {
            return this.readBinary(propDef.name);
        }));
    }
    readBinary(propName) {
        let seq = 0;
        let buffer = '';
        let f = (result) => {
            buffer += result.data;
            if (result.hasMore) {
                return DialogService.readProperty(this.paneDef.dialogRedirection.dialogHandle, propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            }
            else {
                return Future.createSuccessfulFuture('readProperty', new EncodedBinary(buffer));
            }
        };
        return DialogService.readProperty(this.paneDef.dialogRedirection.dialogHandle, propName, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
    }
    writeBinaries(entityRec) {
        return Future.sequence(entityRec.props.filter((prop) => {
            return prop.value instanceof EncodedBinary;
        }).map((prop) => {
            let ptr = 0;
            const encBin = prop.value;
            const data = encBin.data;
            let writeFuture = Future.createSuccessfulFuture('startSeq', {});
            while (ptr < data.length) {
                const boundPtr = (ptr) => {
                    writeFuture = writeFuture.bind((prevResult) => {
                        const encSegment = (ptr + PaneContext.CHAR_CHUNK_SIZE) <= data.length ? data.substring(ptr, PaneContext.CHAR_CHUNK_SIZE) : data.substring(ptr);
                        return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.sessionContext);
                    });
                };
                boundPtr(ptr);
                ptr += PaneContext.CHAR_CHUNK_SIZE;
            }
            return writeFuture;
        }));
    }
}
PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
PaneContext.CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
PaneContext.BINARY_CHUNK_SIZE = 32 * 1024; //size in  byes for 'read' operation
