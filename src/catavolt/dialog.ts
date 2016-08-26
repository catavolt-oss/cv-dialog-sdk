/**
 * Created by rburson on 3/27/15.
 */
import {
    StringDictionary,
    TimeValue,
    DateValue,
    DateTimeValue,
    Log,
    ObjUtil,
    StringUtil,
    ArrayUtil,
    DataUrl
} from "./util";
import {Try, Either, Future, Success, Failure, TryClosure, MapFn} from "./fp";
import {SessionContext, SystemContext, Call, Get} from "./ws";
import * as moment from 'moment';

/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */

/**
 * *********************************
 */
export class CellValueDef {

    /* Note compact deserialization will be handled normally by OType */

    static fromWS(otype:string, jsonObj):Try<CellValueDef> {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType.factoryFn);
        } else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType.factoryFn);
        } else if (jsonObj['labelCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType.factoryFn);
        } else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType.factoryFn);
        } else if (jsonObj['tabCellValueDef']) {
            return DialogTriple.fromWSDialogObject<CellValueDef>(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType.factoryFn);
        } else {
            return new Failure<CellValueDef>('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }

    constructor(private _style:string) {
    }

    get isInlineMediaStyle():boolean {
        return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }

    get style():string {
        return this._style;
    }

}

/**
 * *********************************
 */


export class AttributeCellValueDef extends CellValueDef {

    constructor(private _propertyName:string,
                private _presentationLength:number,
                private _entryMethod:string,
                private _autoFillCapable:boolean,
                private _hint:string,
                private _toolTip:string,
                private _fieldActions:Array<MenuDef>,
                style:string) {
        super(style);
    }

    get autoFileCapable():boolean {
        return this._autoFillCapable;
    }

    get entryMethod():string {
        return this._entryMethod;
    }

    get fieldActions():Array<MenuDef> {
        return this._fieldActions;
    }

    get hint():string {
        return this._hint;
    }

    get isComboBoxEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
    }

    get isDropDownEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
    }

    get isTextFieldEntryMethod():boolean {
        return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
    }

    get presentationLength():number {
        return this._presentationLength;
    }

    get propertyName():string {
        return this._propertyName;
    }

    get toolTip():string {
        return this._toolTip;
    }

}

/**
 * *********************************
 */


export class ForcedLineCellValueDef extends CellValueDef {

    constructor() {
        super(null);
    }

}
/**
 * *********************************
 */

export class LabelCellValueDef extends CellValueDef {

    constructor(private _value:string, style:string) {
        super(style);
    }

    get value():string {
        return this._value;
    }

}
/**
 * *********************************
 */

export class SubstitutionCellValueDef extends CellValueDef {

    constructor(private _value:string, style:string) {
        super(style);
    }

    get value():string {
        return this._value;
    }

}
/**
 * *********************************
 */

export class TabCellValueDef extends CellValueDef {

    constructor() {
        super(null);
    }

}
/**
 * *********************************
 */


/**
 * Top-level (abstract) class, representing a Catavolt 'Pane' definition.
 * All 'Context' classes have a composite {@link PaneDef} that defines the Pane along with a single record 
 * or a list of records.  See {@EntityRecord}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class PaneContext {

    private static ANNO_NAME_KEY = "com.catavolt.annoName";
    private static PROP_NAME_KEY = "com.catavolt.propName";
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation
    static BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation

    entityRecDef:EntityRecDef;

    private _binaryCache:{ [index:string]:Array<Binary> }
    private _lastRefreshTime:Date = new Date(0);
    private _parentContext:FormContext = null;
    private _paneRef:number = null;

    /**
     * Has this 'Pane' been destroyed?
     */
    public isDestroyed:boolean;

    /**
     * Updates a settings object with the new settings from a 'Navigation'
     * @param initialSettings
     * @param navRequest
     * @returns {StringDictionary}
     */
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

    /**
     *
     * @param paneRef
     * @private
     */
    constructor(paneRef:number) {
        this._paneRef = paneRef;
        this._binaryCache = {};
    }

    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    get actionSource():ActionSource {
        return this.parentContext ? this.parentContext.actionSource : null;
    }

    /**
     * Load a Binary property from a record
     * @param propName
     * @param entityRec
     * @returns {any}
     */
    binaryAt(propName:string, entityRec:EntityRec):Future<Binary> {
        const prop:Prop = entityRec.propAtName(propName)
        if (prop) {
            if (prop.value instanceof InlineBinaryRef) {
                const binRef = prop.value as InlineBinaryRef;
                return Future.createSuccessfulFuture('binaryAt', new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
            } else if (prop.value instanceof ObjectBinaryRef) {
                const binRef = prop.value as ObjectBinaryRef;
                if (binRef.settings['webURL']) {
                    return Future.createSuccessfulFuture('binaryAt', new UrlBinary(binRef.settings['webURL']));
                } else {
                    return this.readBinary(propName, entityRec);
                }
            } else if (typeof prop.value === 'string') {
                return Future.createSuccessfulFuture('binaryAt', new UrlBinary(prop.value));
            } else {
                return Future.createFailedFuture<Binary>('binaryAt', 'No binary found at ' + propName);
            }
        } else {
            return Future.createFailedFuture<Binary>('binaryAt', 'No binary found at ' + propName);
        }
    }

    /**
     * Get the dialog alias
     * @returns {any}
     */
    get dialogAlias():string {
        return this.dialogRedirection.dialogProperties['dialogAlias'];
    }

    /**
     * Find a menu def on this Pane with the given actionId
     * @param actionId
     * @returns {MenuDef}
     */
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

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForRead(propValue, propName:string):string {
        return PropFormatter.formatForRead(propValue, this.propDefAtName(propName));
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForWrite(propValue, propName:string):string {
        return PropFormatter.formatForWrite(propValue, this.propDefAtName(propName));
    }

    /**
     * Get the underlying form definition {@link FormDef} for this Pane.
     * If this is not a {@link FormContext} this will be the {@link FormDef} of the owning/parent Form
     * @returns {FormDef}
     */
    get formDef():FormDef {
        return this.parentContext.formDef;
    }

    /**
     * Returns whether or not the data in this pane is out of date
     * @returns {boolean}
     */
    get isRefreshNeeded():boolean {
        return this._lastRefreshTime.getTime() < AppContext.singleton.lastMaintenanceTime.getTime();
    }

    /**
     * Get the last time this pane's data was refreshed
     * @returns {Date}
     */
    get lastRefreshTime():Date {
        return this._lastRefreshTime;
    }

    /**
     * @param time
     */
    set lastRefreshTime(time:Date) {
        this._lastRefreshTime = time;
    }

    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    get menuDefs():Array<MenuDef> {
        return this.paneDef.menuDefs;
    }

    /**
     * @private
     * @returns {FormContext|boolean}
     */
    get offlineCapable():boolean {
        return this._parentContext && this._parentContext.offlineCapable;
    }

    /**
     * Get the underlying @{link PaneDef} associated with this Context
     * @returns {PaneDef}
     */
    get paneDef():PaneDef {
        if (this.paneRef == null) {
            return this.formDef.headerDef;
        } else {
            return this.formDef.childrenDefs[this.paneRef];
        }
    }

    /**
     * Get the numeric value, representing this Pane's place in the parent {@link FormContext}'s list of child panes.
     * See {@link FormContext.childrenContexts}
     * @returns {number}
     */
    get paneRef():number {
        return this._paneRef;
    }

    set paneRef(paneRef:number) {
        this._paneRef = paneRef;
    }

    /**
     * Get the title of this Pane
     * @returns {string}
     */
    get paneTitle():string {
        return this.paneDef.findTitle();
    }

    /**
     * Get the parent {@link FormContext}
     * @returns {FormContext}
     */
    get parentContext():FormContext {
        return this._parentContext;
    }

    /**
     * Parses a value to prepare for 'writing' back to the server
     * @param formattedValue
     * @param propName
     * @returns {any}
     */
    parseValue(formattedValue:any, propName:string):any {
        return PropFormatter.parse(formattedValue, this.propDefAtName(propName));
    }

    /**
     * Get the propery definition for a property name
     * @param propName
     * @returns {PropDef}
     */
    propDefAtName(propName:string):PropDef {
        return this.entityRecDef.propDefAtName(propName);
    }

    /**
     * Get the session information
     * @returns {SessionContext}
     */
    get sessionContext():SessionContext {
        return this.parentContext.sessionContext;
    }

    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    get dialogRedirection():DialogRedirection {
        return this.paneDef.dialogRedirection;
    }

    //abstract
    initialize() {
    }

    set parentContext(parentContext:FormContext) {
        this._parentContext = parentContext;
        this.initialize();
    }

    /**
     * Read all the Binary values in this {@link EntityRec}
     * @param entityRec
     * @returns {Future<Array<Try<Binary>>>}
     */
    readBinaries(entityRec:EntityRec):Future<Array<Try<Binary>>> {
        return Future.sequence<Binary>(
            this.entityRecDef.propDefs.filter((propDef:PropDef)=> {
                return propDef.isBinaryType
            }).map((propDef:PropDef)=> {
                return this.readBinary(propDef.name, entityRec);
            })
        );
    }

    /**
     * Write all Binary values in this {@link EntityRecord} back to the server
     * @param entityRec
     * @returns {Future<Array<Try<XWritePropertyResult>>>}
     */
    writeBinaries(entityRec:EntityRec):Future<Array<Try<XWritePropertyResult>>> {
        return Future.sequence<XWritePropertyResult>(
            entityRec.props.filter((prop:Prop)=> {
                return prop.value instanceof EncodedBinary;
            }).map((prop:Prop) => {
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

    //protected

    //abstract
    protected readBinary(propName:string, entityRec:EntityRec):Future<Binary> {
        return null;
    }

}

/**
 * *********************************
 */

/**
 * PanContext Subtype that represents an 'Editor Pane'.
 * An 'Editor' represents and is backed by a single Record and Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class EditorContext extends PaneContext {

    private static GPS_ACCURACY = 'com.catavolt.core.domain.GeoFix.accuracy';
    private static GPS_SECONDS = 'com.catavolt.core.domain.GeoFix.seconds';

    private _buffer:EntityBuffer;
    private _editorState:EditorState;
    private _entityRecDef:EntityRecDef;
    private _settings:StringDictionary;

    /**
     * @private
     * @param paneRef
     */
    constructor(paneRef:number) {
        super(paneRef);
    }

    /**
     * Get the current buffered record
     * @returns {EntityBuffer}
     */
    get buffer():EntityBuffer {
        if (!this._buffer) {
            this._buffer = new EntityBuffer(NullEntityRec.singleton);
        }
        return this._buffer;
    }

    /**
     * Toggle the current mode of this Editor
     * @param paneMode
     * @returns {Future<EntityRecDef>}
     */
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

    /**
     * Get the associated entity record
     * @returns {EntityRec}
     */
    get entityRec():EntityRec {
        return this._buffer.toEntityRec();
    }

    /**
     * Get the current version of the entity record, with any pending changes present
     * @returns {EntityRec}
     */
    get entityRecNow():EntityRec {
        return this.entityRec;
    }

    /**
     * Get the associated entity record definition
     * @returns {EntityRecDef}
     */
    get entityRecDef():EntityRecDef {
        return this._entityRecDef;
    }

    set entityRecDef(entityRecDef:EntityRecDef) {
        this._entityRecDef = entityRecDef;
    }

    /**
     * Get the possible values for a 'constrained value' property
     * @param propName
     * @returns {Future<Array<any>>}
     */
    getAvailableValues(propName:string):Future<Array<Object>> {

        return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName,
            this.buffer.afterEffects(), this.sessionContext).map((valuesResult:XGetAvailableValuesResult)=> {
            return valuesResult.list;
        });

    }

    /**
     * Returns whether or not this cell definition contains a binary value
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isBinary(cellValueDef:AttributeCellValueDef):boolean {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValueDef.isInlineMediaStyle));
    }

    /**
     * Returns whether or not this Editor Pane is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this._editorState === EditorState.DESTROYED;
    }

    /**
     * Returns whether or not this Editor is in 'read' mode
     * @returns {boolean}
     */
    get isReadMode():boolean {
        return this._editorState === EditorState.READ;
    }

    /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */
    isReadModeFor(propName:string):boolean {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.maintainable || !propDef.writeEnabled;
        }
        return true;
    }

    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    get isWriteMode():boolean {
        return this._editorState === EditorState.WRITE;
    }

    /**
     * Perform the action associated with the given MenuDef on this EditorPane.
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param menuDef
     * @param pendingWrites
     * @returns {Future<NavRequest>}
     */
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

    /**
     * Properties whose {@link PropDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorContext.getAvailableValues}.  When a value is seleted, other properties
     * available values may change. (i.e. Country, State, City dropdowns)
     * @param propertyName
     * @param value
     * @returns {Future<null>}
     */
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

    /**
     * Read (load) the {@link EntityRec} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<EntityRec>}
     */
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

    /**
     * Get the requested GPS accuracy
     * @returns {Number}
     */
    requestedAccuracy():number {
        var accuracyStr = this.paneDef.settings[EditorContext.GPS_ACCURACY];
        return accuracyStr ? Number(accuracyStr) : 500;
    }

    /**
     * Get the requested GPS timeout in seconds
     * @returns {Number}
     */
    requestedTimeoutSeconds():number {
        var timeoutStr = this.paneDef.settings[EditorContext.GPS_SECONDS];
        return timeoutStr ? Number(timeoutStr) : 30;
    }

    /**
     * Set the value of a property in this {@link EntityRecord}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */
    setPropValue(name:string, value:any):any {
        const propDef:PropDef = this.propDefAtName(name);
        let parsedValue:any = null;
        if (propDef) {
            parsedValue = (value !== null && value !== undefined) ? this.parseValue(value, propDef.name) : null;
            this.buffer.setValue(propDef.name, parsedValue);
        }
        return parsedValue;
    }

    /**
     * Set a binary property from a string formatted as a 'data url'
     * See {@link https://en.wikipedia.org/wiki/Data_URI_scheme}
     * @param name
     * @param dataUrl
     */
    setBinaryPropWithDataUrl(name:string, dataUrl:string) {
        const urlObj:DataUrl = new DataUrl(dataUrl);
        this.setBinaryPropWithEncodedData(name, urlObj.data, urlObj.mimeType);
    }

    /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */
    setBinaryPropWithEncodedData(name:string, encodedData:string, mimeType:string) {
        const propDef:PropDef = this.propDefAtName(name);
        if (propDef) {
            const value = new EncodedBinary(encodedData, mimeType);
            this.buffer.setValue(propDef.name, value);
        }
    }

    /**
     * Write this record (i.e. {@link EntityRec}} back to the server
     * @returns {Future<Either<NavRequest, EntityRec>>}
     */
    write():Future<Either<NavRequest,EntityRec>> {

        const deltaRec:EntityRec = this.buffer.afterEffects();
        return this.writeBinaries(deltaRec).bind((binResult) => {
            var result:Future<Either<NavRequest, EntityRec>> = DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, deltaRec,
                this.sessionContext).bind<Either<NavRequest, EntityRec>>((either:Either<Redirection,XWriteResult>)=> {
                if (either.isLeft) {
                    var ca = new ContextAction('#write', this.parentContext.dialogRedirection.objectId, this.actionSource);
                    return NavRequestUtil.fromRedirection(either.left, ca, this.sessionContext).map((navRequest:NavRequest)=> {
                        return Either.left<NavRequest,EntityRec>(navRequest);
                    });
                } else {
                    var writeResult:XWriteResult = either.right;
                    this.putSettings(writeResult.dialogProps);
                    this.entityRecDef = writeResult.entityRecDef;
                    return Future.createSuccessfulFuture<Either<NavRequest, EntityRec>>('EditorContext::write', Either.right(writeResult.entityRec));
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

    /**
     * @private
     */
    initialize() {
        this._entityRecDef = this.paneDef.entityRecDef;
        this._settings = ObjUtil.addAllProps(this.dialogRedirection.dialogProperties, {});
        this._editorState = this.isReadModeSetting ? EditorState.READ : EditorState.WRITE;
    }

    /**
     * Get this Editor Pane's settings
     * @returns {StringDictionary}
     */
    get settings():StringDictionary {
        return this._settings;
    }

    //protected 

    protected readBinary(propName:string, entityRec:EntityRec):Future<Binary> {
        let seq:number = 0;
        let buffer:string = '';
        let f:(XReadPropertyResult)=>Future<Binary> = (result:XReadPropertyResult) => {
            buffer += result.data;
            if (result.hasMore) {
                return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                return Future.createSuccessfulFuture<Binary>('readProperty', new EncodedBinary(buffer));
            }
        }
        return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
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

}


/**
 * *********************************
 */

/**
 * PaneContext Subtype that represents a Catavolt Form Definition
 * A form is a 'container' composed of child panes of various concrete types.
 * A FormContext parallels this design, and contains a list of 'child' contexts
 * See also {@link FormDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class FormContext extends PaneContext {

    private _destroyed:boolean = false;
    private _offlineProps:StringDictionary = {};

    /**
     * @private
     * @param _dialogRedirection
     * @param _actionSource
     * @param _formDef
     * @param _childrenContexts
     * @param _offlineCapable
     * @param _offlineData
     * @param _sessionContext
     */
    constructor(private _dialogRedirection:DialogRedirection, private _actionSource:ActionSource,
                private _formDef:FormDef, private _childrenContexts:Array<PaneContext>, private _offlineCapable:boolean,
                private _offlineData:boolean, private _sessionContext:SessionContext) {
        super(null);
        this._childrenContexts = _childrenContexts || [];
        this._childrenContexts.forEach((c:PaneContext)=> {
            c.parentContext = this
        });
    }

    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    get actionSource():ActionSource {
        return this.parentContext ? this.parentContext.actionSource : this._actionSource;
    }

    /**
     * Get the list of child contexts that 'compose' this Form
     * @returns {Array<PaneContext>}
     */
    get childrenContexts():Array<PaneContext> {
        return this._childrenContexts;
    }

    /**
     * Close this form
     * @returns {Future<VoidResult>}
     */
    close():Future<VoidResult> {
        return DialogService.closeEditorModel(this.dialogRedirection.dialogHandle, this.sessionContext);
    }

    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    get entityRecDef():EntityRecDef {
        return this.formDef.entityRecDef;
    }

    /**
     * Get the underlying Form definition for this FormContext
     * @returns {FormDef}
     */
    get formDef():FormDef {
        return this._formDef;
    }

    /**
     * @private
     */
    get headerContext():PaneContext {
        throw new Error('FormContext::headerContext: Needs Impl');
    }

    /**
     * Perform the action associated with the given MenuDef on this Form
     * @param menuDef
     * @returns {Future<NavRequest>}
     */
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

    /**
     * Returns whether or not this Form is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this._destroyed || this.isAnyChildDestroyed;
    }

    /**
     * @private
     * @returns {boolean}
     */
    get offlineCapable():boolean {
        return this._offlineCapable;
    }

    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    get menuDefs():Array<MenuDef> {
        return this.formDef.menuDefs;
    }

    /**
     * @private
     * @returns {StringDictionary}
     */
    get offlineProps():StringDictionary {
        return this._offlineProps;
    }

    /**
     * Get the underlying form definition associated with this FormContext
     * @returns {FormDef}
     */
    get paneDef():PaneDef {
        return this.formDef;
    }

    /**
     * Get the current session information
     * @returns {SessionContext}
     */
    get sessionContext():SessionContext {
        return this._sessionContext;
    }


    /** --------------------- MODULE ------------------------------*/
    //*** let's pretend this has module level visibility (no such thing (yet!))

    /**
     * @private
     * @returns {boolean}
     */
    get isAnyChildDestroyed():boolean {
        return this.childrenContexts.some((paneContext:PaneContext)=> {
            if (paneContext instanceof EditorContext || paneContext instanceof QueryContext) {
                return paneContext.isDestroyed;
            }
            return false;
        });
    }

    /**
     * @private
     * @param navRequest
     */
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
/**
 * *********************************
 */

/**
 * Enum to manage query states
 */
enum QueryState { ACTIVE, DESTROYED }

/**
 * Enum specifying query direction
 */
export enum QueryDirection { FORWARD, BACKWARD }

/**
 * PaneContext Subtype that represents a 'Query Pane'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class QueryContext extends PaneContext {

    private _lastQueryFr:Future<QueryResult>;
    private _queryState:QueryState;
    private _scroller:QueryScroller;

    /**
     * @private
     * @param paneRef
     * @param _offlineRecs
     * @param _settings
     */
    constructor(paneRef:number, private _offlineRecs:Array<EntityRec> = [], private _settings:StringDictionary = {}) {
        super(paneRef);
    }

    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    get entityRecDef():EntityRecDef {
        return this.paneDef.entityRecDef;
    }

    /**
     * Returns whether or not a column is of a binary type
     * @param columnDef
     * @returns {PropDef|boolean}
     */
    isBinary(columnDef:ColumnDef):boolean {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
    }

    /**
     * Returns whether or not this Query Pane is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this._queryState === QueryState.DESTROYED;
    }

    /**
     * Get the last query result as a {@link Future}
     * @returns {Future<QueryResult>}
     */
    get lastQueryFr():Future<QueryResult> {
        return this._lastQueryFr;
    }

    /**
     * @private
     * @returns {Array<EntityRec>}
     */
    get offlineRecs():Array<EntityRec> {
        return this._offlineRecs;
    }

    set offlineRecs(offlineRecs:Array<EntityRec>) {
        this._offlineRecs = offlineRecs;
    }

    /**
     * Get the pane mode
     * @returns {string}
     */
    get paneMode():string {
        return this._settings['paneMode'];
    }

    /**
     * Perform this action associated with the given MenuDef on this Pane.
     * The targets array is expected to be an array of object ids.
     * @param menuDef
     * @param targets
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menuDef:MenuDef, targets:Array<string>):Future<NavRequest> {
        return DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId,
            targets, this.sessionContext).bind((redirection:Redirection)=> {
            var target = targets.length > 0 ? targets[0] : null;
            var ca:ContextAction = new ContextAction(menuDef.actionId, target, this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, this.sessionContext);
        }).map((navRequest:NavRequest)=> {
            this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, navRequest);
            if (this.isDestroyedSetting) {
                this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    }

    /**
     * Perform a query
     * Note: {@link QueryScroller} is the preferred way to perform a query.  
     * see {@link QueryContext.newScroller} and {@link QueryContext.setScroller}
     * @param maxRows
     * @param direction
     * @param fromObjectId
     * @returns {Future<QueryResult>}
     */
    query(maxRows:number, direction:QueryDirection, fromObjectId:string):Future<QueryResult> {
        return DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows,
            fromObjectId, this.sessionContext).bind((value:XQueryResult)=> {
            var result = new QueryResult(value.entityRecs, value.hasMore);
            if (this.lastRefreshTime === new Date(0)) {
                this.lastRefreshTime = new Date();
            }
            return Future.createSuccessfulFuture('QueryContext::query', result);
        });
    }

    /**
     * Clear the QueryScroller's buffer and perform this query
     * @returns {Future<Array<EntityRec>>}
     */
    refresh():Future<Array<EntityRec>> {
        return this._scroller.refresh();
    }

    /**
     * Get the associated QueryScroller
     * @returns {QueryScroller}
     */
    get scroller():QueryScroller {
        if (!this._scroller) {
            this._scroller = this.newScroller();
        }
        return this._scroller;
    }

    /**
     * Creates a new QueryScroller with the given values
     * @param pageSize
     * @param firstObjectId
     * @param markerOptions
     * @returns {QueryScroller}
     */
    setScroller(pageSize:number, firstObjectId:string, markerOptions:Array<QueryMarkerOption>) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    }

    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    newScroller():QueryScroller {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    }

    /**
     * Get the settings associated with this Query
     * @returns {StringDictionary}
     */
    settings():StringDictionary {
        return this._settings;
    }

    //protected 

    protected readBinary(propName:string, entityRec:EntityRec):Future<Binary> {
        let seq:number = 0;
        let buffer:string = '';
        let f:(XReadPropertyResult)=>Future<Binary> = (result:XReadPropertyResult) => {
            buffer += result.data;
            if (result.hasMore) {
                return DialogService.readQueryProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, entityRec.objectId, ++seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                return Future.createSuccessfulFuture<Binary>('readProperty', new EncodedBinary(buffer));
            }
        }
        return DialogService.readQueryProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, entityRec.objectId, seq, PaneContext.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
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

    private get isRefreshSetting():boolean {
        return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
    }

}

/**
 * EditorContext Subtype that represents a 'BarcodeScan Pane'.
 * A Barcode Scan is an Editor Pane with the purpose of displaying property values for a single record that
 * represents barcode information.
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}.
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class BarcodeScanContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get barcodeScanDef():BarcodeScanDef {
        return <BarcodeScanDef>this.paneDef;
    }

}

/**
 * EditorContext Subtype that represents a 'Details Pane'.
 * A Details Pane is an Editor Pane with the purpose of displaying property values for a single record,
 * usually as names/values in a tabular arrangement.
 * See {@link DetailsDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class DetailsContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get detailsDef():DetailsDef {
        return <DetailsDef>this.paneDef;
    }

    get printMarkupURL():string {
        return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
    }

}

/**
 * EditorContext Subtype that represents a 'GeoFix Pane'.
 * A GeoFix Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoFixDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class GeoFixContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get geoFixDef():GeoFixDef {
        return <GeoFixDef>this.paneDef;
    }

}

/**
 * EditorContext Subtype that represents a 'GeoLocation Pane'.
 * A GeoLocation Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class GeoLocationContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get geoLocationDef():GeoLocationDef {
        return <GeoLocationDef>this.paneDef;
    }

}

/**
 * QueryContext Subtype that represents a 'Calendar Pane'.
 * A 'Calendar' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying Calendar related information.
 * See {@link CalendarDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class CalendarContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get calendarDef():CalendarDef {
        return <CalendarDef>this.paneDef;
    }

}

/**
 * QueryContext Subtype that represents a 'Graph Pane'.
 * A 'Graph' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying graphs and charts.
 * See {@link GraphDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class GraphContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get graphDef():GraphDef {
        return <GraphDef>this.paneDef;
    }

}

 /**
 * QueryContext Subtype that represents an 'Image Picker Pane'.
 * An 'Image Picker' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying an Image Picker component.
 * See {@link ImagePickerDef}, {@link EntityRec} and {@link EntityRecDef}.
  * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
  * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class ImagePickerContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get imagePickerDef():ImagePickerDef {
        return <ImagePickerDef>this.paneDef;
    }

}

/**
 * QueryContext Subtype that represents a 'List Pane'.
 * An 'List' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying a tabular list of records.
 * See {@link ListDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class ListContext extends QueryContext {

    constructor(paneRef:number, offlineRecs:Array<EntityRec> = [], settings:StringDictionary = {}) {
        super(paneRef, offlineRecs, settings);
    }

    get columnHeadings():Array<string> {
        return this.listDef.activeColumnDefs.map((cd:ColumnDef)=> {
            return cd.heading;
        });
    }

    get listDef():ListDef {
        return <ListDef>this.paneDef;
    }

    rowValues(entityRec:EntityRec):Array<any> {
        return this.listDef.activeColumnDefs.map((cd:ColumnDef)=> {
            return entityRec.valueAtName(cd.name);
        });
    }

    get style():string {
        return this.listDef.style;
    }

}
/**
 * QueryContext Subtype that represents a 'Map Pane'.
 * A 'Map' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying an annotated map with location markers.
 * See {@link MapDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export class MapContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get mapDef():MapDef {
        return <MapDef>this.paneDef;
    }

}

/**
 * A PaneDef represents a Catavolt 'Pane' definition.  A Pane can be thought of as a 'panel' or UI component
 * that is responsible for displaying a data record or records. The Pane describes 'how' and 'where' the data will be
 * displayed, as well as surrounding 'meta' data (i.e. the Pane title, the Pane's menus).  The Pane itself does not contain
 * the record or records to be displayed, but may be combined with a {@link EntityRecord}(s) to display the data.
 */
export class PaneDef {

    /**
     * @private
     * @param childXOpenResult
     * @param childXComp
     * @param childXPaneDefRef
     * @param childXPaneDef
     * @param childXActiveColDefs
     * @param childMenuDefs
     * @returns {any}
     */
    static fromOpenPaneResult(childXOpenResult:XOpenDialogModelResult,
                              childXComp:XFormModelComp,
                              childXPaneDefRef:XPaneDefRef,
                              childXPaneDef:XPaneDef,
                              childXActiveColDefs:XGetActiveColumnDefsResult,
                              childMenuDefs:Array<MenuDef>):Try<PaneDef> {

        var settings:StringDictionary = {};
        ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);

        var newPaneDef:PaneDef;

        if (childXPaneDef instanceof XListDef) {
            var xListDef:XListDef = childXPaneDef;
            var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
            newPaneDef = new ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs,
                xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns,
                childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        } else if (childXPaneDef instanceof XDetailsDef) {
            var xDetailsDef:XDetailsDef = childXPaneDef;
            var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
            newPaneDef = new DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs,
                xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText,
                xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        } else if (childXPaneDef instanceof XMapDef) {
            var xMapDef:XMapDef = childXPaneDef;
            var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
            newPaneDef = new MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs,
                xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty,
                xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty,
                xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        } else if (childXPaneDef instanceof XGraphDef) {
            var xGraphDef:XGraphDef = childXPaneDef;
            var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
            newPaneDef = new GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs,
                xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xOpenQueryModelResult.defaultActionId,
                xGraphDef.graphType, xGraphDef.displayQuadrantLines, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint,
                xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel, xGraphDef.xAxisLabel, xGraphDef.xAxisRangeFrom,
                xGraphDef.xAxisRangeTo, xGraphDef.yAxisLabel, xGraphDef.yAxisRangeFrom, xGraphDef.yAxisRangeTo);
        } else if (childXPaneDef instanceof XBarcodeScanDef) {
            var xBarcodeScanDef:XBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
            newPaneDef = new BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title,
                childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof XGeoFixDef) {
            var xGeoFixDef:XGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
            newPaneDef = new GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title,
                childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof XGeoLocationDef) {
            var xGeoLocationDef:XGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult:XOpenEditorModelResult = <XOpenEditorModelResult>childXOpenResult;
            newPaneDef = new GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title,
                childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        } else if (childXPaneDef instanceof XCalendarDef) {
            var xCalendarDef:XCalendarDef = childXPaneDef;
            var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
            newPaneDef = new CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title,
                childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty,
                xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty,
                xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty,
                xOpenQueryModelResult.defaultActionId);
        } else if (childXPaneDef instanceof XImagePickerDef) {
            var xImagePickerDef:XImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult:XOpenQueryModelResult = <XOpenQueryModelResult>childXOpenResult;
            newPaneDef = new ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title,
                childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty,
                xImagePickerDef.defaultActionId);
        } else {
            return new Failure<PaneDef>('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
        }

        return new Success(newPaneDef);

    }

    /**
     * @private
     * @param _paneId
     * @param _name
     * @param _label
     * @param _title
     * @param _menuDefs
     * @param _entityRecDef
     * @param _dialogRedirection
     * @param _settings
     */
    constructor(private _paneId:string,
                private _name:string,
                private _label:string,
                private _title:string,
                private _menuDefs:Array<MenuDef>,
                private _entityRecDef:EntityRecDef,
                private _dialogRedirection:DialogRedirection,
                private _settings:StringDictionary) {
    }

    /**
     * Get the {@link DialogHandle} associated with this PaneDef
     * @returns {DialogHandle}
     */
    get dialogHandle():DialogHandle {
        return this._dialogRedirection.dialogHandle;
    }

    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    get entityRecDef():EntityRecDef {
        return this._entityRecDef;
    }

    /**
     * Find the title for this Pane
     * @returns {string}
     */
    findTitle():string {
        var result:string = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    }

    /**
     * Get the label for this Pane
     * @returns {string}
     */
    get label():string {
        return this._label;
    }

    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    get menuDefs():Array<MenuDef> {
        return this._menuDefs;
    }

    get name():string {
        return this._name;
    }

    get paneId():string {
        return this._paneId;
    }

    get settings():StringDictionary {
        return this._settings;
    }

    get title():string {
        return this._title;
    }
}

/**
 * PaneDef Subtype that describes a Barcode Pane
 */
export class BarcodeScanDef extends PaneDef {

    /**
     * @private 
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }
}

/**
 * PaneDef Subtype that describes a Calendar Pane
 */
export class CalendarDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _descriptionPropName
     * @param _initialStyle
     * @param _startDatePropName
     * @param _startTimePropName
     * @param _endDatePropName
     * @param _endTimePropName
     * @param _occurDatePropName
     * @param _occurTimePropName
     * @param _defaultActionId
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _descriptionPropName:string,
                private _initialStyle:string,
                private _startDatePropName:string,
                private _startTimePropName:string,
                private _endDatePropName:string,
                private _endTimePropName:string,
                private _occurDatePropName:string,
                private _occurTimePropName:string,
                private _defaultActionId:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get descriptionPropName():string {
        return this._descriptionPropName;
    }

    get initialStyle():string {
        return this._initialStyle;
    }

    get startDatePropName():string {
        return this._startDatePropName;
    }

    get startTimePropName():string {
        return this._startTimePropName;
    }

    get endDatePropName():string {
        return this._endDatePropName;
    }

    get endTimePropName():string {
        return this._endTimePropName;
    }

    get occurDatePropName():string {
        return this._occurDatePropName;
    }

    get occurTimePropName():string {
        return this._occurTimePropName;
    }

    get defaultActionId():string {
        return this._defaultActionId;
    }
}

/**
 * PaneDef Subtype that describes a Details Pane
 */
export class DetailsDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _cancelButtonText
     * @param _commitButtonText
     * @param _editable
     * @param _focusPropName
     * @param _graphicalMarkup
     * @param _rows
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _cancelButtonText:string,
                private _commitButtonText:string,
                private _editable:boolean,
                private _focusPropName:string,
                private _graphicalMarkup:string,
                private _rows:Array<Array<CellDef>>) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }

    get cancelButtonText():string {
        return this._cancelButtonText;
    }

    get commitButtonText():string {
        return this._commitButtonText;
    }

    get editable():boolean {
        return this._editable;
    }

    get focusPropName():string {
        return this._focusPropName;
    }

    get graphicalMarkup():string {
        return this._graphicalMarkup;
    }

    get rows():Array<Array<CellDef>> {
        return this._rows;
    }

}

/**
 * PaneDef Subtype that describes a Form Pane
 */
export class FormDef extends PaneDef {

    /**
     * @private
     * @param formXOpenResult
     * @param formXFormDef
     * @param formMenuDefs
     * @param childrenXOpens
     * @param childrenXPaneDefs
     * @param childrenXActiveColDefs
     * @param childrenMenuDefs
     * @returns {any}
     */
    static fromOpenFormResult(formXOpenResult:XOpenEditorModelResult,
                              formXFormDef:XFormDef,
                              formMenuDefs:Array<MenuDef>,
                              childrenXOpens:Array<XOpenDialogModelResult>,
                              childrenXPaneDefs:Array<XPaneDef>,
                              childrenXActiveColDefs:Array<XGetActiveColumnDefsResult>,
                              childrenMenuDefs:Array<Array<MenuDef>>):Try<FormDef> {

        var settings:StringDictionary = {'open': true};
        ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
        var headerDef:DetailsDef = null;
        var childrenDefs:Array<PaneDef> = [];
        for (var i = 0; i < childrenXOpens.length; i++) {
            var childXOpen = childrenXOpens[i];
            var childXPaneDef = childrenXPaneDefs[i];
            var childXActiveColDefs = childrenXActiveColDefs[i];
            var childMenuDefs = childrenMenuDefs[i];
            var childXComp = formXOpenResult.formModel.children[i];
            var childXPaneDefRef = formXFormDef.paneDefRefs[i];
            var paneDefTry = PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef,
                childXActiveColDefs, childMenuDefs);
            if (paneDefTry.isFailure) {
                return new Failure<FormDef>(paneDefTry.failure);
            } else {
                childrenDefs.push(paneDefTry.success);
            }
        }

        return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label,
            formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection,
            settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));

    }

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _formLayout
     * @param _formStyle
     * @param _borderStyle
     * @param _headerDef
     * @param _childrenDefs
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _formLayout:string,
                private _formStyle:string,
                private _borderStyle:string,
                private _headerDef:DetailsDef,
                private _childrenDefs:Array<PaneDef>) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get borderStyle():string {
        return this._borderStyle;
    }

    get childrenDefs():Array<PaneDef> {
        return this._childrenDefs;
    }

    get formLayout():string {
        return this._formLayout;
    }

    get formStyle():string {
        return this._formStyle;
    }

    get headerDef():DetailsDef {
        return this._headerDef;
    }

    get isCompositeForm():boolean {
        return this.formStyle === 'COMPOSITE_FORM'
    }

    get isFlowingLayout():boolean {
        return this.formLayout && this.formLayout === 'FLOWING';
    }

    get isFlowingTopDownLayout():boolean {
        return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
    }

    get isFourBoxSquareLayout():boolean {
        return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
    }

    get isHorizontalLayout():boolean {
        return this.formLayout && this.formLayout === 'H';
    }

    get isOptionsFormLayout():boolean {
        return this.formLayout && this.formLayout === 'OPTIONS_FORM';
    }

    get isTabsLayout():boolean {
        return this.formLayout && this.formLayout === 'TABS';
    }

    get isThreeBoxOneLeftLayout():boolean {
        return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
    }

    get isThreeBoxOneOverLayout():boolean {
        return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
    }

    get isThreeBoxOneRightLayout():boolean {
        return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
    }

    get isThreeBoxOneUnderLayout():boolean {
        return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
    }

    get isTopDownLayout():boolean {
        return this.formLayout && this.formLayout === 'TOP_DOWN';
    }

    get isTwoVerticalLayout():boolean {
        return this.formLayout && this.formLayout === 'H(2,V)';
    }
}

/**
 * PaneDef Subtype that describes a GeoFix Pane
 */
export class GeoFixDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }
}
/**
 * *********************************
 */
/**
 * PaneDef Subtype that describes a GeoLocation Pane
 */
export class GeoLocationDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }
}

/**
 * PaneDef Subtype that describes a Graph Pane
 */
export class GraphDef extends PaneDef {

    static GRAPH_TYPE_CARTESIAN = "GRAPH_TYPE_BAR";
    static GRAPH_TYPE_PIE = "GRAPH_TYPE_PIE";
    static PLOT_TYPE_BAR = "BAR";
    static PLOT_TYPE_BUBBLE = "BUBBLE";
    static PLOT_TYPE_LINE = "LINE";
    static PLOT_TYPE_SCATTER = "SCATTER";
    static PLOT_TYPE_STACKED = "STACKED";


    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _defaultActionId
     * @param _graphType
     * @param _displayQuadrantLines
     * @param _identityDataPointDef
     * @param _groupingDataPointDef
     * @param _dataPointDefs
     * @param _filterDataPointDefs
     * @param _sampleModel
     * @param _xAxisLabel
     * @param _xAxisRangeFrom
     * @param _xAxisRangeTo
     * @param _yAxisLabel
     * @param _yAxisRangeFrom
     * @param _yAxisRangeTo
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _defaultActionId:string,
                private _graphType:string,
                private _displayQuadrantLines:boolean,
                private _identityDataPointDef:GraphDataPointDef,
                private _groupingDataPointDef:GraphDataPointDef,
                private _dataPointDefs:Array<GraphDataPointDef>,
                private _filterDataPointDefs:Array<GraphDataPointDef>,
                private _sampleModel:string,
                private _xAxisLabel:string,
                private _xAxisRangeFrom:number,
                private _xAxisRangeTo:number,
                private _yAxisLabel:string,
                private _yAxisRangeFrom:number,
                private _yAxisRangeTo:number) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get dataPointDefs():Array<GraphDataPointDef> {
        return this._dataPointDefs;
    }

    get defaultActionId():string {
        return this._defaultActionId;
    }

    get displayQuadrantLines():boolean {
        return this._displayQuadrantLines;
    }

    get filterDataPointDefs():Array<GraphDataPointDef> {
        return this._filterDataPointDefs;
    }

    get identityDataPointDef():GraphDataPointDef {
        return this._identityDataPointDef;
    }

    get graphType():string {
        return this._graphType;
    }

    get groupingDataPointDef():GraphDataPointDef {
        return this._groupingDataPointDef;
    }

    get sampleModel():string {
        return this._sampleModel;
    }

    get xAxisLabel():string {
        return this._xAxisLabel;
    }

    get xAxisRangeFrom():number {
        return this._xAxisRangeFrom;
    }

    get xAxisRangeTo():number {
        return this._xAxisRangeTo;
    }

    get yAxisLabel():string {
        return this._yAxisLabel;
    }

    get yAxisRangeFrom():number {
        return this._yAxisRangeFrom;
    }

    get yAxisRangeTo():number {
        return this._yAxisRangeTo;
    }

}

/**
 * PaneDef Subtype that describes a ImagePicker Pane
 */
export class ImagePickerDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _URLPropName
     * @param _defaultActionId
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _URLPropName:string,
                private _defaultActionId:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get defaultActionId():string {
        return this._defaultActionId;
    }

    get URLPropName():string {
        return this._URLPropName;
    }
}

/**
 * PaneDef Subtype that describes a List Pane
 */
export class ListDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _style
     * @param _initialColumns
     * @param _activeColumnDefs
     * @param _columnsStyle
     * @param _defaultActionId
     * @param _graphicalMarkup
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _style:string,
                private _initialColumns:number,
                private _activeColumnDefs:Array<ColumnDef>,
                private _columnsStyle:string,
                private _defaultActionId:string,
                private _graphicalMarkup:string) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }

    get activeColumnDefs():Array<ColumnDef> {
        return this._activeColumnDefs;
    }

    get columnsStyle():string {
        return this._columnsStyle;
    }

    get defaultActionId():string {
        return this._defaultActionId;
    }

    get graphicalMarkup():string {
        return this._graphicalMarkup;
    }

    get initialColumns():number {
        return this._initialColumns;
    }

    get isDefaultStyle():boolean {
        return this.style && this.style === 'DEFAULT';
    }

    get isDetailsFormStyle():boolean {
        return this.style && this.style === 'DETAILS_FORM';
    }

    get isFormStyle():boolean {
        return this.style && this.style === 'FORM';
    }

    get isTabularStyle():boolean {
        return this.style && this.style === 'TABULAR';
    }

    get style():string {
        return this._style;
    }


}

/**
 * PaneDef Subtype that describes a Map Pane
 */
export class MapDef extends PaneDef {

    /**
     * @private
     * @param paneId
     * @param name
     * @param label
     * @param title
     * @param menuDefs
     * @param entityRecDef
     * @param dialogRedirection
     * @param settings
     * @param _descriptionPropName
     * @param _streetPropName
     * @param _cityPropName
     * @param _statePropName
     * @param _postalCodePropName
     * @param _latitudePropName
     * @param _longitudePropName
     */
    constructor(paneId:string,
                name:string,
                label:string,
                title:string,
                menuDefs:Array<MenuDef>,
                entityRecDef:EntityRecDef,
                dialogRedirection:DialogRedirection,
                settings:StringDictionary,
                private _descriptionPropName:string,
                private _streetPropName:string,
                private _cityPropName:string,
                private _statePropName:string,
                private _postalCodePropName:string,
                private _latitudePropName:string,
                private _longitudePropName:string) {

        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);

    }

    get cityPropName():string {
        return this._cityPropName;
    }

    get descriptionPropName():string {
        return this._descriptionPropName;
    }

    get latitudePropName():string {
        return this._latitudePropName;
    }

    get longitudePropName():string {
        return this._longitudePropName;
    }

    get postalCodePropName():string {
        return this._postalCodePropName;
    }

    get statePropName():string {
        return this._statePropName;
    }

    get streetPropName():string {
        return this._streetPropName;
    }

}

/**
 * *********************************
 */
    
export class BinaryRef {

    constructor(private _settings:StringDictionary) {
    }

    static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

        if (encodedValue && encodedValue.length > 0) {
            return new Success(new InlineBinaryRef(encodedValue, settings));
        } else {
            return new Success(new ObjectBinaryRef(settings));
        }

    }

    get settings():StringDictionary {
        return this._settings;
    }

}

export class InlineBinaryRef extends BinaryRef {

    constructor(private _inlineData:string, settings:StringDictionary) {
        super(settings);
    }

    /* Base64 encoded data */
    get inlineData():string {
        return this._inlineData;
    }

    toString():string {
        return this._inlineData;
    }

}

export class ObjectBinaryRef extends BinaryRef {

    constructor(settings:StringDictionary) {
        super(settings);
    }

}
/**
 * *********************************
 */

/**
 * Represents a binary value
 */
export interface Binary {

    /**
     * Return a url resprenting this binary value
     */
    toUrl():string;
}

/**
 * Represents a base64 encoded binary
 */
export class EncodedBinary implements Binary {

    constructor(private _data:string, private _mimeType?:string) {
    }

    /**
     * Get the base64 encoded data
     * @returns {string}
     */
    get data():string {
        return this._data;
    }

    /**
     * Get the mime-type
     * @returns {string|string}
     */
    get mimeType():string {
        return this._mimeType || 'application/octet-stream';
    }

    /**
     * Returns a 'data url' representation of this binary, including the encoded data
     * @returns {string}
     */
    toUrl():string {
        return DataUrl.createDataUrl(this.mimeType, this.data);
    }
}

/**
 * Represents a remote binary
 */
export class UrlBinary implements Binary {

    constructor(private _url:string) {
    }

    get url():string {
        return this._url;
    }

    /**
     * Returns a url that 'points to' the binary data
     * @returns {string}
     */
    toUrl():string {
        return this.url;
    }
}


/**
 * An object that directs the client to a new resource
 */
export class Redirection {

    static fromWS(otype:string, jsonObj):Try<Redirection> {
        if (jsonObj && jsonObj['webURL']) {
            return OType.deserializeObject<WebRedirection>(jsonObj, 'WSWebRedirection', OType.factoryFn);
        } else if (jsonObj && jsonObj['workbenchId']) {
            return OType.deserializeObject<WorkbenchRedirection>(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
        } else {
            return OType.deserializeObject<DialogRedirection>(jsonObj, 'WSDialogRedirection', OType.factoryFn);
        }
    }

    fromDialogProperties:StringDictionary;
}

/**
 * Type of Redirection that represents a new Catavolt resource on the server
 */
export class DialogRedirection extends Redirection {

    constructor(private _dialogHandle:DialogHandle,
                private _dialogType:string,
                private _dialogMode:string,
                private _paneMode:string,
                private _objectId:string,
                private _open:boolean,
                private _domainClassName:string,
                private _dialogModelClassName:string,
                private _dialogProperties:StringDictionary,
                private _fromDialogProperties:StringDictionary) {
        super();
    }


    get dialogHandle():DialogHandle {
        return this._dialogHandle;
    }

    get dialogMode():string {
        return this._dialogMode;
    }

    get dialogModelClassName():string {
        return this._dialogModelClassName;
    }

    get dialogProperties():StringDictionary {
        return this._dialogProperties;
    }

    get dialogType():string {
        return this._dialogType;
    }

    get domainClassName():string {
        return this._domainClassName;
    }

    get fromDialogProperties():StringDictionary {
        return this._fromDialogProperties;
    }

    set fromDialogProperties(props:StringDictionary) {
        this._fromDialogProperties = props;
    }

    get isEditor():boolean {
        return this._dialogType === 'EDITOR';
    }

    get isQuery():boolean {
        return this._dialogType === 'QUERY';
    }

    get objectId():string {
        return this._objectId;
    }

    get open():boolean {
        return this._open;
    }

    get paneMode():string {
        return this._paneMode;
    }

}

export class NullRedirection extends Redirection {

    constructor(public fromDialogProperties:StringDictionary) {
        super();
    }
}

export class WebRedirection extends Redirection implements NavRequest {

    constructor(private _webURL:string,
                private _open:boolean,
                private _dialogProperties:StringDictionary,
                private _fromDialogProperties:StringDictionary) {
        super();
    }

    get fromDialogProperties():StringDictionary {
        return this._fromDialogProperties;
    }

    get open():boolean {
        return this._open;
    }

    get webURL():string {
        return this._webURL;
    }

    set fromDialogProperties(props:StringDictionary) {
        this._fromDialogProperties = props;
    }


}

export class WorkbenchRedirection extends Redirection {

    constructor(private _workbenchId:string,
                private _dialogProperties:StringDictionary,
                private _fromDialogProperties:StringDictionary) {
        super();
    }

    get workbenchId():string {
        return this._workbenchId;
    }

    get dialogProperties():StringDictionary {
        return this._dialogProperties;
    }

    get fromDialogProperties():StringDictionary {
        return this._fromDialogProperties;
    }

    set fromDialogProperties(props:StringDictionary) {
        this._fromDialogProperties = props;
    }


}

/**
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export interface EntityRec {

    annos:Array<DataAnno>;

    annosAtName(propName:string):Array<DataAnno>;

    afterEffects(after:EntityRec):EntityRec;

    backgroundColor:string;
    backgroundColorFor(propName:string):string;

    foregroundColor:string;
    foregroundColorFor(propName:string):string;

    imageName:string;
    imageNameFor(propName:string):string;

    imagePlacement:string;
    imagePlacementFor(propName:string):string;

    isBoldText:boolean;
    isBoldTextFor(propName:string):boolean;

    isItalicText:boolean;
    isItalicTextFor(propName:string):boolean;

    isPlacementCenter:boolean;
    isPlacementCenterFor(propName:string):boolean;

    isPlacementLeft:boolean;
    isPlacementLeftFor(propName:string):boolean;

    isPlacementRight:boolean;
    isPlacementRightFor(propName:string):boolean;

    isPlacementStretchUnder:boolean;
    isPlacementStretchUnderFor(propName:string):boolean;

    isPlacementUnder:boolean;
    isPlacementUnderFor(propName:string):boolean;

    isUnderline:boolean;
    isUnderlineFor(propName:string):boolean;

    objectId:string;

    overrideText:string;
    overrideTextFor(propName:string):string;

    propAtIndex(index:number):Prop;

    propAtName(propName:string):Prop;

    propCount:number;

    propNames:Array<string>;

    propValues:Array<any>;

    props:Array<Prop>;

    tipText:string;
    tipTextFor(propName:string):string;

    toEntityRec():EntityRec;

    toWSEditorRecord():StringDictionary;

    toWS():StringDictionary;

    valueAtName(propName:string):any;
}

/**
 * Utility for working with EntityRecs
 */
export class EntityRecUtil {

    static newEntityRec(objectId:string, props:Array<Prop>, annos?:Array<DataAnno>):EntityRec {
        return annos ? new EntityRecImpl(objectId, ArrayUtil.copy(props), ArrayUtil.copy(annos)) : new EntityRecImpl(objectId, ArrayUtil.copy(props));
    }

    static union(l1:Array<Prop>, l2:Array<Prop>):Array<Prop> {
        var result:Array<Prop> = ArrayUtil.copy(l1);
        l2.forEach((p2:Prop)=> {
            if (!l1.some((p1:Prop, i)=> {
                    if (p1.name === p2.name) {
                        result[i] = p2;
                        return true;
                    }
                    return false;
                })) {
                result.push(p2);
            }
        });
        return result;
    }


    //module level functions

    static fromWSEditorRecord(otype:string, jsonObj):Try<EntityRec> {

        var objectId = jsonObj['objectId'];
        var namesJson:StringDictionary = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new Failure<EntityRec>('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw:Array<string> = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new Failure<EntityRec>('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw:Array<any> = propsJson['values'];

        var propsTry = Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure) return new Failure<EntityRec>(propsTry.failure);

        var props:Array<Prop> = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry:Try<Array<Prop>> = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure) return new Failure<EntityRec>(annotatedPropsTry.failure);
            props = annotatedPropsTry.success;
        }
        var recAnnos:Array<DataAnno> = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry:Try<Array<DataAnno>> = DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure) return new Failure<EntityRec>(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new Success(new EntityRecImpl(objectId, props, recAnnos));
    }
}

/**
 * An {@link EntityRec} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An EntityRec Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export class EntityBuffer implements EntityRec {

    static createEntityBuffer(objectId:string, before:Array<Prop>, after:Array<Prop>):EntityBuffer {
        return new EntityBuffer(EntityRecUtil.newEntityRec(objectId, before), EntityRecUtil.newEntityRec(objectId, after));
    }

    constructor(private _before:EntityRec, private _after?:EntityRec) {
        if (!_before) throw new Error('_before is null in EntityBuffer');
        if (!_after) this._after = _before;
    }

    get after():EntityRec {
        return this._after;
    }

    get annos():Array<DataAnno> {
        return this._after.annos;
    }

    annosAtName(propName:string):Array<DataAnno> {
        return this._after.annosAtName(propName);
    }

    afterEffects(afterAnother?:EntityRec):EntityRec {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        } else {
            return this._before.afterEffects(this._after);
        }
    }

    get backgroundColor():string {
        return this._after.backgroundColor;
    }

    backgroundColorFor(propName:string):string {
        return this._after.backgroundColorFor(propName);
    }

    get before():EntityRec {
        return this._before;
    }

    get foregroundColor():string {
        return this._after.foregroundColor;
    }

    foregroundColorFor(propName:string):string {
        return this._after.foregroundColorFor(propName);
    }

    get imageName():string {
        return this._after.imageName;
    }

    imageNameFor(propName:string):string {
        return this._after.imageNameFor(propName);
    }

    get imagePlacement():string {
        return this._after.imagePlacement;
    }

    imagePlacementFor(propName:string):string {
        return this._after.imagePlacement;
    }

    get isBoldText():boolean {
        return this._after.isBoldText;
    }

    isBoldTextFor(propName:string):boolean {
        return this._after.isBoldTextFor(propName);
    }

    isChanged(name:string):boolean {
        var before = this._before.propAtName(name);
        var after = this._after.propAtName(name);
        return (before && after) ? !before.equals(after) : !(!before && !after);
    }

    get isItalicText():boolean {
        return this._after.isItalicText;
    }

    isItalicTextFor(propName:string):boolean {
        return this._after.isItalicTextFor(propName);
    }

    get isPlacementCenter():boolean {
        return this._after.isPlacementCenter;
    }

    isPlacementCenterFor(propName:string):boolean {
        return this._after.isPlacementCenterFor(propName);
    }

    get isPlacementLeft():boolean {
        return this._after.isPlacementLeft;
    }

    isPlacementLeftFor(propName:string):boolean {
        return this._after.isPlacementLeftFor(propName);
    }

    get isPlacementRight():boolean {
        return this._after.isPlacementRight;
    }

    isPlacementRightFor(propName:string):boolean {
        return this._after.isPlacementRightFor(propName);
    }

    get isPlacementStretchUnder():boolean {
        return this._after.isPlacementStretchUnder;
    }

    isPlacementStretchUnderFor(propName:string):boolean {
        return this._after.isPlacementStretchUnderFor(propName);
    }

    get isPlacementUnder():boolean {
        return this._after.isPlacementUnder;
    }

    isPlacementUnderFor(propName:string):boolean {
        return this._after.isPlacementUnderFor(propName);
    }

    get isUnderline():boolean {
        return this._after.isUnderline;
    }

    isUnderlineFor(propName:string):boolean {
        return this._after.isUnderlineFor(propName);
    }

    get objectId():string {
        return this._after.objectId;
    }

    get overrideText():string {
        return this._after.overrideText;
    }

    overrideTextFor(propName:string):string {
        return this._after.overrideTextFor(propName);
    }

    propAtIndex(index:number):Prop {
        return this.props[index];
    }

    propAtName(propName:string):Prop {
        return this._after.propAtName(propName);
    }

    get propCount():number {
        return this._after.propCount;
    }

    get propNames():Array<string> {
        return this._after.propNames;
    }

    get props():Array<Prop> {
        return this._after.props;
    }

    get propValues():Array<any> {
        return this._after.propValues;
    }

    setValue(name:string, value) {
        const newProps = [];
        let found = false;
        this.props.forEach((prop:Prop)=> {
            if (prop.name === name) {
                newProps.push(new Prop(name, value));
                found = true;
            } else {
                newProps.push(prop);
            }
        });
        if (!found) {
            newProps.push(new Prop(name, value));
        }
        this._after = EntityRecUtil.newEntityRec(this.objectId, newProps, this.annos);
    }

    get tipText():string {
        return this._after.tipText;
    }

    tipTextFor(propName:string):string {
        return this._after.tipTextFor(propName);
    }

    toEntityRec():EntityRec {
        return EntityRecUtil.newEntityRec(this.objectId, this.props);
    }

    toWSEditorRecord():StringDictionary {
        return this.afterEffects().toWSEditorRecord();
    }

    toWS():StringDictionary {
        return this.afterEffects().toWS();
    }

    valueAtName(propName:string):any {
        return this._after.valueAtName(propName);
    }

}
/**
 * *********************************
 */
/**
 * The implementation of {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export class EntityRecImpl implements EntityRec {

    constructor(public objectId:string, public props:Array<Prop> = [], public annos:Array<DataAnno> = []) {
    }

    annosAtName(propName:string):Array<DataAnno> {
        var p = this.propAtName(propName);
        return p ? p.annos : [];
    }

    afterEffects(after:EntityRec):EntityRec {
        var effects = [];
        after.props.forEach((afterProp)=> {
            var beforeProp = this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new EntityRecImpl(after.objectId, effects);
    }

    get backgroundColor():string {
        return DataAnno.backgroundColor(this.annos);
    }

    backgroundColorFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    }

    get foregroundColor():string {
        return DataAnno.foregroundColor(this.annos);
    }

    foregroundColorFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    }

    get imageName():string {
        return DataAnno.imageName(this.annos);
    }

    imageNameFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    }

    get imagePlacement():string {
        return DataAnno.imagePlacement(this.annos);
    }

    imagePlacementFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    }

    get isBoldText():boolean {
        return DataAnno.isBoldText(this.annos);
    }

    isBoldTextFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    }

    get isItalicText():boolean {
        return DataAnno.isItalicText(this.annos);
    }

    isItalicTextFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;

    }

    get isPlacementCenter():boolean {
        return DataAnno.isPlacementCenter(this.annos);
    }

    isPlacementCenterFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    }

    get isPlacementLeft():boolean {
        return DataAnno.isPlacementLeft(this.annos);
    }

    isPlacementLeftFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;

    }

    get isPlacementRight():boolean {
        return DataAnno.isPlacementRight(this.annos);
    }

    isPlacementRightFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    }

    get isPlacementStretchUnder():boolean {
        return DataAnno.isPlacementStretchUnder(this.annos);
    }

    isPlacementStretchUnderFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    }

    get isPlacementUnder():boolean {
        return DataAnno.isPlacementUnder(this.annos);
    }

    isPlacementUnderFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    }

    get isUnderline():boolean {
        return DataAnno.isUnderlineText(this.annos);
    }

    isUnderlineFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;

    }

    get overrideText():string {
        return DataAnno.overrideText(this.annos);
    }

    overrideTextFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;

    }

    propAtIndex(index:number):Prop {
        return this.props[index];
    }

    propAtName(propName:string):Prop {
        var prop:Prop = null;
        this.props.some((p)=> {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    }

    get propCount():number {
        return this.props.length;
    }

    get propNames():Array<string> {
        return this.props.map((p)=> {
            return p.name;
        });
    }

    get propValues():Array<any> {
        return this.props.map((p)=> {
            return p.value;
        });
    }

    get tipText():string {
        return DataAnno.tipText(this.annos);
    }

    tipTextFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;

    }

    toEntityRec():EntityRec {
        return this;
    }

    toWSEditorRecord():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEditorRecord'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    }

    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEntityRec'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos) result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    }

    valueAtName(propName:string):any {
        var value = null;
        this.props.some((p)=> {
            if (p.name === propName) {
                value = p.value;
                return true;
            }
            return false;
        });
        return value;
    }

}
/**
 * *********************************
 */


/**
 * An empty or uninitialized {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export class NullEntityRec implements EntityRec {

    static singleton:NullEntityRec = new NullEntityRec();

    constructor() {
    }

    get annos():Array<DataAnno> {
        return [];
    }

    annosAtName(propName:string):Array<DataAnno> {
        return [];
    }

    afterEffects(after:EntityRec):EntityRec {
        return after;
    }

    get backgroundColor():string {
        return null;
    }

    backgroundColorFor(propName:string):string {
        return null;
    }

    get foregroundColor():string {
        return null;
    }

    foregroundColorFor(propName:string):string {
        return null;
    }

    get imageName():string {
        return null;
    }

    imageNameFor(propName:string):string {
        return null;
    }

    get imagePlacement():string {
        return null;
    }

    imagePlacementFor(propName:string):string {
        return null;
    }

    get isBoldText():boolean {
        return false;
    }

    isBoldTextFor(propName:string):boolean {
        return false;
    }

    get isItalicText():boolean {
        return false;
    }

    isItalicTextFor(propName:string):boolean {
        return false;
    }

    get isPlacementCenter():boolean {
        return false;
    }

    isPlacementCenterFor(propName:string):boolean {
        return false;
    }

    get isPlacementLeft():boolean {
        return false;
    }

    isPlacementLeftFor(propName:string):boolean {
        return false;
    }

    get isPlacementRight():boolean {
        return false;
    }

    isPlacementRightFor(propName:string):boolean {
        return false;
    }

    get isPlacementStretchUnder():boolean {
        return false;
    }

    isPlacementStretchUnderFor(propName:string):boolean {
        return false;
    }

    get isPlacementUnder():boolean {
        return false;
    }

    isPlacementUnderFor(propName:string):boolean {
        return false;
    }

    get isUnderline():boolean {
        return false;
    }

    isUnderlineFor(propName:string):boolean {
        return false;
    }

    get objectId():string {
        return null;
    }

    get overrideText():string {
        return null;
    }

    overrideTextFor(propName:string):string {
        return null;
    }

    propAtIndex(index:number):Prop {
        return null;
    }

    propAtName(propName:string):Prop {
        return null;
    }

    get propCount():number {
        return 0;
    }

    get propNames():Array<string> {
        return [];
    }

    get props():Array<Prop> {
        return [];
    }

    get propValues():Array<any> {
        return [];
    }

    get tipText():string {
        return null;
    }

    tipTextFor(propName:string):string {
        return null;
    }

    toEntityRec():EntityRec {
        return this;
    }

    toWSEditorRecord():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEditorRecord'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    }

    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEntityRec'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos) result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    }

    valueAtName(propName:string):any {
        return null;
    }

}
/**
 * *********************************
 */


export interface ActionSource {
    fromActionSource:ActionSource;
    virtualPathSuffix:Array<string>;
}
/**
 * *********************************
 */


enum AppContextState { LOGGED_OUT, LOGGED_IN }

class AppContextValues {
    constructor(public sessionContext:SessionContext,
                public appWinDef:AppWinDef,
                public tenantSettings:StringDictionary) {
    }
}

/**
 * Top-level entry point into the Catavolt API
 */
export class AppContext {

    private static _singleton:AppContext;

    private static ONE_DAY_IN_MILLIS:number = 60 * 60 * 24 * 1000;

    public lastMaintenanceTime:Date;
    private _appContextState:AppContextState;
    private _appWinDefTry:Try<AppWinDef>;
    private _deviceProps:Array<string>;
    private _sessionContextTry:Try<SessionContext>;
    private _tenantSettingsTry:Try<StringDictionary>;

    public static get defaultTTLInMillis():number {
        return AppContext.ONE_DAY_IN_MILLIS;
    }

    /**
     * Get the singleton instance of the AppContext
     * @returns {AppContext}
     */
    static get singleton():AppContext {
        if (!AppContext._singleton) {
            AppContext._singleton = new AppContext();
        }
        return AppContext._singleton;
    }

    /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    constructor() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }

    /**
     * Get the AppWinDef Try
     * @returns {Try<AppWinDef>}
     */
    get appWinDefTry():Try<AppWinDef> {
        return this._appWinDefTry;
    }

    /**
     * Get the device props
     * @returns {Array<string>}
     */
    get deviceProps():Array<string> {
        return this._deviceProps;
    }

    /**
     * Checked logged in status
     * @returns {boolean}
     */
    get isLoggedIn() {
        return this._appContextState === AppContextState.LOGGED_IN;
    }

    /**
     * Get a Worbench by workbenchId
     * @param sessionContext
     * @param workbenchId
     * @returns {Future<Workbench>}
     */
    getWorkbench(sessionContext:SessionContext, workbenchId:string):Future<Workbench> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture<Workbench>("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    }

    /**
     * Log in and retrieve the AppWinDef
     * @param gatewayHost
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */
    login(gatewayHost:string,
          tenantId:string,
          clientType:string,
          userId:string,
          password:string):Future<AppWinDef> {

        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture<AppWinDef>("AppContext::login", "User is already logged in");
        }

        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
            }
        );


    }

    /**
     * Login directly to a given url, bypassing the gateway host
     * @param url
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */
    loginDirectly(url:string,
                  tenantId:string,
                  clientType:string,
                  userId:string,
                  password:string):Future<AppWinDef> {

        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture<AppWinDef>("AppContext::loginDirectly", "User is already logged in");
        }

        return this.loginFromSystemContext(new SystemContextImpl(url), tenantId, userId,
            password, this.deviceProps, clientType).bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
            }
        );
    }

    /**
     * Logout and destroy the session
     * @returns {any}
     */
    logout():Future<VoidResult> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture<AppWinDef>("AppContext::loginDirectly", "User is already logged out");
        }
        var result:Future<VoidResult> = SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(deleteSessionTry => {
            if (deleteSessionTry.isFailure) {
                Log.error('Error while logging out: ' + ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    }


    /**
     * Open a {@link WorkbenchLaunchAction}
     * @param launchAction
     * @returns {any}
     */
    performLaunchAction(launchAction:WorkbenchLaunchAction):Future<NavRequest> {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    }

    /**
     * Refresh the AppContext
     * @param sessionContext
     * @param deviceProps
     * @returns {Future<AppWinDef>}
     */
    refreshContext(sessionContext:SessionContext, deviceProps:Array<string> = []):Future<AppWinDef> {
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind(
            (appContextValues:AppContextValues)=> {
                this.setAppContextStateToLoggedIn(appContextValues);
                return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
            }
        );
    }

    /**
     * Get the SessionContext Try
     * @returns {Try<SessionContext>}
     */
    get sessionContextTry():Try<SessionContext> {
        return this._sessionContextTry;
    }

    /**
     * Get the tenant settings Try
     * @returns {Try<StringDictionary>}
     */
    get tenantSettingsTry():Try<StringDictionary> {
        return this._tenantSettingsTry;
    }

    private finalizeContext(sessionContext:SessionContext, deviceProps:Array<string>):Future<AppContextValues> {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind(
            (setPropertyListResult:VoidResult)=> {
                var listPropName = "com.catavolt.session.property.TenantProperties";
                return SessionService.getSessionListProperty(listPropName, sessionContext).bind(
                    (listPropertyResult:XGetSessionListPropertyResult)=> {
                        return WorkbenchService.getAppWinDef(sessionContext).bind(
                            (appWinDef:AppWinDef)=> {
                                return Future.createSuccessfulFuture<AppContextValues>("AppContextCore:loginFromSystemContext",
                                    new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                            }
                        );
                    }
                );
            }
        );
    }

    private loginOnline(gatewayHost:string,
                        tenantId:string,
                        clientType:string,
                        userId:string,
                        password:string,
                        deviceProps:Array<string>):Future<AppContextValues> {

        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind(
            (sc:SystemContext)=> {
                return this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
            }
        );
    }

    private loginFromSystemContext(systemContext:SystemContext,
                                   tenantId:string,
                                   userId:string,
                                   password:string,
                                   deviceProps:Array<string>,
                                   clientType:string):Future<AppContextValues> {

        var sessionContextFuture = SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind(
            (sessionContext:SessionContext)=> {
                return this.finalizeContext(sessionContext, deviceProps);
            }
        );
    }

    private newSystemContextFr(gatewayHost:string, tenantId:string):Future<SystemContext> {
        var serviceEndpoint:Future<ServiceEndpoint> = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map(
            (serviceEndpoint:ServiceEndpoint)=> {
                return new SystemContextImpl(serviceEndpoint.serverAssignment);
            }
        );
    }

    private performLaunchActionOnline(launchAction:WorkbenchLaunchAction,
                                      sessionContext:SessionContext):Future<NavRequest> {

        var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind<NavRequest>((r:Redirection)=> {
            return NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    }

    private setAppContextStateToLoggedIn(appContextValues:AppContextValues) {
        this._appWinDefTry = new Success<AppWinDef>(appContextValues.appWinDef);
        this._tenantSettingsTry = new Success<StringDictionary>(appContextValues.tenantSettings);
        this._sessionContextTry = new Success<SessionContext>(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    }

    private setAppContextStateToLoggedOut() {
        this._appWinDefTry = new Failure<AppWinDef>("Not logged in");
        this._tenantSettingsTry = new Failure<StringDictionary>('Not logged in"');
        this._sessionContextTry = new Failure<SessionContext>('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    }

}
/**
 * *********************************
 */

/**
 * Represents a singlel 'Window' definition, retrieved upon login.
 * Workbenches can be obtained through this object.
 */
export class AppWinDef {

    private _workbenches:Array<Workbench>;
    private _applicationVendors:Array<string>;
    private _windowTitle:string;
    private _windowWidth:number;
    private _windowHeight:number;

    /**
     * Create a new AppWinDef
     *
     * @private
     *
     * @param workbenches
     * @param appVendors
     * @param windowTitle
     * @param windowWidth
     * @param windowHeight
     */
    constructor(workbenches:Array<Workbench>,
                appVendors:Array<string>,
                windowTitle:string,
                windowWidth:number,
                windowHeight:number) {

        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }

    /**
     * Get the app vendors array
     * @returns {Array<string>}
     */
    get appVendors():Array<string> {
        return this._applicationVendors;
    }

    /**
     * Get the window height
     * @returns {number}
     */
    get windowHeight():number {
        return this._windowHeight;
    }

    /**
     * Get the window title
     * @returns {string}
     */
    get windowTitle():string {
        return this._windowTitle;
    }

    /**
     * Get the window width
     * @returns {number}
     */
    get windowWidth():number {
        return this._windowWidth;
    }

    /**
     * Get the list of available Workbenches
     * @returns {Array<Workbench>}
     */
    get workbenches():Array<Workbench> {
        return this._workbenches;
    }

}

/**
 * *********************************
 */


export class CellDef {

    constructor(private _values:Array<CellValueDef>) {
    }

    get values():Array<CellValueDef> {
        return this._values;
    }

}

/**
 * *********************************
 */


export class CodeRef {

    static fromFormattedValue(value:string) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    }

    constructor(private _code:string, private _description:string) {
    }

    get code():string {
        return this._code;
    }

    get description():string {
        return this._description;
    }

    toString():string {
        return this.code + ":" + this.description;
    }

}
/**
 * *********************************
 */


export class ColumnDef {

    constructor(private _name:string, private _heading:string, private _propertyDef:PropDef) {
    }

    get heading():string {
        return this._heading;
    }

    get isInlineMediaStyle():boolean {
        return this._propertyDef.isInlineMediaStyle;
    }

    get name():string {
        return this._name;
    }

    get propertyDef():PropDef {
        return this._propertyDef;
    }

}
/**
 * *********************************
 */


export class ContextAction implements ActionSource {

    constructor(public actionId:string,
                public objectId:string,
                public fromActionSource:ActionSource) {
    }

    get virtualPathSuffix():Array<string> {
        return [this.objectId, this.actionId];
    }
}
/**
 * *********************************
 */


export class DataAnno {

    private static BOLD_TEXT = "BOLD_TEXT";
    private static BACKGROUND_COLOR = "BGND_COLOR";
    private static FOREGROUND_COLOR = "FGND_COLOR";
    private static IMAGE_NAME = "IMAGE_NAME";
    private static IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
    private static ITALIC_TEXT = "ITALIC_TEXT";
    private static OVERRIDE_TEXT = "OVRD_TEXT";
    private static TIP_TEXT = "TIP_TEXT";
    private static UNDERLINE = "UNDERLINE";
    private static TRUE_VALUE = "1";
    private static PLACEMENT_CENTER = "CENTER";
    private static PLACEMENT_LEFT = "LEFT";
    private static PLACEMENT_RIGHT = "RIGHT";
    private static PLACEMENT_UNDER = "UNDER";
    private static PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";

    static annotatePropsUsingWSDataAnnotation(props:Array<Prop>, jsonObj:StringDictionary):Try<Array<Prop>> {
        return DialogTriple.fromListOfWSDialogObject<Array<DataAnno>>(jsonObj, 'WSDataAnnotation', OType.factoryFn).bind(
            (propAnnos:Array<Array<DataAnno>>) => {
                var annotatedProps:Array<Prop> = [];
                for (var i = 0; i < props.length; i++) {
                    var p = props[i];
                    var annos:Array<DataAnno> = propAnnos[i];
                    if (annos) {
                        annotatedProps.push(new Prop(p.name, p.value, annos));
                    } else {
                        annotatedProps.push(p);
                    }
                }
                return new Success(annotatedProps);
            }
        );
    }

    static backgroundColor(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    }

    static foregroundColor(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    }

    static fromWS(otype:string, jsonObj):Try<Array<DataAnno>> {
        var stringObj = jsonObj['annotations'];
        if (stringObj['WS_LTYPE'] !== 'String') {
            return new Failure<Array<DataAnno>>('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
        }
        var annoStrings:Array<string> = stringObj['values'];
        var annos:Array<DataAnno> = [];
        for (var i = 0; i < annoStrings.length; i++) {
            annos.push(DataAnno.parseString(annoStrings[i]));
        }
        return new Success<Array<DataAnno>>(annos);
    }

    static imageName(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isImageName;
        });
        return result ? result.value : null;
    }

    static imagePlacement(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    }

    static isBoldText(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isBoldText
        });
    }

    static isItalicText(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isItalicText
        });
    }

    static isPlacementCenter(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isPlacementCenter
        });
    }

    static isPlacementLeft(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isPlacementLeft
        });
    }

    static isPlacementRight(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isPlacementRight
        });
    }

    static isPlacementStretchUnder(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isPlacementStretchUnder
        });
    }

    static isPlacementUnder(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isPlacementUnder
        });
    }

    static isUnderlineText(annos:Array<DataAnno>):boolean {
        return annos.some((anno)=> {
            return anno.isUnderlineText
        });
    }

    static overrideText(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    }

    static tipText(annos:Array<DataAnno>):string {
        var result:DataAnno = ArrayUtil.find(annos, (anno)=> {
            return anno.isTipText;
        });
        return result ? result.value : null;
    }


    static toListOfWSDataAnno(annos:Array<DataAnno>):StringDictionary {
        var result:StringDictionary = {'WS_LTYPE': 'WSDataAnno'};
        var values = [];
        annos.forEach((anno)=> {
            values.push(anno.toWS())
        });
        result['values'] = values;
        return result;
    }

    private static parseString(formatted:string):DataAnno {
        var pair = StringUtil.splitSimpleKeyValuePair(formatted);
        return new DataAnno(pair[0], pair[1]);
    }


    constructor(private _name:string, private _value:string) {
    }

    get backgroundColor():string {
        return this.isBackgroundColor ? this.value : null;
    }

    get foregroundColor():string {
        return this.isForegroundColor ? this.value : null;
    }

    equals(dataAnno:DataAnno):boolean {
        return this.name === dataAnno.name;
    }

    get isBackgroundColor():boolean {
        return this.name === DataAnno.BACKGROUND_COLOR;
    }

    get isBoldText():boolean {
        return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
    }

    get isForegroundColor():boolean {
        return this.name === DataAnno.FOREGROUND_COLOR;
    }

    get isImageName():boolean {
        return this.name === DataAnno.IMAGE_NAME;
    }

    get isImagePlacement():boolean {
        return this.name === DataAnno.IMAGE_PLACEMENT;
    }

    get isItalicText():boolean {
        return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
    }

    get isOverrideText():boolean {
        return this.name === DataAnno.OVERRIDE_TEXT;
    }

    get isPlacementCenter():boolean {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
    }

    get isPlacementLeft():boolean {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
    }

    get isPlacementRight():boolean {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
    }

    get isPlacementStretchUnder():boolean {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
    }

    get isPlacementUnder():boolean {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
    }

    get isTipText():boolean {
        return this.name === DataAnno.TIP_TEXT;
    }

    get isUnderlineText():boolean {
        return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
    }

    get name():string {
        return this._name;
    }

    get value():string {
        return this._value;
    }

    toWS():StringDictionary {
        return {'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value};
    }

}
/**
 * *********************************
 */

export class DialogException {

    constructor(public iconName?:string,
                public message?:string,
                public name?:string,
                public stackTrace?:string,
                public title?:string,
                public cause?:DialogException,
                public userMessages?:Array<UserMessage>) {
    }

}

export class UserMessage {

    constructor(public message:string,
                public  messageType:string,
                public explanation:string,
                public propertyNames:Array<string>) {
    }
}

/**
 * *********************************
 */


export class DialogHandle {

    constructor(public handleValue:number, public sessionHandle:string) {
    }

}
/**
 * *********************************
 */

/**
 * @private
 */
export class DialogService {

    private static EDITOR_SERVICE_NAME:string = 'EditorService';
    private static EDITOR_SERVICE_PATH:string = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
    private static QUERY_SERVICE_NAME:string = 'QueryService';
    private static QUERY_SERVICE_PATH:string = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;

    static changePaneMode(dialogHandle:DialogHandle, paneMode:PaneMode,
                          sessionContext:SessionContext):Future<XChangePaneModeResult> {
        var method = 'changePaneMode';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': PaneMode[paneMode]
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('changePaneMode',
                DialogTriple.fromWSDialogObject<XChangePaneModeResult>(result, 'WSChangePaneModeResult', OType.factoryFn)
            );
        });
    }

    static closeEditorModel(dialogHandle:DialogHandle, sessionContext:SessionContext):Future<VoidResult> {

        var method = 'close';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createSuccessfulFuture<VoidResult>('closeEditorModel', result);
        });
    }

    static getAvailableValues(dialogHandle:DialogHandle, propertyName:string, pendingWrites:EntityRec,
                              sessionContext:SessionContext):Future<XGetAvailableValuesResult> {

        var method = 'getAvailableValues';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('getAvailableValues',
                DialogTriple.fromWSDialogObject<XGetAvailableValuesResult>(result, 'WSGetAvailableValuesResult',
                    OType.factoryFn));
        });
    }

    static getActiveColumnDefs(dialogHandle:DialogHandle,
                               sessionContext:SessionContext):Future<XGetActiveColumnDefsResult> {

        var method = 'getActiveColumnDefs';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('getActiveColumnDefs',
                DialogTriple.fromWSDialogObject<XGetActiveColumnDefsResult>(result, 'WSGetActiveColumnDefsResult',
                    OType.factoryFn));
        });
    }

    static getEditorModelMenuDefs(dialogHandle:DialogHandle,
                                  sessionContext:SessionContext):Future<Array<MenuDef>> {

        var method = 'getMenuDefs';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('getEditorModelMenuDefs',
                DialogTriple.fromWSDialogObjectsResult<MenuDef>(result, 'WSGetMenuDefsResult', 'WSMenuDef',
                    'menuDefs', OType.factoryFn));
        });
    }

    static getEditorModelPaneDef(dialogHandle:DialogHandle,
                                 paneId:string,
                                 sessionContext:SessionContext):Future<XPaneDef> {

        var method = 'getPaneDef';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        params['paneId'] = paneId;
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind<XPaneDef>((result:StringDictionary)=> {
            return Future.createCompletedFuture<XPaneDef>('getEditorModelPaneDef',
                DialogTriple.fromWSDialogObjectResult<XPaneDef>(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType.factoryFn));
        });
    }

    static getQueryModelMenuDefs(dialogHandle:DialogHandle,
                                 sessionContext:SessionContext):Future<Array<MenuDef>> {
        var method = 'getMenuDefs';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('getQueryModelMenuDefs',
                DialogTriple.fromWSDialogObjectsResult<MenuDef>(result, 'WSGetMenuDefsResult', 'WSMenuDef',
                    'menuDefs', OType.factoryFn));
        });
    }

    static openEditorModelFromRedir(redirection:DialogRedirection,
                                    sessionContext:SessionContext):Future<XOpenEditorModelResult> {

        var method = 'open2';
        var params:StringDictionary = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId) params['objectId'] = redirection.objectId;

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('openEditorModelFromRedir',
                DialogTriple.fromWSDialogObject<XOpenEditorModelResult>(result, 'WSOpenEditorModelResult', OType.factoryFn));
        });

    }

    static openQueryModelFromRedir(redirection:DialogRedirection,
                                   sessionContext:SessionContext):Future<XOpenQueryModelResult> {

        if (!redirection.isQuery) return Future.createFailedFuture<XOpenQueryModelResult>('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')};

        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('openQueryModelFromRedir',
                DialogTriple.fromWSDialogObject<XOpenQueryModelResult>(result, 'WSOpenQueryModelResult', OType.factoryFn));
        });

    }

    static performEditorAction(dialogHandle:DialogHandle, actionId:string,
                               pendingWrites:EntityRec, sessionContext:SessionContext):Future<Redirection> {

        var method = 'performAction';
        var params:StringDictionary = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites) params['pendingWrites'] = pendingWrites.toWSEditorRecord();

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    }

    static performQueryAction(dialogHandle:DialogHandle, actionId:string, targets:Array<string>,
                              sessionContext:SessionContext):Future<Redirection> {

        var method = 'performAction';
        var params:StringDictionary = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    }

    static processSideEffects(dialogHandle:DialogHandle, sessionContext:SessionContext,
                              propertyName:string, propertyValue:any, pendingWrites:EntityRec):Future<XPropertyChangeResult> {

        var method = 'handlePropertyChange';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture<XPropertyChangeResult>('processSideEffects', DialogTriple.fromWSDialogObject<XPropertyChangeResult>(result,
                'WSHandlePropertyChangeResult', OType.factoryFn));
        });
    }

    static queryQueryModel(dialogHandle:DialogHandle,
                           direction:QueryDirection,
                           maxRows:number,
                           fromObjectId:string,
                           sessionContext:SessionContext):Future<XQueryResult> {

        var method = 'query';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }

        Log.info('Running query');
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return Future.createCompletedFuture('DialogService::queryQueryModel',
                DialogTriple.fromWSDialogObject<XQueryResult>(result, 'WSQueryResult', OType.factoryFn));
        });

    }

    static readEditorModel(dialogHandle:DialogHandle, sessionContext:SessionContext):Future<XReadResult> {

        var method = 'read';
        var params:StringDictionary = {'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')};
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind<XReadResult>((result:StringDictionary)=> {
            return Future.createCompletedFuture('readEditorModel',
                DialogTriple.fromWSDialogObject<XReadResult>(result, 'WSReadResult', OType.factoryFn));
        });
    }

    static readEditorProperty(dialogHandle:DialogHandle, propertyName:string, readSeq:number, readLength:number,
                              sessionContext:SessionContext):Future<XReadPropertyResult> {
        var method = 'readProperty';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'readSeq': readSeq,
            'readLength': readLength
        };

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('readProperty',
                DialogTriple.fromWSDialogObject<XReadPropertyResult>(result, 'WSReadPropertyResult', OType.factoryFn));
        });
    }

    static readQueryProperty(dialogHandle:DialogHandle, propertyName:string, objectId:string, readSeq:number, readLength:number,
                             sessionContext:SessionContext):Future<XReadPropertyResult> {
        var method = 'readProperty';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'objectId': objectId,
            'readSeq': readSeq,
            'readLength': readLength
        };

        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('readProperty',
                DialogTriple.fromWSDialogObject<XReadPropertyResult>(result, 'WSReadPropertyResult', OType.factoryFn));
        });
    }

    static writeEditorModel(dialogHandle:DialogHandle, entityRec:EntityRec,
                            sessionContext:SessionContext):Future<Either<Redirection,XWriteResult>> {
        var method = 'write';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            var writeResultTry:Try<Either<Redirection,XWriteResult>> =
                DialogTriple.extractTriple(result, 'WSWriteResult', ()=> {
                    return OType.deserializeObject<XWriteResult>(result, 'XWriteResult', OType.factoryFn);
                });
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new Success(Either.left<Redirection, XWriteResult>(redirection));
            }
            return Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    }

    static writeProperty(dialogHandle:DialogHandle, propertyName:string, data:string, append:boolean,
                         sessionContext:SessionContext):Future<XWritePropertyResult> {
        var method = 'writeProperty';
        var params:StringDictionary = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'data': data,
            'append': append
        };

        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result:StringDictionary)=> {
            return Future.createCompletedFuture('writeProperty',
                DialogTriple.fromWSDialogObject<XWritePropertyResult>(result, 'WSWritePropertyResult', OType.factoryFn));
        });
    }
}
/**
 * *********************************
 */


/**
 * @private
 */
export class DialogTriple {

    static extractList<A>(jsonObject:StringDictionary, Ltype:string, extractor:MapFn<any,Try<A>>) {
        var result:Try<Array<A>>;
        if (jsonObject) {
            var lt = jsonObject['WS_LTYPE'];
            if (Ltype === lt) {
                if (jsonObject['values']) {
                    var realValues:Array<A> = [];
                    var values:Array<any> = jsonObject['values'];
                    values.every((item)=> {
                        var extdValue:Try<A> = extractor(item);
                        if (extdValue.isFailure) {
                            result = new Failure<Array<A>>(extdValue.failure);
                            return false;
                        }
                        realValues.push(extdValue.success);
                        return true;
                    });
                    if (!result) {
                        result = new Success<Array<A>>(realValues);
                    }
                } else {
                    result = new Failure<Array<A>>("DialogTriple::extractList: Values array not found");
                }
            } else {
                result = new Failure<Array<A>>("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
            }
        }
        return result;
    }

    static extractRedirection(jsonObject:StringDictionary, Otype:string):Try<Redirection> {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false,
            ()=> {
                return new Success(new NullRedirection({}));
            }
        );
        var answer:Try<Redirection>;
        if (tripleTry.isSuccess) {
            var triple = tripleTry.success;
            answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
        } else {
            answer = new Failure<Redirection>(tripleTry.failure);
        }
        return answer;
    }

    static extractTriple<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<Either<Redirection,A>> {
        return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
    }

    static extractValue<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
        return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
    }

    static extractValueIgnoringRedirection<A>(jsonObject:StringDictionary, Otype:string, extractor:TryClosure<A>):Try<A> {
        return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
    }

    static fromWSDialogObject<A>(obj, Otype:string, factoryFn?:(otype:string, jsonObj?)=>any,
                                 ignoreRedirection:boolean = false):Try<A> {

        if (!obj) {
            return new Failure<A>('DialogTriple::fromWSDialogObject: Cannot extract from null value')
        } else if (typeof obj !== 'object') {
            return new Success<A>(obj);
        }

        try {
            if (!factoryFn) {
                /* Assume we're just going to coerce the exiting object */
                return DialogTriple.extractValue(obj, Otype, ()=> {
                    return new Success<A>(obj);
                });
            } else {
                if (ignoreRedirection) {
                    return DialogTriple.extractValueIgnoringRedirection<A>(obj, Otype, ()=> {
                        return OType.deserializeObject<A>(obj, Otype, factoryFn);
                    });
                } else {
                    return DialogTriple.extractValue<A>(obj, Otype, ()=> {
                        return OType.deserializeObject<A>(obj, Otype, factoryFn);
                    });
                }
            }
        } catch (e) {
            return new Failure<A>('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
        }
    }

    static fromListOfWSDialogObject<A>(jsonObject:StringDictionary, Ltype:string,
                                       factoryFn?:(otype:string, jsonObj?)=>any,
                                       ignoreRedirection:boolean = false):Try<Array<A>> {
        return DialogTriple.extractList(jsonObject, Ltype,
            (value)=> {
                /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
                 i.e. list items should be lype assignment compatible*/
                if (!value) return new Success(null);
                var Otype = value['WS_OTYPE'] || Ltype;
                return DialogTriple.fromWSDialogObject<A>(value, Otype, factoryFn, ignoreRedirection);
            }
        );
    }

    static fromWSDialogObjectResult<A>(jsonObject:StringDictionary,
                                       resultOtype:string,
                                       targetOtype:string,
                                       objPropName:string,
                                       factoryFn?:(otype:string, jsonObj?)=>any):Try<A> {

        return DialogTriple.extractValue(jsonObject, resultOtype,
            ()=> {
                return DialogTriple.fromWSDialogObject<A>(jsonObject[objPropName], targetOtype, factoryFn);
            }
        );
    }

    static fromWSDialogObjectsResult<A>(jsonObject:StringDictionary,
                                        resultOtype:string,
                                        targetLtype:string,
                                        objPropName:string,
                                        factoryFn?:(otype:string, jsonObj?)=>any):Try<Array<A>> {

        return DialogTriple.extractValue(jsonObject, resultOtype,
            ()=> {
                return DialogTriple.fromListOfWSDialogObject<A>(jsonObject[objPropName], targetLtype, factoryFn);
            }
        );
    }

    private static _extractTriple<A>(jsonObject,
                                     Otype:string,
                                     ignoreRedirection:boolean,
                                     extractor:TryClosure<A>):Try<Either<Redirection,A>> {

        if (!jsonObject) {
            return new Failure<Either<Redirection,A>>('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
        } else {
            if (Array.isArray(jsonObject)) {
                //verify we're dealing with a nested List
                if (Otype.indexOf('List') !== 0) {
                    return new Failure<Either<Redirection, A>>("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                }
            } else {
                var ot:string = jsonObject['WS_OTYPE'];
                if (!ot || Otype !== ot) {
                    return new Failure<Either<Redirection,A>>('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                } else {
                    if (jsonObject['exception']) {
                        var dialogExceptionTry:Try<DialogException> = OType.deserializeObject<DialogException>(jsonObject['exception'], 'WSException', OType.factoryFn);
                        if (dialogExceptionTry.isFailure) {
                            Log.error('Failed to deserialize exception obj: ' + ObjUtil.formatRecAttr(jsonObject['exception']));
                            return new Failure<Either<Redirection,A>>(jsonObject['exception']);
                        } else {
                            return new Failure<Either<Redirection,A>>(dialogExceptionTry.success);
                        }
                    } else if (jsonObject['redirection'] && !ignoreRedirection) {
                        var drt:Try<Redirection> = DialogTriple.fromWSDialogObject<Redirection>(jsonObject['redirection'],
                            'WSRedirection', OType.factoryFn);
                        if (drt.isFailure) {
                            return new Failure<Either<Redirection,A>>(drt.failure);
                        } else {
                            const either:Either<Redirection,A> = Either.left<Redirection, A>(drt.success);
                            return new Success<Either<Redirection,A>>(either);
                        }
                    }
                }
            }

            var result:Try<Either<Redirection,A>>;
            if (extractor) {
                var valueTry:Try<A> = extractor();
                if (valueTry.isFailure) {
                    result = new Failure<Either<Redirection,A>>(valueTry.failure);
                } else {
                    result = new Success(Either.right<Redirection, A>(valueTry.success));
                }
            } else {
                result = new Failure<Either<Redirection,A>>('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
            }
            return result;
        }
    }


    private static _extractValue<A>(jsonObject,
                                    Otype:string,
                                    ignoreRedirection:boolean,
                                    extractor:TryClosure<A>):Try<A> {

        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
        var result:Try<A>;
        if (tripleTry.isFailure) {
            result = new Failure<A>(tripleTry.failure);
        } else {
            var triple:Either<Redirection,A> = tripleTry.success;
            if (triple.isLeft) {
                result = new Failure<A>('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
            } else {
                result = new Success<A>(triple.right);
            }
        }
        return result;

    }


}
/**
 * *********************************
 */


enum EditorState{ READ, WRITE, DESTROYED }
;


/**
 * In the same way that a {@link PropDef} describes a {@link Prop}, an EntityRecDef describes an {@link EntityRec}.
 * It is composed of {@link PropDef}s while the {@link EntityRec} is composed of {@link Prop}s.
 * In other words it describes the structure or makeup of a row or record, but does not contain the data values themselves.
 * The corresponding {@link EntityRec} contains the actual values.
  */
export class EntityRecDef {

    constructor(private _propDefs:Array<PropDef>) {
    }

    get propCount():number {
        return this.propDefs.length;
    }

    propDefAtName(name:string):PropDef {
        var propDef:PropDef = null;
        this.propDefs.some((p)=> {
            if (p.name === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    }

    // Note we need to support both 'propDefs' and 'propertyDefs' as both
    // field names seem to be used in the dialog model
    get propDefs():Array<PropDef> {
        return this._propDefs;
    }

    set propDefs(propDefs:Array<PropDef>) {
        this._propDefs = propDefs;
    }

    get propertyDefs():Array<PropDef> {
        return this._propDefs;
    }

    set propertyDefs(propDefs:Array<PropDef>) {
        this._propDefs = propDefs;
    }

    get propNames():Array<string> {
        return this.propDefs.map((p)=> {
            return p.name
        });
    }

}

/**
 * Utility to construct a FormContext hierarchy from a {@link DialogRedirection}.
 */
export class FormContextBuilder {

    private _dialogRedirection:DialogRedirection;
    private _actionSource:ActionSource;
    private _sessionContext:SessionContext;
    private _initialFormXOpenFr:Future<XOpenEditorModelResult>;
    private _initialXFormDefFr:Future<XFormDef>;

    public static createWithRedirection(dialogRedirection:DialogRedirection,
                                        actionSource:ActionSource,
                                        sessionContext:SessionContext):FormContextBuilder {
        const fb = new FormContextBuilder();
        fb._dialogRedirection = dialogRedirection;
        fb._actionSource = actionSource;
        fb._sessionContext = sessionContext;
        return fb;
    }

    public static createWithInitialForm(initialFormXOpenFr:Future<XOpenEditorModelResult>,
                                        initialXFormDefFr:Future<XFormDef>,
                                        dialogRedirection:DialogRedirection,
                                        actionSource:ActionSource,
                                        sessionContext:SessionContext):FormContextBuilder {
        const fb = new FormContextBuilder();
        fb._initialFormXOpenFr = initialFormXOpenFr;
        fb._initialXFormDefFr = initialXFormDefFr;
        fb._dialogRedirection = dialogRedirection;
        fb._actionSource = actionSource;
        fb._sessionContext = sessionContext;
        return fb;
    }


    constructor() {
    }

    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    get actionSource():ActionSource {
        return this._actionSource;
    }

    build():Future<FormContext> {

        if (this.dialogRedirection && !this.dialogRedirection.isEditor) {
            return Future.createFailedFuture<FormContext>('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }

        var xOpenFr = this._initialFormXOpenFr ? this._initialFormXOpenFr :
            DialogService.openEditorModelFromRedir(this.dialogRedirection, this.sessionContext);
        var openAllFr:Future<Array<Try<any>>> = xOpenFr.bind((formXOpen:XOpenEditorModelResult)=> {
            var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = this._initialXFormDefFr ? this._initialXFormDefFr : this.fetchXFormDefWithXOpenResult(formXOpen);
            var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
            //expect a sequence of child def components or a sequence of FormContexts (nested forms)
            var formChildrenFr:Future<Array<Try<any>>> = formXFormDefFr.bind((xFormDef:XFormDef)=> {
                if (!this.containsNestedForms(formXOpen, xFormDef)) {
                    var childrenXOpenFr = this.openChildren(formXOpen);
                    var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                    var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                    var childrenMenuDefsFr = this.fetchChildrenMenuDefs(formXOpen);
                    return Future.sequence<any>([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
                } else {
                    //added to support nested forms
                    return Future.sequence<any>(this.loadNestedForms(formXOpen, xFormDef));
                }
            });
            return Future.sequence<any>([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });

        return openAllFr.bind((value:Array<Try<any>>)=> {

            var flattenedTry:Try<Array<any>> = this.getFlattenedResults(value);
            if (flattenedTry.failure) {
                return Future.createCompletedFuture<FormContext>('FormContextBuilder::build', new Failure<FormContext>(flattenedTry.failure));
            }

            var formDefTry = this.completeOpenPromise(flattenedTry.success);
            //check for nested form contexts and set the paneRefs
            var formContexts:Array<PaneContext> = this.retrieveChildFormContexts(flattenedTry.success)
                .map((formContext:FormContext, n:number)=> {
                    formContext.paneRef = n;
                    return formContext;
                });

            var formContextTry:Try<FormContext> = null;
            if (formDefTry.isFailure) {
                formContextTry = new Failure<FormContext>(formDefTry.failure);
            } else {
                var formDef:FormDef = formDefTry.success;
                //if this is a nested form, use the child form contexts, otherwise, create new children
                var childContexts = (formContexts && formContexts.length > 0) ? formContexts : this.createChildrenContexts(formDef);
                var formContext = new FormContext(this.dialogRedirection,
                    this._actionSource, formDef, childContexts, false, false, this.sessionContext);
                formContextTry = new Success(formContext);
            }
            return Future.createCompletedFuture<FormContext>('FormContextBuilder::build', formContextTry);
        });

    }

    /**
     * Get the {@link DialogRedirection} with which this Form was constructed
     * @returns {DialogRedirection}
     */
    get dialogRedirection():DialogRedirection {
        return this._dialogRedirection;
    }

    get sessionContext():SessionContext {
        return this._sessionContext;
    }

    //added to support nested forms
    private buildFormModelForNestedForm(topFormXOpen:XOpenEditorModelResult,
                                        formModelComp:XFormModelComp,
                                        childFormModelComps:Array<XFormModelComp>):XFormModel {
        const formModel = new XFormModel(formModelComp, topFormXOpen.formModel.header, childFormModelComps,
            topFormXOpen.formModel.placement, topFormXOpen.formModel.refreshTimer, topFormXOpen.formModel.sizeToWindow);
        return formModel;
    }

    private completeOpenPromise(flattened:Array<any>):Try<FormDef> {

        if (flattened.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 4 elements');

        var formXOpen:XOpenEditorModelResult = flattened[0];
        var formXFormDef:XFormDef = flattened[1];
        var formMenuDefs:Array<MenuDef> = flattened[2];
        var formChildren:Array<any> = flattened[3];

        if (formChildren.length === 0) return new Failure<FormDef>('FormContextBuilder::build: Form has no children');

        if (formChildren[0] instanceof FormContext) {
            //we're dealing with a nested form
            const childPaneDefs:Array<PaneDef> = formChildren.map((formContext:FormContext)=> {
                return formContext.formDef
            });
            var settings:StringDictionary = {'open': true};
            ObjUtil.addAllProps(formXOpen.formRedirection.dialogProperties, settings);
            var headerDef:DetailsDef = null;

            return new Success(new FormDef(formXOpen.formPaneId, formXFormDef.name, formXOpen.formModel.form.label, formXFormDef.title,
                formMenuDefs, formXOpen.entityRecDef, formXOpen.formRedirection, settings, formXFormDef.formLayout,
                formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childPaneDefs));
        } else {
            //build the form with child components
            if (formChildren.length != 4) return new Failure<FormDef>('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');

            var childrenXOpens:Array<XOpenDialogModelResult> = formChildren[0];
            var childrenXPaneDefs:Array<XPaneDef> = formChildren[1];
            var childrenXActiveColDefs:Array<XGetActiveColumnDefsResult> = formChildren[2];
            var childrenMenuDefs:Array<Array<MenuDef>> = formChildren[3];

            return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens,
                childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
        }

    }

    private containsNestedForms(formXOpen:XOpenEditorModelResult, xFormDef:XFormDef):boolean {
        return xFormDef.paneDefRefs.some((paneDefRef:XPaneDefRef)=> {
            return paneDefRef.type === XPaneDefRef.FORM_TYPE
        });
    }

    private createChildrenContexts(formDef:FormDef):Array<PaneContext> {
        var result:Array<PaneContext> = [];
        formDef.childrenDefs.forEach((paneDef:PaneDef, i)=> {
            if (paneDef instanceof ListDef) {
                result.push(new ListContext(i));
            } else if (paneDef instanceof DetailsDef) {
                result.push(new DetailsContext(i));
            } else if (paneDef instanceof MapDef) {
                result.push(new MapContext(i));
            } else if (paneDef instanceof GraphDef) {
                result.push(new GraphContext(i));
            } else if (paneDef instanceof CalendarDef) {
                result.push(new CalendarContext(i));
            } else if (paneDef instanceof ImagePickerDef) {
                result.push(new ImagePickerContext(i));
            } else if (paneDef instanceof BarcodeScanDef) {
                result.push(new BarcodeScanContext(i));
            } else if (paneDef instanceof GeoFixDef) {
                result.push(new GeoFixContext(i));
            } else if (paneDef instanceof GeoLocationDef) {
                result.push(new GeoLocationContext(i));
            }
        });
        return result;
    }

    private fetchChildrenActiveColDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<XGetActiveColumnDefsResult>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures:Array<Future<XGetActiveColumnDefsResult>> = xComps.map((xComp:XFormModelComp)=> {
            if (xComp.redirection.isQuery) {
                return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, this.sessionContext);
            } else {
                return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchChildrenMenuDefs(formXOpen:XOpenEditorModelResult):Future<Array<Try<Array<MenuDef>>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp:XFormModelComp)=> {
            if (xComp.redirection.isEditor) {
                return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            } else {
                return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchChildrenXPaneDefs(formXOpen:XOpenEditorModelResult, xFormDef:XFormDef):Future<Array<Try<XPaneDef>>> {

        var formHandle:DialogHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures:Array<Future<XPaneDef>> = xRefs.map((xRef:XPaneDefRef)=> {
            return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, this.sessionContext);
        });
        return Future.sequence(seqOfFutures);
    }

    private fetchXFormDefWithXOpenResult(xformOpenResult:XOpenEditorModelResult):Future<XFormDef> {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return this.fetchXFormDef(dialogHandle, formPaneId);
    }

    private fetchXFormDef(dialogHandle:DialogHandle, formPaneId:string):Future<XFormDef> {
        return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId,
            this.sessionContext).bind((value:XPaneDef)=> {
            if (value instanceof XFormDef) {
                return Future.createSuccessfulFuture('fetchXFormDef/success', value);
            } else {
                return Future.createFailedFuture<XFormDef>('fetchXFormDef/failure',
                    'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
            }
        });
    }

    private getFlattenedResults(openAllResults:Array<Try<any>>):Try<Array<any>> {

        var flattenedTry:Try<Array<any>> = Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new Failure<Array<any>>('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        return flattenedTry;
    }

    private loadNestedForms(formXOpen:XOpenEditorModelResult, xFormDef:XFormDef):Array<Future<FormContext>> {

        const seqOfFutures:Array<Future<FormContext>> = xFormDef.paneDefRefs.filter((paneDefRef:XPaneDefRef)=> {
            return paneDefRef.type === XPaneDefRef.FORM_TYPE;
        }).map((paneDefRef:XPaneDefRef)=> {
            //find the child 'formComp' (from the XOpenEditorModelResult) for each 'child pane' in the formDef (from the XFormDef)
            const xChildFormCompForPaneDefRef = ArrayUtil.find(formXOpen.formModel.children, (xChildComp:XFormModelComp)=> {
                return xChildComp.paneId === paneDefRef.paneId;
            });
            //fetch the form def, for the child form
            return this.fetchXFormDef(xChildFormCompForPaneDefRef.redirection.dialogHandle, xChildFormCompForPaneDefRef.paneId)
                .bind((childXFormDef:XFormDef)=> {
                    //fetch child form's children (child comps)
                    const childFormModelComps = childXFormDef.paneDefRefs.map((childPaneDefRef:XPaneDefRef)=> {
                        return ArrayUtil.find(formXOpen.formModel.children, (xChildComp:XFormModelComp)=> {
                            return xChildComp.paneId === childPaneDefRef.paneId;
                        });
                    });
                    const xFormModel:XFormModel = this.buildFormModelForNestedForm(formXOpen, xChildFormCompForPaneDefRef, childFormModelComps);
                    const xOpenEditorModelResult:XOpenEditorModelResult = new XOpenEditorModelResult(formXOpen.editorRecordDef, xFormModel);
                    const formContextFr:Future<FormContext> = FormContextBuilder.createWithInitialForm(
                        Future.createSuccessfulFuture('FormContextBuilder::loadNestedForms', xOpenEditorModelResult),
                        Future.createSuccessfulFuture('FormContextBuilder::loadNestedForms', childXFormDef),
                        xChildFormCompForPaneDefRef.redirection,
                        this.actionSource,
                        this.sessionContext
                    ).build();
                    return formContextFr;
                });
        });

        return seqOfFutures;
    }

    private openChildren(formXOpen:XOpenEditorModelResult):Future<Array<Try<XOpenDialogModelResult>>> {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures:Array<Future<XOpenDialogModelResult>> = [];
        xComps.forEach((nextXComp:XFormModelComp)=> {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, this.sessionContext);
            } else {
                nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return Future.sequence<XOpenDialogModelResult>(seqOfFutures);
    }

    private retrieveChildFormContexts(flattened:Array<any>):Array<FormContext> {
        let formContexts = [];
        if (flattened.length > 3) {
            var formChildren:Array<any> = flattened[3];
            if (formChildren && formChildren.length > 0) {
                if (formChildren[0] instanceof FormContext) {
                    formContexts = formChildren;
                }
            }
        }
        return formContexts;
    }


}
/**
 * *********************************
 */


/**
 * @private
 */
export class GatewayService {

    static getServiceEndpoint(tenantId:string,
                              serviceName:string,
                              gatewayHost:string):Future<ServiceEndpoint> {

        var f:Future<StringDictionary> = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
        var endPointFuture:Future<ServiceEndpoint> = f.bind(
            (jsonObject:StringDictionary)=> {
                //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
                return Future.createSuccessfulFuture<ServiceEndpoint>("serviceEndpoint", <any>jsonObject);
            }
        );

        return endPointFuture;
    }
}
/**
 * *********************************
 */


export class GeoFix {

    static fromFormattedValue(value:string):GeoFix {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    }

    constructor(private _latitude:number,
                private _longitude:number,
                private _source:string,
                private _accuracy:number) {
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }

    get source():string {
        return this._source;
    }

    get accuracy():number {
        return this._accuracy
    }

    toString():string {
        return this.latitude + ":" + this.longitude;
    }

}
/**
 * *********************************
 */


export class GeoLocation {

    static fromFormattedValue(value:string):GeoLocation {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    }

    constructor(private _latitude:number,
                private _longitude:number) {
    }

    get latitude():number {
        return this._latitude;
    }

    get longitude():number {
        return this._longitude;
    }

    toString():string {
        return this.latitude + ":" + this.longitude;
    }

}
/**
 * *********************************
 */


export class GraphDataPointDef {

    constructor(public name:string,
                public type:string,
                public plotType:string,
                public legendKey:string,
                public bubbleRadiusName:string,
                public bubbleRadiusType:string,
                public seriesColor:string,
                public xAxisName:string,
                public xAxisType:string) {
    }

}
/**
 * *********************************
 */


export class MenuDef {

    static findSubMenuDef(md:MenuDef, matcher:(menuDef:MenuDef)=>boolean):MenuDef {
        if (matcher(md)) return md;
        if (md.menuDefs) {
            for (let i = 0; i < md.menuDefs.length; i++) {
                let result = MenuDef.findSubMenuDef(md.menuDefs[i], matcher);
                if (result) return result;
            }
        }
        return null;
    }

    constructor(private _name:string,
                private _type:string,
                private _actionId:string,
                private _mode:string,
                private _label:string,
                private _iconName:string,
                private _directive:string,
                private _menuDefs:Array<MenuDef>) {
    }


    get actionId():string {
        return this._actionId;
    }

    get directive():string {
        return this._directive;
    }

    findAtId(actionId:string):MenuDef {
        if (this.actionId === actionId) return this;
        var result = null;
        if (this.menuDefs) {
            this.menuDefs.some((md:MenuDef)=> {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    }

    findContextMenuDef():MenuDef {
        return MenuDef.findSubMenuDef(this, (md:MenuDef) => {
            return md.name === 'CONTEXT_MENU';
        });
    }

    get iconName():string {
        return this._iconName;
    }

    get isPresaveDirective():boolean {
        return this._directive && this._directive === 'PRESAVE';
    }

    get isRead():boolean {
        return this._mode && this._mode.indexOf('R') > -1;
    }

    get isSeparator():boolean {
        return this._type && this._type === 'separator';
    }

    get isWrite():boolean {
        return this._mode && this._mode.indexOf('W') > -1;
    }

    get label():string {
        return this._label;
    }

    /**
     * Get the child {@link MenuDef}'s
     * @returns {Array<MenuDef>}
     */
    get menuDefs():Array<MenuDef> {
        return this._menuDefs;
    }

    get mode():string {
        return this._mode;
    }

    get name():string {
        return this._name;
    }

    get type():string {
        return this._type;
    }
}
/**
 * *********************************
 */


export interface NavRequest {
}

export class NavRequestUtil {

    static fromRedirection(redirection:Redirection,
                           actionSource:ActionSource,
                           sessionContext:SessionContext):Future<NavRequest> {

        var result:Future<NavRequest>;
        if (redirection instanceof WebRedirection) {
            result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        } else if (redirection instanceof WorkbenchRedirection) {
            var wbr:WorkbenchRedirection = redirection;
            result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map((wb:Workbench)=> {
                return wb;
            });
        } else if (redirection instanceof DialogRedirection) {
            var dr:DialogRedirection = redirection;
            var fcb:FormContextBuilder = FormContextBuilder.createWithRedirection(dr, actionSource, sessionContext);
            result = fcb.build();
        } else if (redirection instanceof NullRedirection) {
            var nullRedir:NullRedirection = redirection;
            var nullNavRequest:NullNavRequest = new NullNavRequest();
            ObjUtil.addAllProps(nullRedir.fromDialogProperties,
                nullNavRequest.fromDialogProperties);
            result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        } else {
            result = Future.createFailedFuture('NavRequest::fromRedirection',
                'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
        }
        return result;

    }

}
/**
 * *********************************
 */


export class NullNavRequest implements NavRequest {

    fromDialogProperties:StringDictionary;

    constructor() {
        this.fromDialogProperties = {};
    }
}
/**
 * *********************************
 */


export class ObjectRef {

    static fromFormattedValue(value:string):ObjectRef {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    }

    constructor(private _objectId:string, private _description:string) {
    }

    get description():string {
        return this._description;
    }

    get objectId():string {
        return this._objectId;
    }

    toString():string {
        return this.objectId + ":" + this.description;
    }

}
/**
 * *********************************
 */


export enum PaneMode {
    READ, WRITE
}

/**
 * Contains information that 'defines' a property {@link Prop} (name/value)
 * The information describes the property and can be thought of as the property 'type.
 * An instance of the {@link Prop} contains the actual data value.
 */
export class PropDef {

    static STYLE_INLINE_MEDIA = "inlineMedia";
    static STYLE_INLINE_MEDIA2 = "Image/Video";

    constructor(private _name:string,
                private _type:string,
                private _elementType:string,
                private _style:string,
                private _propertyLength:number,
                private _propertyScale:number,
                private _presLength:number,
                private _presScale:number,
                private _dataDictionaryKey:string,
                private _maintainable:boolean,
                private _writeEnabled:boolean,
                private _canCauseSideEffects:boolean) {
    }

    /**
     * Gets whether or not a refresh is needed after a change in this property's value
     * @returns {boolean}
     */
    get canCauseSideEffects():boolean {
        return this._canCauseSideEffects;
    }

    get dataDictionaryKey():string {
        return this._dataDictionaryKey;
    }

    get elementType():string {
        return this._elementType;
    }

    get isBarcodeType():boolean {
        return this.type &&
            this.type === 'STRING' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_BARCODE';
    }

    get isBinaryType():boolean {
        return this.isLargeBinaryType;
    }

    get isBooleanType():boolean {
        return this.type && this.type === 'BOOLEAN';
    }

    get isCodeRefType():boolean {
        return this.type && this.type === 'CODE_REF';
    }

    get isDateType():boolean {
        return this.type && this.type === 'DATE';
    }

    get isDateTimeType():boolean {
        return this.type && this.type === 'DATE_TIME';
    }

    get isDecimalType():boolean {
        return this.type && this.type === 'DECIMAL';
    }

    get isDoubleType():boolean {
        return this.type && this.type === 'DOUBLE';
    }

    get isEmailType():boolean {
        return this.type && this.type === 'DATA_EMAIL';
    }

    get isGeoFixType():boolean {
        return this.type && this.type === 'GEO_FIX';
    }

    get isGeoLocationType():boolean {
        return this.type && this.type === 'GEO_LOCATION';
    }

    get isHTMLType():boolean {
        return this.type && this.type === 'DATA_HTML';
    }

    get isListType():boolean {
        return this.type && this.type === 'LIST';
    }

    get isInlineMediaStyle():boolean {
        return this.style &&
            (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }

    get isIntType():boolean {
        return this.type && this.type === 'INT';
    }

    get isLargeBinaryType():boolean {
        return this.type &&
            this.type === 'com.dgoi.core.domain.BinaryRef' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_LARGEBINARY';
    }

    get isLongType():boolean {
        return this.type && this.type === 'LONG';
    }

    get isMoneyType():boolean {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_MONEY';
    }

    get isNumericType():boolean {
        return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
    }

    get isObjRefType():boolean {
        return this.type && this.type === 'OBJ_REF';
    }

    get isPasswordType():boolean {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PASSWORD';
    }

    get isPercentType():boolean {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PERCENT';
    }

    get isStringType():boolean {
        return this.type && this.type === 'STRING';
    }

    get isTelephoneType():boolean {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_TELEPHONE';
    }

    get isTextBlock():boolean {
        return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
    }

    get isTimeType():boolean {
        return this.type && this.type === 'TIME';
    }

    get isUnformattedNumericType():boolean {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
    }

    get isURLType():boolean {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_URL';
    }

    get maintainable():boolean {
        return this._maintainable;
    }

    get name():string {
        return this._name;
    }

    get presLength():number {
        return this._presLength;
    }

    get presScale():number {
        return this._presScale;
    }

    get propertyLength():number {
        return this._propertyLength;
    }

    get propertyScale():number {
        return this._propertyScale;
    }

    get style():string {
        return this._style;
    }

    get type():string {
        return this._type;
    }

    get writeEnabled():boolean {
        return this._writeEnabled;
    }


}

/**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */
export class PropFormatter {

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForRead(prop:any, propDef:PropDef):string {
        if (prop === null || prop === undefined
            || prop.value === null || prop.value === undefined){
            return '';
        } else if ((propDef && propDef.isCodeRefType) || prop.value instanceof CodeRef) {
            return (prop.value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || prop.value instanceof ObjectRef) {
            return (prop.value as ObjectRef).description;
        } else {
            return PropFormatter.toString(prop.value, propDef);
        }
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForWrite(prop:any, propDef:PropDef):string {
        if (prop === null || prop === undefined
            || prop.value === null || prop.value === undefined){
            return null;
        } else if ((propDef && propDef.isCodeRefType) || prop.value instanceof CodeRef) {
            return (prop.value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || prop.value instanceof ObjectRef) {
            return (prop.value as ObjectRef).description;
        } else {
            return PropFormatter.toString(prop.value, propDef);
        }
    }

    /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value. 
     * @param value
     * @param propDef
     * @returns {any}
     */
    static parse(value:any, propDef:PropDef) {

        var propValue:any = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        } else if (propDef.isLongType) {
            propValue = Number(value);
        } else if (propDef.isBooleanType) {
            if (typeof value === 'string') {
                propValue = value !== 'false';
            } else {
                propValue = !!value;
            }
            
        } else if (propDef.isDateType) {
            //this could be a DateValue, a Date, or a string    
            if(value instanceof DateValue) {
                propValue = value;
            }else if(typeof value === 'object') {
                propValue = new DateValue(value);
            } else {
                //parse as local time
                propValue = new DateValue(moment(value).toDate());
            }
        } else if (propDef.isDateTimeType) {
            //this could be a DateTimeValue, a Date, or a string    
            if(value instanceof DateTimeValue) {
                propValue = value;
            }else if(typeof value === 'object') {
                propValue = new DateTimeValue(value);
            } else {
                //parse as local time
                propValue = new DateTimeValue(moment(value).toDate());
            }
        } else if (propDef.isTimeType) {
            propValue = value instanceof TimeValue ? value : TimeValue.fromString(value);
        } else if (propDef.isObjRefType) {
            propValue = value instanceof ObjectRef ? value : ObjectRef.fromFormattedValue(value);
        } else if (propDef.isCodeRefType) {
            propValue = value instanceof CodeRef ? value : CodeRef.fromFormattedValue(value);
        } else if (propDef.isGeoFixType) {
            propValue = value instanceof GeoFix ? value : GeoFix.fromFormattedValue(value);
        } else if (propDef.isGeoLocationType) {
            propValue = value instanceof GeoLocation ? value : GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    }

    /**
     * Render this value as a string
     * @param o
     * @param propDef
     * @returns {any}
     */
    static toString(o:any, propDef:PropDef):string {
        if (typeof o === 'number') {
            if(propDef) {
                if (propDef.isMoneyType) {
                    return o.toFixed(2);
                } else if (propDef.isIntType || propDef.isLongType) {
                    return o.toFixed(0);
                } else if (propDef.isDecimalType || propDef.isDoubleType) {
                    return o.toFixed(Math.max(2, (o.toString().split('.')[1] || []).length));
                }
            } else {
                return String(o);
            }
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toISOString();
            } else if (o instanceof DateValue) {
                return (o as DateValue).dateObj.toISOString();
            } else if (o instanceof DateTimeValue) {
                return (o as DateTimeValue).dateObj.toISOString();
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else if (o instanceof CodeRef) {
                return o.toString();
            } else if (o instanceof ObjectRef) {
                return o.toString();
            } else if (o instanceof GeoFix) {
                return o.toString();
            } else if (o instanceof GeoLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }
}


/**
 * Represents a 'value' or field in a row or record. See {@link EntityRec}
 * A Prop has a corresponding {@link PropDef} that describes the property.
 * Like an {@link EntityRec}, a Prop may also have {@link DataAnno}s (style annotations),
 * but these apply to the property only
 */
export class Prop {

    /**
     * @private
     * @param values
     * @returns {Success}
     */
    static fromListOfWSValue(values:Array<any>):Try<Array<any>> {
        var props = [];
        values.forEach((v)=> {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure) return new Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new Success(props);
    }

    /**
     * @private
     * @param name
     * @param value
     * @returns {any}
     */
    static fromWSNameAndWSValue(name:string, value:any):Try<Prop> {
        var propTry:Try<any> = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new Failure<Prop>(propTry.failure);
        }
        return new Success<Prop>(new Prop(name, propTry.success));
    }

    /**
     * @private
     * @param names
     * @param values
     * @returns {any}
     */
    static fromWSNamesAndValues(names:Array<string>, values:Array<any>):Try<Array<Prop>> {
        if (names.length != values.length) {
            return new Failure<Array<Prop>>("Prop::fromWSNamesAndValues: names and values must be of same length");
        }
        var list:Array<Prop> = [];
        for (var i = 0; i < names.length; i++) {
            var propTry:Try<Prop> = Prop.fromWSNameAndWSValue(names[i], values[i]);
            if (propTry.isFailure) {
                return new Failure<Array<Prop>>(propTry.failure);
            }
            list.push(propTry.success);
        }
        return new Success<Array<Prop>>(list);
    }

    /**
     * @private
     * @param value
     * @returns {any}
     */
    static fromWSValue(value:any):Try<any> {
        var propValue = value;
        if (value && 'object' === typeof value) {
            var PType = value['WS_PTYPE'];
            var strVal = value['value'];
            if (PType) {
                if (PType === 'Decimal') {
                    propValue = Number(strVal);
                } else if (PType === 'Date') {
                    //parse as ISO - no offset specified by server right now, so we assume local time
                    propValue = moment(strVal, 'YYYY-M-D').toDate();
                } else if (PType === 'DateTime') {
                    //parse as ISO - no offset specified by server right now, so we assume local time
                    //strip invalid suffix (sometimes) provided by server 
                    const i = strVal.indexOf('T0:');
                    propValue = moment((i > -1) ? strVal.substring(0, i) : strVal).toDate();
                } else if (PType === 'Time') {
                    propValue = TimeValue.fromString(strVal);
                } else if (PType === 'BinaryRef') {
                    var binaryRefTry = BinaryRef.fromWSValue(strVal, value['properties']);
                    if (binaryRefTry.isFailure) return new Failure(binaryRefTry.failure);
                    propValue = binaryRefTry.success;
                } else if (PType === 'ObjectRef') {
                    propValue = ObjectRef.fromFormattedValue(strVal);
                } else if (PType === 'CodeRef') {
                    propValue = CodeRef.fromFormattedValue(strVal);
                } else if (PType === 'GeoFix') {
                    propValue = GeoFix.fromFormattedValue(strVal);
                } else if (PType === 'GeoLocation') {
                    propValue = GeoLocation.fromFormattedValue(strVal);
                } else {
                    return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                }
            } else if(value['WS_LTYPE']) {
                return Prop.fromListOfWSValue(value['values']);
            }
        }
        return new Success(propValue);
    }

    /**
     * @private
     * @param otype
     * @param jsonObj
     * @returns {any}
     */
    static fromWS(otype:string, jsonObj):Try<Prop> {
        var name:string = jsonObj['name'];
        var valueTry = Prop.fromWSValue(jsonObj['value']);
        if (valueTry.isFailure) return new Failure<Prop>(valueTry.failure);
        var annos:Array<DataAnno> = null;
        if (jsonObj['annos']) {
            var annosListTry:Try<Array<DataAnno>> =
                DialogTriple.fromListOfWSDialogObject<DataAnno>(jsonObj['annos'], 'WSDataAnno', OType.factoryFn);
            if (annosListTry.isFailure) return new Failure<Prop>(annosListTry.failure);
            annos = annosListTry.success;
        }
        return new Success(new Prop(name, valueTry.success, annos));
    }

    /**
     * @private
     * @param o
     * @returns {any}
     */
    static toWSProperty(o:any) {
        if (typeof o === 'number') {
            return {'WS_PTYPE': 'Decimal', 'value': String(o)};
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return {'WS_PTYPE': 'DateTime', 'value': o.toISOString().slice(0, -1)};
            } else if (o instanceof DateTimeValue) {
                //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return {'WS_PTYPE': 'DateTime', 'value': o.dateObj.toISOString().slice(0, -1)};
            } else if (o instanceof DateValue) {
                //remove all Time information from the end of the ISO string from the 'T' to the end...
                const isoString = o.dateObj.toISOString();
                return {'WS_PTYPE': 'Date', 'value': isoString.slice(0, isoString.indexOf('T'))};
            } else if (o instanceof TimeValue) {
                return {'WS_PTYPE': 'Time', 'value': o.toString()};
            } else if (o instanceof CodeRef) {
                return {'WS_PTYPE': 'CodeRef', 'value': o.toString()};
            } else if (o instanceof ObjectRef) {
                return {'WS_PTYPE': 'ObjectRef', 'value': o.toString()};
            } else if (o instanceof GeoFix) {
                return {'WS_PTYPE': 'GeoFix', 'value': o.toString()};
            } else if (o instanceof GeoLocation) {
                return {'WS_PTYPE': 'GeoLocation', 'value': o.toString()};
            } else if (o instanceof InlineBinaryRef) {
                return {'WS_PTYPE': 'BinaryRef', 'value': o.toString(), properties: (o as BinaryRef).settings}
            } else if (Array.isArray(o)) {
                return Prop.toWSListOfProperties(o);
            } else {
                return o;
            }
        } else {
            return o;
        }
    }

    /**
     * 
     * @param list
     * @returns {StringDictionary}
     */
    static toWSListOfProperties(list:Array<any>):StringDictionary {
        var result:StringDictionary = {'WS_LTYPE': 'Object'};
        var values = [];
        list.forEach((o)=> {
            values.push(Prop.toWSProperty(o))
        });
        result['values'] = values;
        return result;
    }

    /**
     * @private
     * @param list
     * @returns {{WS_LTYPE: string, values: Array<string>}}
     */
    static toWSListOfString(list:Array<string>):StringDictionary {
        return {'WS_LTYPE': 'String', 'values': list};
    }

    /**
     *
     * @private
     * @param props
     * @returns {StringDictionary}
     */
    static toListOfWSProp(props:Array<Prop>):StringDictionary {
        var result:StringDictionary = {'WS_LTYPE': 'WSProp'};
        var values = [];
        props.forEach((prop)=> {
            values.push(prop.toWS())
        });
        result['values'] = values;
        return result;
    }

    /**
     *
     * @private
     * @param _name
     * @param _value
     * @param _annos
     */
    constructor(private _name:string, private _value:any, private _annos:Array<DataAnno> = []) {
    }

    /**
     * Get the data annotations associated with this property
     * @returns {Array<DataAnno>}
     */
    get annos():Array<DataAnno> {
        return this._annos;
    }

    equals(prop:Prop):boolean {
        return this.name === prop.name && this.value === prop.value;
    }

    get backgroundColor():string {
        return DataAnno.backgroundColor(this.annos);
    }

    get foregroundColor():string {
        return DataAnno.foregroundColor(this.annos);
    }

    get imageName():string {
        return DataAnno.imageName(this.annos);
    }

    get imagePlacement():string {
        return DataAnno.imagePlacement(this.annos);
    }

    get isBoldText():boolean {
        return DataAnno.isBoldText(this.annos);
    }

    get isItalicText():boolean {
        return DataAnno.isItalicText(this.annos);
    }

    get isPlacementCenter():boolean {
        return DataAnno.isPlacementCenter(this.annos);
    }

    get isPlacementLeft():boolean {
        return DataAnno.isPlacementLeft(this.annos);
    }

    get isPlacementRight():boolean {
        return DataAnno.isPlacementRight(this.annos);
    }

    get isPlacementStretchUnder():boolean {
        return DataAnno.isPlacementStretchUnder(this.annos);
    }

    get isPlacementUnder():boolean {
        return DataAnno.isPlacementUnder(this.annos);
    }

    get isUnderline():boolean {
        return DataAnno.isUnderlineText(this.annos);
    }

    /**
     * Get the property name
     * @returns {string}
     */
    get name():string {
        return this._name;
    }

    get overrideText():string {
        return DataAnno.overrideText(this.annos);
    }

    get tipText():string {
        return DataAnno.tipText(this.annos);
    }

    /**
     * Get the property value
     * @returns {any}
     */
    get value():any {
        return this._value;
    }

    set value(value:any) {
        this._value = value;
    }

    /**
     * @private
     * @returns {StringDictionary}
     */
    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value)};
        if (this.annos) {
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        }
        return result;
    }

}

/**
 * *********************************
 */


export class QueryResult {

    constructor(public entityRecs:Array<EntityRec>, public hasMore:boolean) {
    }

}
/**
 * *********************************
 */


export class HasMoreQueryMarker extends NullEntityRec {
    static singleton = new HasMoreQueryMarker();
}

export class IsEmptyQueryMarker extends NullEntityRec {
    static singleton = new IsEmptyQueryMarker();
}

export enum QueryMarkerOption {
    None, IsEmpty, HasMore
}

export class QueryScroller {

    private _buffer:Array<EntityRec>;
    private _hasMoreBackward:boolean;
    private _hasMoreForward:boolean;
    private _nextPageFr:Future<QueryResult>;
    private _prevPageFr:Future<QueryResult>;
    private _firstResultOid:string;

    constructor(private _context:QueryContext,
                private _pageSize:number,
                private _firstObjectId:string,
                private _markerOptions:Array<QueryMarkerOption> = []) {

        this.clear();

    }

    get buffer():Array<EntityRec> {
        return this._buffer;
    }

    get bufferWithMarkers():Array<EntityRec> {
        var result = ArrayUtil.copy(this._buffer);
        if (this.isComplete) {
            if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                if (this.isEmpty) {
                    result.push(IsEmptyQueryMarker.singleton);
                }
            }
        } else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
            if (result.length === 0) {
                result.push(HasMoreQueryMarker.singleton);
            } else {
                if (this._hasMoreBackward) {
                    result.unshift(HasMoreQueryMarker.singleton)
                }
                if (this._hasMoreForward) {
                    result.push(HasMoreQueryMarker.singleton);
                }
            }
        }
        return result;
    }

    get context():QueryContext {
        return this._context;
    }

    get firstObjectId():string {
        return this._firstObjectId;
    }

    get hasMoreBackward():boolean {
        return this._hasMoreBackward;
    }

    get hasMoreForward():boolean {
        return this._hasMoreForward;
    }

    get isComplete():boolean {
        return !this._hasMoreBackward && !this._hasMoreForward;
    }

    get isCompleteAndEmpty():boolean {
        return this.isComplete && this._buffer.length === 0;
    }

    get isEmpty():boolean {
        return this._buffer.length === 0;
    }

    pageBackward():Future<Array<EntityRec>> {
        if (!this._hasMoreBackward) {
            return Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
        } else {
            this._prevPageFr = this._prevPageFr.bind((queryResult:QueryResult)=> {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                return this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
            });
        }

        var beforeSize:number = this._buffer.length;

        return this._prevPageFr.map((queryResult:QueryResult)=> {
            var afterSize = beforeSize;
            this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer:Array<EntityRec> = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                this._buffer.forEach((entityRec:EntityRec)=> {
                    newBuffer.push(entityRec)
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });

    }

    pageForward():Future<Array<EntityRec>> {

        if (!this._hasMoreForward) {
            return Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
        } else {
            this._nextPageFr = this._nextPageFr.bind((queryResult:QueryResult)=> {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                return this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
            });
        }

        var beforeSize:number = this._buffer.length;

        return this._nextPageFr.map((queryResult:QueryResult)=> {
            var afterSize = beforeSize;
            this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer:Array<EntityRec> = [];
                this._buffer.forEach((entityRec:EntityRec)=> {
                    newBuffer.push(entityRec)
                });
                queryResult.entityRecs.forEach((entityRec:EntityRec)=> {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    }

    get pageSize():number {
        return this._pageSize;
    }

    refresh():Future<Array<EntityRec>> {
        this.clear();
        return this.pageForward().map((entityRecList:Array<EntityRec>)=> {
            if(entityRecList.length > 0) {
                this._firstResultOid = entityRecList[0].objectId;
            }
            this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    }

    trimFirst(n:number) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
    }

    trimLast(n:number) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
    }

    private clear() {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
        this._firstResultOid = null;
    }

}
/**
 * *********************************
 */


export interface ServiceEndpoint {

    serverAssignment:string;
    tenantId:string;
    responseType:string;
    soiVersion:string;

}
/**
 * *********************************
 */


export class SessionContextImpl implements SessionContext {

    private _clientType:string;
    private _gatewayHost:string;
    private _password:string;
    private _remoteSession:boolean;
    private _tenantId:string;
    private _userId:string;

    currentDivision:string;
    serverVersion:string;
    sessionHandle:string;
    systemContext:SystemContext;
    userName:string;

    static fromWSCreateSessionResult(jsonObject:{[id:string]:any},
                                     systemContext:SystemContext):Try<SessionContext> {

        var sessionContextTry:Try<SessionContext> = DialogTriple.fromWSDialogObject<SessionContext>(jsonObject,
            'WSCreateSessionResult', OType.factoryFn);
        return sessionContextTry.map((sessionContext:SessionContext)=> {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    }

    static createSessionContext(gatewayHost:string,
                                tenantId:string,
                                clientType:string,
                                userId:string,
                                password:string):SessionContext {

        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;

        return sessionContext;
    }

    constructor(sessionHandle:string,
                userName:string,
                currentDivision:string,
                serverVersion:string,
                systemContext:SystemContext) {

        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }

    get clientType() {
        return this._clientType;
    }

    get gatewayHost() {
        return this._gatewayHost;
    }

    get isLocalSession() {
        return !this._remoteSession;
    }

    get isRemoteSession() {
        return this._remoteSession;
    }

    get password() {
        return this._password;
    }

    get tenantId() {
        return this._tenantId;
    }

    get userId() {
        return this._userId;
    }

    set online(online:boolean) {
        this._remoteSession = online;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class SessionService {

    private static SERVICE_NAME = "SessionService";
    private static SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;

    static createSession(tenantId:string,
                         userId:string,
                         password:string,
                         clientType:string,
                         systemContext:SystemContext):Future<SessionContext> {

        var method = "createSessionDirectly";

        var params:StringDictionary = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);

        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture("createSession/extractSessionContextFromResponse",
                    SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
            }
        );

    }

    static deleteSession(sessionContext:SessionContext):Future<VoidResult> {

        var method = "deleteSession";
        var params:StringDictionary = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createSuccessfulFuture<VoidResult>("deleteSession/extractVoidResultFromResponse", result);
            }
        );
    }

    static getSessionListProperty(propertyName:string, sessionContext:SessionContext):Future<XGetSessionListPropertyResult> {

        var method = "getSessionListProperty";
        var params:StringDictionary = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture<XGetSessionListPropertyResult>("getSessionListProperty/extractResultFromResponse",
                    DialogTriple.fromWSDialogObject<XGetSessionListPropertyResult>(result, 'WSGetSessionListPropertyResult', OType.factoryFn));
            }
        );
    }

    static setSessionListProperty(propertyName:string,
                                  listProperty:Array<string>,
                                  sessionContext:SessionContext):Future<VoidResult> {

        var method = "setSessionListProperty";
        var params:StringDictionary = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createSuccessfulFuture<VoidResult>("setSessionListProperty/extractVoidResultFromResponse", result);
            }
        );
    }
}
/**
 * *********************************
 */

export class SortPropDef {

    constructor(private _name:string, private _direction:string) {
    }

    get direction():string {
        return this._direction;
    }

    get name():string {
        return this._name;
    }

}
/**
 * *********************************
 */


export class SystemContextImpl implements SystemContext {

    constructor(private _urlString:string) {
    }

    get urlString():string {
        return this._urlString;
    }

    /*constructor(private _scheme: string,
     private _host: string,
     private _port: number,
     private _path: string){}

     get scheme():string {
     return this._scheme;
     }

     get host(): string {
     return this._host;
     }

     get port(): number {
     return this._port;
     }

     get path(): string {
     return this._path;
     }

     private toURLString():string {

     var urlString = "";
     if(this._host) {
     if(this._scheme) {
     urlString += this._scheme + "://";
     }
     urlString += this._host;
     if(this.port) {
     urlString += ":" + this._port;
     }
     urlString += "/";
     }
     if(this._path) {
     urlString += this._path + "/";
     }

     return urlString;
     }*/
}
/**
 * *********************************
 */


export interface VoidResult {
}
/**
 * *********************************
 */


export class WorkbenchLaunchAction implements ActionSource {

    constructor(public id:string,
                public workbenchId:string,
                public name:string,
                public alias:string,
                public iconBase:string) {
    }

    get actionId():string {
        return this.id;
    }

    get fromActionSource():ActionSource {
        return null;
    }

    get virtualPathSuffix():Array<string> {
        return [this.workbenchId, this.id];
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class WorkbenchService {

    private static SERVICE_NAME = "WorkbenchService";
    private static SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;

    static getAppWinDef(sessionContext:SessionContext):Future<AppWinDef> {

        var method:string = "getApplicationWindowDef";
        var params:StringDictionary = {'sessionHandle': sessionContext.sessionHandle};
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture("createSession/extractAppWinDefFromResult",
                    DialogTriple.fromWSDialogObjectResult<AppWinDef>(result, 'WSApplicationWindowDefResult',
                        'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn)
                );
            }
        );
    }

    static getWorkbench(sessionContext:SessionContext, workbenchId:string):Future<Workbench> {

        var method = "getWorkbench";
        var params:StringDictionary = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind<Workbench>(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture<Workbench>("getWorkbench/extractObject",
                    DialogTriple.fromWSDialogObjectResult<Workbench>(result, 'WSWorkbenchResult', 'WSWorkbench',
                        'workbench', OType.factoryFn));
            }
        );

    }

    static performLaunchAction(actionId:string,
                               workbenchId:string,
                               sessionContext:SessionContext):Future<Redirection> {

        var method = "performLaunchAction";
        var params:StringDictionary = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind(
            (result:StringDictionary)=> {
                return Future.createCompletedFuture("performLaunchAction/extractRedirection",
                    DialogTriple.fromWSDialogObject<Redirection>(result['redirection'], 'WSRedirection', OType.factoryFn)
                );
            }
        );
    }
}
/**
 * *********************************
 */


export class Workbench implements NavRequest {

    constructor(private _id:string,
                private _name:string,
                private _alias:string,
                private _actions:Array<WorkbenchLaunchAction>) {
    }

    get alias() {
        return this._alias;
    }

    getLaunchActionById(launchActionId:string) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction:WorkbenchLaunchAction) {
            if (launchAction.id = launchActionId) {
                result = launchAction;
                return true;
            }
        });
        return result;
    }

    get name() {
        return this._name;
    }

    get workbenchId() {
        return this._id;
    }

    get workbenchLaunchActions():Array<WorkbenchLaunchAction> {
        return ArrayUtil.copy(this._actions);
    }

}


/* XPane Classes */

/**
 * @private
 */
export class XPaneDef {

    static fromWS(otype:string, jsonObj):Try<XPaneDef> {
        if (jsonObj['listDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', OType.factoryFn);
        } else if (jsonObj['detailsDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', OType.factoryFn);
        } else if (jsonObj['formDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', OType.factoryFn);
        } else if (jsonObj['mapDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', OType.factoryFn);
        } else if (jsonObj['graphDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', OType.factoryFn);
        } else if (jsonObj['barcodeScanDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', OType.factoryFn);
        } else if (jsonObj['imagePickerDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', OType.factoryFn);
        } else if (jsonObj['geoFixDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', OType.factoryFn);
        } else if (jsonObj['geoLocationDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', OType.factoryFn);
        } else if (jsonObj['calendarDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', OType.factoryFn);
        } else {
            return new Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }

    constructor() {
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XBarcodeScanDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XCalendarDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public descriptionProperty:string,
                public initialStyle:string,
                public startDateProperty:string,
                public startTimeProperty:string,
                public endDateProperty:string,
                public endTimeProperty:string,
                public occurDateProperty:string,
                public occurTimeProperty:string) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XChangePaneModeResult {

    constructor(public editorRecordDef:EntityRecDef,
                public dialogProperties:StringDictionary) {
    }

    get entityRecDef():EntityRecDef {
        return this.editorRecordDef;
    }

    get dialogProps():StringDictionary {
        return this.dialogProperties;
    }

}
/**
 * *********************************
 */

/**
 * @private
 */
export class XDetailsDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public cancelButtonText:string,
                public commitButtonText:string,
                public editable:boolean,
                public focusPropertyName:string,
                public overrideGML:string,
                public rows:Array<Array<CellDef>>) {
        super();
    }

    get graphicalMarkup():string {
        return this.overrideGML;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XFormDef extends XPaneDef {

    constructor(public borderStyle:string,
                public formLayout:string,
                public formStyle:string,
                public name:string,
                public paneId:string,
                public title:string,
                public headerDefRef:XPaneDefRef,
                public paneDefRefs:Array<XPaneDefRef>) {
        super();
    }
}
/**
 * *********************************
 */


/**
 * @private
 */
export class XFormModelComp {

    constructor(public paneId:string,
                public redirection:DialogRedirection,
                public label:string,
                public title:string) {
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XFormModel {

    constructor(public form:XFormModelComp,
                public header:XFormModelComp,
                public children:Array<XFormModelComp>,
                public placement:string,
                public refreshTimer:number,
                public sizeToWindow:boolean) {
    }

    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    static fromWS(otype:string, jsonObj):Try<XFormModel> {

        return DialogTriple.fromWSDialogObject<XFormModelComp>(jsonObj['form'],
            'WSFormModelComp', OType.factoryFn, true).bind((form:XFormModelComp)=> {
            var header:XFormModelComp = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple.fromWSDialogObject<XFormModelComp>(jsonObj['header'],
                    'WSFormModelComp', OType.factoryFn, true);
                if (headerTry.isFailure) return new Failure<XFormModel>(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple.fromListOfWSDialogObject<XFormModelComp>(jsonObj['children'],
                'WSFormModelComp', OType.factoryFn, true).bind((children:Array<XFormModelComp>)=> {
                return new Success(new XFormModel(form, header, children, jsonObj['placement'],
                    jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });

    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGeoFixDef extends XPaneDef {

    constructor(public paneId:string, public name:string, public title:string) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGeoLocationDef extends XPaneDef {

    constructor(public paneId:string, public name:string, public title:string) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGetActiveColumnDefsResult {

    constructor(public columnsStyle:string, public columns:Array<ColumnDef>) {
    }

    get columnDefs():Array<ColumnDef> {
        return this.columns;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGetAvailableValuesResult {

    static fromWS(otype:string, jsonObj):Try<XGetAvailableValuesResult> {
        var listJson = jsonObj['list'];
        if (listJson) {
            var valuesJson:Array<any> = listJson['values'];
            return Prop.fromListOfWSValue(valuesJson).bind((values:Array<any>)=> {
                return new Success(new XGetAvailableValuesResult(values));
            });
        } else {
            return new Success(new XGetAvailableValuesResult([]));
        }
    }

    constructor(public list:Array<any>) {
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGetSessionListPropertyResult {

    constructor(private _list:Array<string>, private _dialogProps:StringDictionary) {
    }

    get dialogProps():StringDictionary {
        return this._dialogProps;
    }

    get values():Array<string> {
        return this._list;
    }

    valuesAsDictionary():StringDictionary {
        var result:StringDictionary = {};
        this.values.forEach(
            (v)=> {
                var pair = StringUtil.splitSimpleKeyValuePair(v);
                result[pair[0]] = pair[1];
            }
        );
        return result;
    }
}
/**
 * *********************************
 */


/**
 * @private
 */
export class XGraphDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public graphType:string,
                public displayQuadrantLines:boolean,
                public identityDataPoint:GraphDataPointDef,
                public groupingDataPoint:GraphDataPointDef,
                public dataPoints:Array<GraphDataPointDef>,
                public filterDataPoints:Array<GraphDataPointDef>,
                public sampleModel:string,
                public xAxisLabel:string,
                public xAxisRangeFrom:number,
                public xAxisRangeTo:number,
                public yAxisLabel:string,
                public yAxisRangeFrom:number,
                public yAxisRangeTo:number) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XImagePickerDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public URLProperty:string,
                public defaultActionId:string) {
        super();
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XListDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public style:string,
                public initialColumns:number,
                public columnsStyle:string,
                public overrideGML:string) {
        super();
    }

    get graphicalMarkup():string {
        return this.overrideGML;
    }

    set graphicalMarkup(graphicalMarkup:string) {
        this.overrideGML = graphicalMarkup;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XMapDef extends XPaneDef {

    constructor(public paneId:string,
                public name:string,
                public title:string,
                public descriptionProperty:string,
                public streetProperty:string,
                public cityProperty:string,
                public stateProperty:string,
                public postalCodeProperty:string,
                public latitudeProperty:string,
                public longitudeProperty:string) {
        super();
    }

    //descriptionProperty is misspelled in json returned by server currently...
    set descrptionProperty(prop:string) {
        this.descriptionProperty = prop;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export interface XOpenDialogModelResult {

    entityRecDef:EntityRecDef;

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XOpenEditorModelResult implements XOpenDialogModelResult {

    constructor(public editorRecordDef:EntityRecDef, public formModel:XFormModel) {
    }

    get entityRecDef():EntityRecDef {
        return this.editorRecordDef;
    }

    get formPaneId():string {
        return this.formModel.form.paneId;
    }

    get formRedirection():DialogRedirection {
        return this.formModel.form.redirection;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XOpenQueryModelResult implements XOpenDialogModelResult {

    static fromWS(otype:string, jsonObj):Try<XOpenQueryModelResult> {

        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];

        return DialogTriple.fromListOfWSDialogObject<PropDef>(queryRecDefJson['propertyDefs']
            , 'WSPropertyDef', OType.factoryFn).bind((propDefs:Array<PropDef>)=> {
            var entityRecDef = new EntityRecDef(propDefs);
            return DialogTriple.fromListOfWSDialogObject<SortPropDef>(queryRecDefJson['sortPropertyDefs'],
                'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=> {
                return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    }

    constructor(public entityRecDef:EntityRecDef,
                public sortPropertyDef:Array<SortPropDef>,
                public defaultActionId:string) {
    }
}
/**
 * *********************************
 */

/**
 * @private
 */
export class XPaneDefRef {

    public static FORM_TYPE:string = 'FORM';

    constructor(public name:string,
                public paneId:string,
                public title:string,
                public type:string) {
    }
}
/**
 * *********************************
 */


/**
 * @private
 */
export class XPropertyChangeResult {

    constructor(public availableValueChanges:Array<string>,
                public propertyName:string,
                public sideEffects:XReadResult,
                public editorRecordDef:EntityRecDef) {
    }

    get sideEffectsDef():EntityRecDef {
        return this.editorRecordDef;
    }

    set sideEffectsDef(sideEffectsDef:EntityRecDef) {
        this.editorRecordDef = sideEffectsDef;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XQueryResult {

    constructor(public entityRecs:Array<EntityRec>,
                public entityRecDef:EntityRecDef,
                public hasMore:boolean,
                public sortPropDefs:Array<SortPropDef>,
                public defaultActionId:string,
                public dialogProps:StringDictionary) {
    }

    static fromWS(otype:string, jsonObj):Try<XQueryResult> {

        return DialogTriple.fromWSDialogObject<EntityRecDef>(jsonObj['queryRecordDef'],
            'WSQueryRecordDef', OType.factoryFn).bind((entityRecDef:EntityRecDef)=> {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId:string = jsonObj['defaultActionId'];
            return DialogTriple.fromListOfWSDialogObject<SortPropDef>(entityRecDefJson['sortPropertyDefs'],
                'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs:Array<SortPropDef>)=> {
                var queryRecsJson = jsonObj['queryRecords'];
                if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                    return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                }
                var queryRecsValues:Array<StringDictionary> = queryRecsJson['values'];
                var entityRecs:Array<EntityRec> = [];
                for (var i = 0; i < queryRecsValues.length; i++) {
                    var queryRecValue = queryRecsValues[i];
                    if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                        return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                    }
                    var objectId = queryRecValue['objectId'];
                    var recPropsObj:StringDictionary = queryRecValue['properties'];
                    if (recPropsObj['WS_LTYPE'] !== 'Object') {
                        return new Failure<XQueryResult>('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                    }
                    var recPropsObjValues:Array<any> = recPropsObj['values'];
                    var propsTry:Try<Array<Prop>> = Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure) return new Failure<XQueryResult>(propsTry.failure);
                    var props:Array<Prop> = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure) return new Failure<XQueryResult>(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos:Array<DataAnno> = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = DialogTriple.fromWSDialogObject<Array<DataAnno>>(queryRecValue['recordAnnotation'],
                            'WSDataAnnotation', OType.factoryFn);
                        if (recAnnosTry.isFailure) return new Failure<XQueryResult>(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec:EntityRec = EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps:StringDictionary = jsonObj['dialogProperties'];
                var hasMore:boolean = jsonObj['hasMore'];
                return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs,
                    actionId, dialogProps));


            });

        });

    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XReadResult {

    constructor(private _editorRecord:EntityRec,
                private _editorRecordDef:EntityRecDef,
                private _dialogProperties:StringDictionary) {
    }

    get entityRec():EntityRec {
        return this._editorRecord;
    }

    get entityRecDef():EntityRecDef {
        return this._editorRecordDef;
    }

    get dialogProps():StringDictionary {
        return this._dialogProperties;
    }

}
/**
 * *********************************
 */


/**
 * @private
 */
export class XWriteResult {

    constructor(private _editorRecord:EntityRec, private _editorRecordDef:EntityRecDef,
                private _dialogProperties:StringDictionary) {
    }

    get dialogProps():StringDictionary {
        return this._dialogProperties;
    }

    get entityRec():EntityRec {
        return this._editorRecord;
    }

    get entityRecDef():EntityRecDef {
        return this._editorRecordDef;
    }

    get isDestroyed():boolean {
        var destoyedStr = this.dialogProps['destroyed'];
        return destoyedStr && destoyedStr.toLowerCase() === 'true'
    }
}

/**
 * *********************************
 */

/**
 * @private
 */
export class XWritePropertyResult {
    constructor(public dialogProperties:StringDictionary) {
    }
}

/**
 * @private
 */
export class XReadPropertyResult {
    constructor(public dialogProperties:StringDictionary,
                public hasMore:boolean,
                public data:string,
                public dataLength:number) {
    }
}


/*
 OType must be last as it references almost all other classes in the module
 */
/**
 * @private
 */
export class OType {

    private static types = {
        'WSApplicationWindowDef': AppWinDef,
        'WSAttributeCellValueDef': AttributeCellValueDef,
        'WSBarcodeScanDef': XBarcodeScanDef,
        'WSCalendarDef': XCalendarDef,
        'WSCellDef': CellDef,
        'WSChangePaneModeResult': XChangePaneModeResult,
        'WSColumnDef': ColumnDef,
        'WSContextAction': ContextAction,
        'WSCreateSessionResult': SessionContextImpl,
        'WSDialogHandle': DialogHandle,
        'WSDataAnno': DataAnno,
        'WSDetailsDef': XDetailsDef,
        'WSDialogRedirection': DialogRedirection,
        'WSEditorRecordDef': EntityRecDef,
        'WSEntityRecDef': EntityRecDef,
        'WSForcedLineCellValueDef': ForcedLineCellValueDef,
        'WSFormDef': XFormDef,
        'WSFormModelComp': XFormModelComp,
        'WSGeoFixDef': XGeoFixDef,
        'WSGeoLocationDef': XGeoLocationDef,
        'WSGetActiveColumnDefsResult': XGetActiveColumnDefsResult,
        'WSGetSessionListPropertyResult': XGetSessionListPropertyResult,
        'WSGraphDataPointDef': GraphDataPointDef,
        'WSGraphDef': XGraphDef,
        'WSHandlePropertyChangeResult': XPropertyChangeResult,
        'WSImagePickerDef': XImagePickerDef,
        'WSLabelCellValueDef': LabelCellValueDef,
        'WSListDef': XListDef,
        'WSMapDef': XMapDef,
        'WSMenuDef': MenuDef,
        'WSOpenEditorModelResult': XOpenEditorModelResult,
        'WSOpenQueryModelResult': XOpenQueryModelResult,
        'WSPaneDefRef': XPaneDefRef,
        'WSPropertyDef': PropDef,
        'WSQueryRecordDef': EntityRecDef,
        'WSReadResult': XReadResult,
        'WSSortPropertyDef': SortPropDef,
        'WSSubstitutionCellValueDef': SubstitutionCellValueDef,
        'WSTabCellValueDef': TabCellValueDef,
        'WSWebRedirection': WebRedirection,
        'WSWorkbench': Workbench,
        'WSWorkbenchRedirection': WorkbenchRedirection,
        'WSWorkbenchLaunchAction': WorkbenchLaunchAction,
        'XWriteResult': XWriteResult,
        'WSWritePropertyResult': XWritePropertyResult,
        'WSReadPropertyResult': XReadPropertyResult,
        'WSException': DialogException,
        'WSUserMessage': UserMessage
    };

    private static typeFns:{[index:string]:<A>(string, any)=>Try<A>} = {
        'WSCellValueDef': CellValueDef.fromWS,
        'WSDataAnnotation': DataAnno.fromWS,
        'WSEditorRecord': EntityRecUtil.fromWSEditorRecord,
        'WSFormModel': XFormModel.fromWS,
        'WSGetAvailableValuesResult': XGetAvailableValuesResult.fromWS,
        'WSPaneDef': XPaneDef.fromWS,
        'WSOpenQueryModelResult': XOpenQueryModelResult.fromWS,
        'WSProp': Prop.fromWS,
        'WSQueryResult': XQueryResult.fromWS,
        'WSRedirection': Redirection.fromWS,
    }

    private static typeInstance(name) {
        var type = OType.types[name];
        return type && new type;
    }

    static factoryFn<A>(otype:string, jsonObj):Try<A> {
        var typeFn:(string, any)=>Try<A> = OType.typeFns[otype];
        if (typeFn) {
            return typeFn(otype, jsonObj);
        }
        return null;
    }

    static deserializeObject<A>(obj, Otype:string, factoryFn:(otype:string, jsonObj?)=>any):Try<A> {

        //Log.debug('Deserializing ' + Otype);
        if (Array.isArray(obj)) {
            //it's a nested array (no LTYPE!)
            return OType.handleNestedArray<A>(Otype, obj);
        } else {
            var newObj:A = null;
            var objTry:Try<A> = factoryFn(Otype, obj); //this returns null if there is no custom function
            if (objTry) {
                if (objTry.isFailure) {
                    var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                        + ObjUtil.formatRecAttr(objTry.failure);
                    Log.error(error);
                    return new Failure<A>(error);
                }
                newObj = objTry.success;
            } else {
                newObj = OType.typeInstance(Otype);
                if (!newObj) {
                    Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                    return new Failure<A>('OType::deserializeObject: no type constructor found for ' + Otype);
                }
                for (var prop in obj) {
                    var value = obj[prop];
                    //Log.debug("prop: " + prop + " is type " + typeof value);
                    if (value && typeof value === 'object') {
                        if ('WS_OTYPE' in value) {
                            var otypeTry = DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if (otypeTry.isFailure) return new Failure<A>(otypeTry.failure);
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        } else if ('WS_LTYPE' in value) {
                            var ltypeTry = DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if (ltypeTry.isFailure) return new Failure<A>(ltypeTry.failure);
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        } else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    } else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
            }
            return new Success<A>(newObj);
        }
    }

    static serializeObject(obj, Otype:string, filterFn?:(prop)=>boolean):StringDictionary {
        var newObj = {'WS_OTYPE': Otype};
        return ObjUtil.copyNonNullFieldsOnly(obj, newObj, (prop)=> {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    }

    private static handleNestedArray<A>(Otype:string, obj):Try<A> {
        return OType.extractLType(Otype).bind((ltype:string)=> {
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure) return new Failure<A>(newArrayTry.failure);
            return new Success(<any>newArrayTry.success);
        });
    }

    private static deserializeNestedArray(array, ltype):Try<Array<any>> {

        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (value && typeof value === 'object') {
                var otypeTry = DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                if (otypeTry.isFailure) {
                    return new Failure<Array<any>>(otypeTry.failure);
                }
                newArray.push(otypeTry.success);
            } else {
                newArray.push(value);
            }
        }
        return new Success(newArray);
    }

    private static extractLType(Otype):Try<string> {
        if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
            return new Failure<string>('Expected OType of List<some_type> but found ' + Otype);
        }
        var ltype = Otype.slice(5, -1);
        return new Success(ltype);
    }

    private static assignPropIfDefined(prop, value, target, otype = 'object') {
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
                //Log.info('Assigning private prop _' + prop + ' = ' + value);
            } else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                    //Log.info('Assigning public prop ' + prop + ' = ' + value);
                } else {
                    //Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                }
            }
        } catch (error) {
            Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
        }
    }
}

/**
 * *********************************
 */
