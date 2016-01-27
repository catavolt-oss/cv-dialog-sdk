import { Try } from "./fp";
import { Either } from "./fp";
import { Future } from "./fp";
import { Log } from "./util";
import { ObjUtil } from "./util";
import { Success } from "./fp";
import { Failure } from "./fp";
import { StringUtil } from "./util";
import { ArrayUtil } from "./util";
import { Call } from "./ws";
import { Get } from "./ws";
/*
 IMPORTANT!
 Note #1: Dependency cycles - These classes must be in a single file (module) because of commonjs and circular dependency issues.
 Note #2 Dependent ordering - Important! : Because of typescript's 'extends' function, order matters in this file!  super classes must be first!
 */
/**
 * *********************************
 */
export class CellValueDef {
    constructor(_style) {
        this._style = _style;
    }
    /* Note compact deserialization will be handled normally by OType */
    static fromWS(otype, jsonObj) {
        if (jsonObj['attributeCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['attributeCellValueDef'], 'WSAttributeCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['forcedLineCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['forcedLineCellValueDef'], 'WSForcedLineCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['labelCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['labelCellValueDef'], 'WSLabelCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['substitutionCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['substitutionCellValueDef'], 'WSSubstitutionCellValueDef', OType.factoryFn);
        }
        else if (jsonObj['tabCellValueDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['tabCellValueDef'], 'WSTabCellValueDef', OType.factoryFn);
        }
        else {
            return new Failure('CellValueDef::fromWS: unknown CellValueDef type: ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }
    get isInlineMediaStyle() {
        return this.style && (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }
    get style() {
        return this._style;
    }
}
/**
 * *********************************
 */
export class AttributeCellValueDef extends CellValueDef {
    constructor(_propertyName, _presentationLength, _entryMethod, _autoFillCapable, _hint, _toolTip, _fieldActions, style) {
        super(style);
        this._propertyName = _propertyName;
        this._presentationLength = _presentationLength;
        this._entryMethod = _entryMethod;
        this._autoFillCapable = _autoFillCapable;
        this._hint = _hint;
        this._toolTip = _toolTip;
        this._fieldActions = _fieldActions;
    }
    get autoFileCapable() {
        return this._autoFillCapable;
    }
    get entryMethod() {
        return this._entryMethod;
    }
    get fieldActions() {
        return this._fieldActions;
    }
    get hint() {
        return this._hint;
    }
    get isComboBoxEntryMethod() {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_COMBO_BOX';
    }
    get isDropDownEntryMethod() {
        return this.entryMethod && this.entryMethod === 'ENTRY_METHOD_DROP_DOWN';
    }
    get isTextFieldEntryMethod() {
        return !this.entryMethod || this.entryMethod === 'ENTRY_METHOD_TEXT_FIELD';
    }
    get presentationLength() {
        return this._presentationLength;
    }
    get propertyName() {
        return this._propertyName;
    }
    get toolTip() {
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
    constructor(_value, style) {
        super(style);
        this._value = _value;
    }
    get value() {
        return this._value;
    }
}
/**
 * *********************************
 */
export class SubstitutionCellValueDef extends CellValueDef {
    constructor(_value, style) {
        super(style);
        this._value = _value;
    }
    get value() {
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
        this.menuDefs.some((md) => {
            result = md.findAtId(actionId);
            return result != null;
        });
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
    set parentContext(parentContext) {
        this._parentContext = parentContext;
    }
}
PaneContext.ANNO_NAME_KEY = "com.catavolt.annoName";
PaneContext.PROP_NAME_KEY = "com.catavolt.propName";
/**
 * *********************************
 */
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
        var result = DialogService.writeEditorModel(this.paneDef.dialogRedirection.dialogHandle, this.buffer.afterEffects(), this.sessionContext).bind((either) => {
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
/**
 * *********************************
 */
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
/**
 * *********************************
 */
var QueryState;
(function (QueryState) {
    QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
    QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
})(QueryState || (QueryState = {}));
export var QueryDirection;
(function (QueryDirection) {
    QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
    QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
})(QueryDirection || (QueryDirection = {}));
export class QueryContext extends PaneContext {
    constructor(paneRef, _offlineRecs = [], _settings = {}) {
        super(paneRef);
        this._offlineRecs = _offlineRecs;
        this._settings = _settings;
    }
    get entityRecDef() {
        return this.paneDef.entityRecDef;
    }
    isBinary(columnDef) {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
    }
    get isDestroyed() {
        return this._queryState === QueryState.DESTROYED;
    }
    get lastQueryFr() {
        return this._lastQueryFr;
    }
    get offlineRecs() {
        return this._offlineRecs;
    }
    set offlineRecs(offlineRecs) {
        this._offlineRecs = offlineRecs;
    }
    get paneMode() {
        return this._settings['paneMode'];
    }
    performMenuAction(menuDef, targets) {
        return DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind((redirection) => {
            var target = targets.length > 0 ? targets[0] : null;
            var ca = new ContextAction(menuDef.actionId, target, this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, this.sessionContext);
        }).map((navRequest) => {
            this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, navRequest);
            if (this.isDestroyedSetting) {
                this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    }
    query(maxRows, direction, fromObjectId) {
        return DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind((value) => {
            var result = new QueryResult(value.entityRecs, value.hasMore);
            if (this.lastRefreshTime === new Date(0)) {
                this.lastRefreshTime = new Date();
            }
            return Future.createSuccessfulFuture('QueryContext::query', result);
        });
    }
    refresh() {
        return this._scroller.refresh();
    }
    get scroller() {
        if (!this._scroller) {
            this._scroller = this.newScroller();
        }
        return this._scroller;
    }
    setScroller(pageSize, firstObjectId, markerOptions) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    }
    //module level methods
    newScroller() {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    }
    settings() {
        return this._settings;
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
    get isRefreshSetting() {
        return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
    }
}
/**
 * *********************************
 */
export class BarcodeScanContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get barcodeScanDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class DetailsContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get detailsDef() {
        return this.paneDef;
    }
    get printMarkupURL() {
        return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
    }
}
/**
 * *********************************
 */
export class GeoFixContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get geoFixDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class GeoLocationContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get geoLocationDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class CalendarContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get calendarDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class GraphContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get graphDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class ImagePickerContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get imagePickerDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class ListContext extends QueryContext {
    constructor(paneRef, offlineRecs = [], settings = {}) {
        super(paneRef, offlineRecs, settings);
    }
    get columnHeadings() {
        return this.listDef.activeColumnDefs.map((cd) => {
            return cd.heading;
        });
    }
    get listDef() {
        return this.paneDef;
    }
    rowValues(entityRec) {
        return this.listDef.activeColumnDefs.map((cd) => {
            return entityRec.valueAtName(cd.name);
        });
    }
    get style() {
        return this.listDef.style;
    }
}
/**
 * *********************************
 */
export class MapContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get mapDef() {
        return this.paneDef;
    }
}
/**
 * *********************************
 */
export class PaneDef {
    constructor(_paneId, _name, _label, _title, _menuDefs, _entityRecDef, _dialogRedirection, _settings) {
        this._paneId = _paneId;
        this._name = _name;
        this._label = _label;
        this._title = _title;
        this._menuDefs = _menuDefs;
        this._entityRecDef = _entityRecDef;
        this._dialogRedirection = _dialogRedirection;
        this._settings = _settings;
    }
    static fromOpenPaneResult(childXOpenResult, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs) {
        var settings = {};
        ObjUtil.addAllProps(childXComp.redirection.dialogProperties, settings);
        var newPaneDef;
        if (childXPaneDef instanceof XListDef) {
            var xListDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ListDef(xListDef.paneId, xListDef.name, childXComp.label, xListDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xListDef.style, xListDef.initialColumns, childXActiveColDefs.columnDefs, xListDef.columnsStyle, xOpenQueryModelResult.defaultActionId, xListDef.graphicalMarkup);
        }
        else if (childXPaneDef instanceof XDetailsDef) {
            var xDetailsDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new DetailsDef(xDetailsDef.paneId, xDetailsDef.name, childXComp.label, xDetailsDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings, xDetailsDef.cancelButtonText, xDetailsDef.commitButtonText, xDetailsDef.editable, xDetailsDef.focusPropertyName, xDetailsDef.graphicalMarkup, xDetailsDef.rows);
        }
        else if (childXPaneDef instanceof XMapDef) {
            var xMapDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new MapDef(xMapDef.paneId, xMapDef.name, childXComp.label, xMapDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xMapDef.descriptionProperty, xMapDef.streetProperty, xMapDef.cityProperty, xMapDef.stateProperty, xMapDef.postalCodeProperty, xMapDef.latitudeProperty, xMapDef.longitudeProperty);
        }
        else if (childXPaneDef instanceof XGraphDef) {
            var xGraphDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new GraphDef(xGraphDef.paneId, xGraphDef.name, childXComp.label, xGraphDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xGraphDef.graphType, xGraphDef.identityDataPoint, xGraphDef.groupingDataPoint, xGraphDef.dataPoints, xGraphDef.filterDataPoints, xGraphDef.sampleModel);
        }
        else if (childXPaneDef instanceof XBarcodeScanDef) {
            var xBarcodeScanDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new BarcodeScanDef(xBarcodeScanDef.paneId, xBarcodeScanDef.name, childXComp.label, xBarcodeScanDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoFixDef) {
            var xGeoFixDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoFixDef(xGeoFixDef.paneId, xGeoFixDef.name, childXComp.label, xGeoFixDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XGeoLocationDef) {
            var xGeoLocationDef = childXPaneDef;
            var xOpenEditorModelResult = childXOpenResult;
            newPaneDef = new GeoLocationDef(xGeoLocationDef.paneId, xGeoLocationDef.name, childXComp.label, xGeoLocationDef.title, childMenuDefs, xOpenEditorModelResult.entityRecDef, childXComp.redirection, settings);
        }
        else if (childXPaneDef instanceof XCalendarDef) {
            var xCalendarDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new CalendarDef(xCalendarDef.paneId, xCalendarDef.name, childXComp.label, xCalendarDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xCalendarDef.descriptionProperty, xCalendarDef.initialStyle, xCalendarDef.startDateProperty, xCalendarDef.startTimeProperty, xCalendarDef.endDateProperty, xCalendarDef.endTimeProperty, xCalendarDef.occurDateProperty, xCalendarDef.occurTimeProperty, xOpenQueryModelResult.defaultActionId);
        }
        else if (childXPaneDef instanceof XImagePickerDef) {
            var xImagePickerDef = childXPaneDef;
            var xOpenQueryModelResult = childXOpenResult;
            newPaneDef = new ImagePickerDef(xImagePickerDef.paneId, xImagePickerDef.name, childXComp.label, xImagePickerDef.title, childMenuDefs, xOpenQueryModelResult.entityRecDef, childXComp.redirection, settings, xImagePickerDef.URLProperty, xImagePickerDef.defaultActionId);
        }
        else {
            return new Failure('PaneDef::fromOpenPaneResult needs impl for: ' + ObjUtil.formatRecAttr(childXPaneDef));
        }
        return new Success(newPaneDef);
    }
    get dialogHandle() {
        return this._dialogRedirection.dialogHandle;
    }
    get dialogRedirection() {
        return this._dialogRedirection;
    }
    get entityRecDef() {
        return this._entityRecDef;
    }
    findTitle() {
        var result = this._title ? this._title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            result = this._label ? this._label.trim() : '';
            result = result === 'null' ? '' : result;
        }
        return result;
    }
    get label() {
        return this._label;
    }
    get menuDefs() {
        return this._menuDefs;
    }
    get name() {
        return this._name;
    }
    get paneId() {
        return this._paneId;
    }
    get settings() {
        return this._settings;
    }
    get title() {
        return this._title;
    }
}
/**
 * *********************************
 */
export class BarcodeScanDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
}
/**
 * *********************************
 */
export class CalendarDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._initialStyle = _initialStyle;
        this._startDatePropName = _startDatePropName;
        this._startTimePropName = _startTimePropName;
        this._endDatePropName = _endDatePropName;
        this._endTimePropName = _endTimePropName;
        this._occurDatePropName = _occurDatePropName;
        this._occurTimePropName = _occurTimePropName;
        this._defaultActionId = _defaultActionId;
    }
    get descriptionPropName() {
        return this._descriptionPropName;
    }
    get initialStyle() {
        return this._initialStyle;
    }
    get startDatePropName() {
        return this._startDatePropName;
    }
    get startTimePropName() {
        return this._startTimePropName;
    }
    get endDatePropName() {
        return this._endDatePropName;
    }
    get endTimePropName() {
        return this._endTimePropName;
    }
    get occurDatePropName() {
        return this._occurDatePropName;
    }
    get occurTimePropName() {
        return this._occurTimePropName;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
}
/**
 * *********************************
 */
export class DetailsDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _cancelButtonText, _commitButtonText, _editable, _focusPropName, _graphicalMarkup, _rows) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._cancelButtonText = _cancelButtonText;
        this._commitButtonText = _commitButtonText;
        this._editable = _editable;
        this._focusPropName = _focusPropName;
        this._graphicalMarkup = _graphicalMarkup;
        this._rows = _rows;
    }
    get cancelButtonText() {
        return this._cancelButtonText;
    }
    get commitButtonText() {
        return this._commitButtonText;
    }
    get editable() {
        return this._editable;
    }
    get focusPropName() {
        return this._focusPropName;
    }
    get graphicalMarkup() {
        return this._graphicalMarkup;
    }
    get rows() {
        return this._rows;
    }
}
/**
 * *********************************
 */
export class FormDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _formLayout, _formStyle, _borderStyle, _headerDef, _childrenDefs) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._formLayout = _formLayout;
        this._formStyle = _formStyle;
        this._borderStyle = _borderStyle;
        this._headerDef = _headerDef;
        this._childrenDefs = _childrenDefs;
    }
    static fromOpenFormResult(formXOpenResult, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs) {
        var settings = { 'open': true };
        ObjUtil.addAllProps(formXOpenResult.formRedirection.dialogProperties, settings);
        var headerDef = null;
        var childrenDefs = [];
        for (var i = 0; i < childrenXOpens.length; i++) {
            var childXOpen = childrenXOpens[i];
            var childXPaneDef = childrenXPaneDefs[i];
            var childXActiveColDefs = childrenXActiveColDefs[i];
            var childMenuDefs = childrenMenuDefs[i];
            var childXComp = formXOpenResult.formModel.children[i];
            var childXPaneDefRef = formXFormDef.paneDefRefs[i];
            var paneDefTry = PaneDef.fromOpenPaneResult(childXOpen, childXComp, childXPaneDefRef, childXPaneDef, childXActiveColDefs, childMenuDefs);
            if (paneDefTry.isFailure) {
                return new Failure(paneDefTry.failure);
            }
            else {
                childrenDefs.push(paneDefTry.success);
            }
        }
        return new Success(new FormDef(formXFormDef.paneId, formXFormDef.name, formXOpenResult.formModel.form.label, formXFormDef.title, formMenuDefs, formXOpenResult.entityRecDef, formXOpenResult.formRedirection, settings, formXFormDef.formLayout, formXFormDef.formStyle, formXFormDef.borderStyle, headerDef, childrenDefs));
    }
    get borderStyle() {
        return this._borderStyle;
    }
    get childrenDefs() {
        return this._childrenDefs;
    }
    get formLayout() {
        return this._formLayout;
    }
    get formStyle() {
        return this._formStyle;
    }
    get headerDef() {
        return this._headerDef;
    }
    get isFlowingLayout() {
        return this.formLayout && this.formLayout === 'FLOWING';
    }
    get isFlowingTopDownLayout() {
        return this.formLayout && this.formLayout === 'FLOWING_TOP_DOWN';
    }
    get isFourBoxSquareLayout() {
        return this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE';
    }
    get isHorizontalLayout() {
        return this.formLayout && this.formLayout === 'H';
    }
    get isOptionsFormLayout() {
        return this.formLayout && this.formLayout === 'OPTIONS_FORM';
    }
    get isTabsLayout() {
        return this.formLayout && this.formLayout === 'TABS';
    }
    get isThreeBoxOneLeftLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_LEFT';
    }
    get isThreeBoxOneOverLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_OVER';
    }
    get isThreeBoxOneRightLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_RIGHT';
    }
    get isThreeBoxOneUnderLayout() {
        return this.formLayout && this.formLayout === 'THREE_ONE_UNDER';
    }
    get isTopDownLayout() {
        return this.formLayout && this.formLayout === 'TOP_DOWN';
    }
    get isTwoVerticalLayout() {
        return this.formLayout && this.formLayout === 'H(2,V)';
    }
}
/**
 * *********************************
 */
export class GeoFixDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
}
/**
 * *********************************
 */
export class GeoLocationDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
}
/**
 * *********************************
 */
export class GraphDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _graphType, _identityDataPointDef, _groupingDataPointDef, _dataPointDefs, _filterDataPointDefs, _sampleModel) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._graphType = _graphType;
        this._identityDataPointDef = _identityDataPointDef;
        this._groupingDataPointDef = _groupingDataPointDef;
        this._dataPointDefs = _dataPointDefs;
        this._filterDataPointDefs = _filterDataPointDefs;
        this._sampleModel = _sampleModel;
    }
    get dataPointDefs() {
        return this._dataPointDefs;
    }
    get filterDataPointDefs() {
        return this._filterDataPointDefs;
    }
    get identityDataPointDef() {
        return this._identityDataPointDef;
    }
    get groupingDataPointDef() {
        return this._groupingDataPointDef;
    }
    get sampleModel() {
        return this._sampleModel;
    }
}
/**
 * *********************************
 */
export class ImagePickerDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _URLPropName, _defaultActionId) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._URLPropName = _URLPropName;
        this._defaultActionId = _defaultActionId;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
    get URLPropName() {
        return this._URLPropName;
    }
}
/**
 * *********************************
 */
export class ListDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _style, _initialColumns, _activeColumnDefs, _columnsStyle, _defaultActionId, _graphicalMarkup) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._style = _style;
        this._initialColumns = _initialColumns;
        this._activeColumnDefs = _activeColumnDefs;
        this._columnsStyle = _columnsStyle;
        this._defaultActionId = _defaultActionId;
        this._graphicalMarkup = _graphicalMarkup;
    }
    get activeColumnDefs() {
        return this._activeColumnDefs;
    }
    get columnsStyle() {
        return this._columnsStyle;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
    get graphicalMarkup() {
        return this._graphicalMarkup;
    }
    get initialColumns() {
        return this._initialColumns;
    }
    get isDefaultStyle() {
        return this.style && this.style === 'DEFAULT';
    }
    get isDetailsFormStyle() {
        return this.style && this.style === 'DETAILS_FORM';
    }
    get isFormStyle() {
        return this.style && this.style === 'FORM';
    }
    get isTabularStyle() {
        return this.style && this.style === 'TABULAR';
    }
    get style() {
        return this._style;
    }
}
/**
 * *********************************
 */
export class MapDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _streetPropName, _cityPropName, _statePropName, _postalCodePropName, _latitudePropName, _longitudePropName) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._streetPropName = _streetPropName;
        this._cityPropName = _cityPropName;
        this._statePropName = _statePropName;
        this._postalCodePropName = _postalCodePropName;
        this._latitudePropName = _latitudePropName;
        this._longitudePropName = _longitudePropName;
    }
    get cityPropName() {
        return this._cityPropName;
    }
    get descriptionPropName() {
        return this._descriptionPropName;
    }
    get latitudePropName() {
        return this._latitudePropName;
    }
    get longitudePropName() {
        return this._longitudePropName;
    }
    get postalCodePropName() {
        return this._postalCodePropName;
    }
    get statePropName() {
        return this._statePropName;
    }
    get streetPropName() {
        return this._streetPropName;
    }
}
/**
 * *********************************
 */
export class BinaryRef {
    constructor(_settings) {
        this._settings = _settings;
    }
    static fromWSValue(encodedValue, settings) {
        if (encodedValue && encodedValue.length > 0) {
            return new Success(new InlineBinaryRef(encodedValue, settings));
        }
        else {
            return new Success(new ObjectBinaryRef(settings));
        }
    }
    get settings() {
        return this._settings;
    }
}
export class InlineBinaryRef extends BinaryRef {
    constructor(_inlineData, settings) {
        super(settings);
        this._inlineData = _inlineData;
    }
    /* Base64 encoded data */
    get inlineData() {
        return this._inlineData;
    }
}
export class ObjectBinaryRef extends BinaryRef {
    constructor(settings) {
        super(settings);
    }
}
/**
 * *********************************
 */
export class Redirection {
    static fromWS(otype, jsonObj) {
        if (jsonObj && jsonObj['webURL']) {
            return OType.deserializeObject(jsonObj, 'WSWebRedirection', OType.factoryFn);
        }
        else if (jsonObj && jsonObj['workbenchId']) {
            return OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
        }
        else {
            return OType.deserializeObject(jsonObj, 'WSDialogRedirection', OType.factoryFn);
        }
    }
}
/**
 * *********************************
 */
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
/**
 * *********************************
 */
export class NullRedirection extends Redirection {
    constructor(fromDialogProperties) {
        super();
        this.fromDialogProperties = fromDialogProperties;
    }
}
/**
 * *********************************
 */
export class WebRedirection extends Redirection {
    constructor(_webURL, _open, _dialogProperties, _fromDialogProperties) {
        super();
        this._webURL = _webURL;
        this._open = _open;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    get fromDialogProperties() {
        return this._fromDialogProperties;
    }
    set fromDialogProperties(props) {
        this._fromDialogProperties = props;
    }
}
/**
 * *********************************
 */
export class WorkbenchRedirection extends Redirection {
    constructor(_workbenchId, _dialogProperties, _fromDialogProperties) {
        super();
        this._workbenchId = _workbenchId;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    get workbenchId() {
        return this._workbenchId;
    }
    get dialogProperties() {
        return this._dialogProperties;
    }
    get fromDialogProperties() {
        return this._fromDialogProperties;
    }
    set fromDialogProperties(props) {
        this._fromDialogProperties = props;
    }
}
export class EntityRecUtil {
    static newEntityRec(objectId, props, annos) {
        return annos ? new EntityRecImpl(objectId, props, annos) : new EntityRecImpl(objectId, props);
    }
    static union(l1, l2) {
        var result = ArrayUtil.copy(l1);
        l2.forEach((p2) => {
            if (!l1.some((p1, i) => {
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
    static fromWSEditorRecord(otype, jsonObj) {
        var objectId = jsonObj['objectId'];
        var namesJson = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new Failure('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new Failure('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw = propsJson['values'];
        var propsTry = Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure)
            return new Failure(propsTry.failure);
        var props = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure)
                return new Failure(annotatedPropsTry.failure);
        }
        var recAnnos = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry = DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure)
                return new Failure(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new Success(new EntityRecImpl(objectId, props, recAnnos));
    }
}
/**
 * *********************************
 */
export class EntityBuffer {
    constructor(_before, _after) {
        this._before = _before;
        this._after = _after;
        if (!_before)
            throw new Error('_before is null in EntityBuffer');
        if (!_after)
            this._after = _before;
    }
    static createEntityBuffer(objectId, before, after) {
        return new EntityBuffer(EntityRecUtil.newEntityRec(objectId, before), EntityRecUtil.newEntityRec(objectId, after));
    }
    get after() {
        return this._after;
    }
    get annos() {
        return this._after.annos;
    }
    annosAtName(propName) {
        return this._after.annosAtName(propName);
    }
    afterEffects(afterAnother) {
        if (afterAnother) {
            return this._after.afterEffects(afterAnother);
        }
        else {
            return this._before.afterEffects(this._after);
        }
    }
    get backgroundColor() {
        return this._after.backgroundColor;
    }
    backgroundColorFor(propName) {
        return this._after.backgroundColorFor(propName);
    }
    get before() {
        return this._before;
    }
    get foregroundColor() {
        return this._after.foregroundColor;
    }
    foregroundColorFor(propName) {
        return this._after.foregroundColorFor(propName);
    }
    get imageName() {
        return this._after.imageName;
    }
    imageNameFor(propName) {
        return this._after.imageNameFor(propName);
    }
    get imagePlacement() {
        return this._after.imagePlacement;
    }
    imagePlacementFor(propName) {
        return this._after.imagePlacement;
    }
    get isBoldText() {
        return this._after.isBoldText;
    }
    isBoldTextFor(propName) {
        return this._after.isBoldTextFor(propName);
    }
    isChanged(name) {
        var before = this._before.propAtName(name);
        var after = this._after.propAtName(name);
        return (before && after) ? !before.equals(after) : !(!before && !after);
    }
    get isItalicText() {
        return this._after.isItalicText;
    }
    isItalicTextFor(propName) {
        return this._after.isItalicTextFor(propName);
    }
    get isPlacementCenter() {
        return this._after.isPlacementCenter;
    }
    isPlacementCenterFor(propName) {
        return this._after.isPlacementCenterFor(propName);
    }
    get isPlacementLeft() {
        return this._after.isPlacementLeft;
    }
    isPlacementLeftFor(propName) {
        return this._after.isPlacementLeftFor(propName);
    }
    get isPlacementRight() {
        return this._after.isPlacementRight;
    }
    isPlacementRightFor(propName) {
        return this._after.isPlacementRightFor(propName);
    }
    get isPlacementStretchUnder() {
        return this._after.isPlacementStretchUnder;
    }
    isPlacementStretchUnderFor(propName) {
        return this._after.isPlacementStretchUnderFor(propName);
    }
    get isPlacementUnder() {
        return this._after.isPlacementUnder;
    }
    isPlacementUnderFor(propName) {
        return this._after.isPlacementUnderFor(propName);
    }
    get isUnderline() {
        return this._after.isUnderline;
    }
    isUnderlineFor(propName) {
        return this._after.isUnderlineFor(propName);
    }
    get objectId() {
        return this._after.objectId;
    }
    get overrideText() {
        return this._after.overrideText;
    }
    overrideTextFor(propName) {
        return this._after.overrideTextFor(propName);
    }
    propAtIndex(index) {
        return this.props[index];
    }
    propAtName(propName) {
        return this._after.propAtName(propName);
    }
    get propCount() {
        return this._after.propCount;
    }
    get propNames() {
        return this._after.propNames;
    }
    get props() {
        return this._after.props;
    }
    get propValues() {
        return this._after.propValues;
    }
    setValue(name, value) {
        this.props.some((prop) => {
            if (prop.name === name) {
                prop.value = value;
                return true;
            }
            return false;
        });
    }
    get tipText() {
        return this._after.tipText;
    }
    tipTextFor(propName) {
        return this._after.tipTextFor(propName);
    }
    toEntityRec() {
        return EntityRecUtil.newEntityRec(this.objectId, this.props);
    }
    toWSEditorRecord() {
        return this.afterEffects().toWSEditorRecord();
    }
    toWS() {
        return this.afterEffects().toWS();
    }
    valueAtName(propName) {
        return this._after.valueAtName(propName);
    }
}
/**
 * *********************************
 */
export class EntityRecImpl {
    constructor(objectId, props = [], annos = []) {
        this.objectId = objectId;
        this.props = props;
        this.annos = annos;
    }
    annosAtName(propName) {
        var p = this.propAtName(propName);
        return p ? p.annos : [];
    }
    afterEffects(after) {
        var effects = [];
        after.props.forEach((afterProp) => {
            var beforeProp = this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new EntityRecImpl(after.objectId, effects);
    }
    get backgroundColor() {
        return DataAnno.backgroundColor(this.annos);
    }
    backgroundColorFor(propName) {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    }
    get foregroundColor() {
        return DataAnno.foregroundColor(this.annos);
    }
    foregroundColorFor(propName) {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    }
    get imageName() {
        return DataAnno.imageName(this.annos);
    }
    imageNameFor(propName) {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    }
    get imagePlacement() {
        return DataAnno.imagePlacement(this.annos);
    }
    imagePlacementFor(propName) {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    }
    get isBoldText() {
        return DataAnno.isBoldText(this.annos);
    }
    isBoldTextFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    }
    get isItalicText() {
        return DataAnno.isItalicText(this.annos);
    }
    isItalicTextFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;
    }
    get isPlacementCenter() {
        return DataAnno.isPlacementCenter(this.annos);
    }
    isPlacementCenterFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    }
    get isPlacementLeft() {
        return DataAnno.isPlacementLeft(this.annos);
    }
    isPlacementLeftFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;
    }
    get isPlacementRight() {
        return DataAnno.isPlacementRight(this.annos);
    }
    isPlacementRightFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    }
    get isPlacementStretchUnder() {
        return DataAnno.isPlacementStretchUnder(this.annos);
    }
    isPlacementStretchUnderFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    }
    get isPlacementUnder() {
        return DataAnno.isPlacementUnder(this.annos);
    }
    isPlacementUnderFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    }
    get isUnderline() {
        return DataAnno.isUnderlineText(this.annos);
    }
    isUnderlineFor(propName) {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;
    }
    get overrideText() {
        return DataAnno.overrideText(this.annos);
    }
    overrideTextFor(propName) {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;
    }
    propAtIndex(index) {
        return this.props[index];
    }
    propAtName(propName) {
        var prop = null;
        this.props.some((p) => {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    }
    get propCount() {
        return this.props.length;
    }
    get propNames() {
        return this.props.map((p) => {
            return p.name;
        });
    }
    get propValues() {
        return this.props.map((p) => {
            return p.value;
        });
    }
    get tipText() {
        return DataAnno.tipText(this.annos);
    }
    tipTextFor(propName) {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;
    }
    toEntityRec() {
        return this;
    }
    toWSEditorRecord() {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    }
    toWS() {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos)
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    }
    valueAtName(propName) {
        var value = null;
        this.props.some((p) => {
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
export class NullEntityRec {
    constructor() {
    }
    get annos() {
        return [];
    }
    annosAtName(propName) {
        return [];
    }
    afterEffects(after) {
        return after;
    }
    get backgroundColor() {
        return null;
    }
    backgroundColorFor(propName) {
        return null;
    }
    get foregroundColor() {
        return null;
    }
    foregroundColorFor(propName) {
        return null;
    }
    get imageName() {
        return null;
    }
    imageNameFor(propName) {
        return null;
    }
    get imagePlacement() {
        return null;
    }
    imagePlacementFor(propName) {
        return null;
    }
    get isBoldText() {
        return false;
    }
    isBoldTextFor(propName) {
        return false;
    }
    get isItalicText() {
        return false;
    }
    isItalicTextFor(propName) {
        return false;
    }
    get isPlacementCenter() {
        return false;
    }
    isPlacementCenterFor(propName) {
        return false;
    }
    get isPlacementLeft() {
        return false;
    }
    isPlacementLeftFor(propName) {
        return false;
    }
    get isPlacementRight() {
        return false;
    }
    isPlacementRightFor(propName) {
        return false;
    }
    get isPlacementStretchUnder() {
        return false;
    }
    isPlacementStretchUnderFor(propName) {
        return false;
    }
    get isPlacementUnder() {
        return false;
    }
    isPlacementUnderFor(propName) {
        return false;
    }
    get isUnderline() {
        return false;
    }
    isUnderlineFor(propName) {
        return false;
    }
    get objectId() {
        return null;
    }
    get overrideText() {
        return null;
    }
    overrideTextFor(propName) {
        return null;
    }
    propAtIndex(index) {
        return null;
    }
    propAtName(propName) {
        return null;
    }
    get propCount() {
        return 0;
    }
    get propNames() {
        return [];
    }
    get props() {
        return [];
    }
    get propValues() {
        return [];
    }
    get tipText() {
        return null;
    }
    tipTextFor(propName) {
        return null;
    }
    toEntityRec() {
        return this;
    }
    toWSEditorRecord() {
        var result = { 'WS_OTYPE': 'WSEditorRecord' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['names'] = Prop.toWSListOfString(this.propNames);
        result['properties'] = Prop.toWSListOfProperties(this.propValues);
        return result;
    }
    toWS() {
        var result = { 'WS_OTYPE': 'WSEntityRec' };
        if (this.objectId)
            result['objectId'] = this.objectId;
        result['props'] = Prop.toListOfWSProp(this.props);
        if (this.annos)
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    }
    valueAtName(propName) {
        return null;
    }
}
NullEntityRec.singleton = new NullEntityRec();
/**
 * *********************************
 */
var AppContextState;
(function (AppContextState) {
    AppContextState[AppContextState["LOGGED_OUT"] = 0] = "LOGGED_OUT";
    AppContextState[AppContextState["LOGGED_IN"] = 1] = "LOGGED_IN";
})(AppContextState || (AppContextState = {}));
class AppContextValues {
    constructor(sessionContext, appWinDef, tenantSettings) {
        this.sessionContext = sessionContext;
        this.appWinDef = appWinDef;
        this.tenantSettings = tenantSettings;
    }
}
export class AppContext {
    constructor() {
        if (AppContext._singleton) {
            throw new Error("Singleton instance already created");
        }
        this._deviceProps = [];
        this.setAppContextStateToLoggedOut();
        AppContext._singleton = this;
    }
    static get defaultTTLInMillis() {
        return AppContext.ONE_DAY_IN_MILLIS;
    }
    static get singleton() {
        if (!AppContext._singleton) {
            AppContext._singleton = new AppContext();
        }
        return AppContext._singleton;
    }
    get appWinDefTry() {
        return this._appWinDefTry;
    }
    get deviceProps() {
        return this._deviceProps;
    }
    get isLoggedIn() {
        return this._appContextState === AppContextState.LOGGED_IN;
    }
    getWorkbench(sessionContext, workbenchId) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::getWorkbench", "User is logged out");
        }
        return WorkbenchService.getWorkbench(sessionContext, workbenchId);
    }
    login(gatewayHost, tenantId, clientType, userId, password) {
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture("AppContext::login", "User is already logged in");
        }
        var answer;
        var appContextValuesFr = this.loginOnline(gatewayHost, tenantId, clientType, userId, password, this.deviceProps);
        return appContextValuesFr.bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    }
    loginDirectly(url, tenantId, clientType, userId, password) {
        if (this._appContextState === AppContextState.LOGGED_IN) {
            return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged in");
        }
        return this.loginFromSystemContext(new SystemContextImpl(url), tenantId, userId, password, this.deviceProps, clientType).bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::loginDirectly', appContextValues.appWinDef);
        });
    }
    logout() {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::loginDirectly", "User is already logged out");
        }
        var result = SessionService.deleteSession(this.sessionContextTry.success);
        result.onComplete(deleteSessionTry => {
            if (deleteSessionTry.isFailure) {
                Log.error('Error while logging out: ' + ObjUtil.formatRecAttr(deleteSessionTry.failure));
            }
        });
        this.setAppContextStateToLoggedOut();
        return result;
    }
    performLaunchAction(launchAction) {
        if (this._appContextState === AppContextState.LOGGED_OUT) {
            return Future.createFailedFuture("AppContext::performLaunchAction", "User is logged out");
        }
        return this.performLaunchActionOnline(launchAction, this.sessionContextTry.success);
    }
    refreshContext(sessionContext, deviceProps = []) {
        var appContextValuesFr = this.finalizeContext(sessionContext, deviceProps);
        return appContextValuesFr.bind((appContextValues) => {
            this.setAppContextStateToLoggedIn(appContextValues);
            return Future.createSuccessfulFuture('AppContext::login', appContextValues.appWinDef);
        });
    }
    get sessionContextTry() {
        return this._sessionContextTry;
    }
    get tenantSettingsTry() {
        return this._tenantSettingsTry;
    }
    finalizeContext(sessionContext, deviceProps) {
        var devicePropName = "com.catavolt.session.property.DeviceProperties";
        return SessionService.setSessionListProperty(devicePropName, deviceProps, sessionContext).bind((setPropertyListResult) => {
            var listPropName = "com.catavolt.session.property.TenantProperties";
            return SessionService.getSessionListProperty(listPropName, sessionContext).bind((listPropertyResult) => {
                return WorkbenchService.getAppWinDef(sessionContext).bind((appWinDef) => {
                    return Future.createSuccessfulFuture("AppContextCore:loginFromSystemContext", new AppContextValues(sessionContext, appWinDef, listPropertyResult.valuesAsDictionary()));
                });
            });
        });
    }
    loginOnline(gatewayHost, tenantId, clientType, userId, password, deviceProps) {
        var systemContextFr = this.newSystemContextFr(gatewayHost, tenantId);
        return systemContextFr.bind((sc) => {
            return this.loginFromSystemContext(sc, tenantId, userId, password, deviceProps, clientType);
        });
    }
    loginFromSystemContext(systemContext, tenantId, userId, password, deviceProps, clientType) {
        var sessionContextFuture = SessionService.createSession(tenantId, userId, password, clientType, systemContext);
        return sessionContextFuture.bind((sessionContext) => {
            return this.finalizeContext(sessionContext, deviceProps);
        });
    }
    newSystemContextFr(gatewayHost, tenantId) {
        var serviceEndpoint = GatewayService.getServiceEndpoint(tenantId, 'soi-json', gatewayHost);
        return serviceEndpoint.map((serviceEndpoint) => {
            return new SystemContextImpl(serviceEndpoint.serverAssignment);
        });
    }
    performLaunchActionOnline(launchAction, sessionContext) {
        var redirFr = WorkbenchService.performLaunchAction(launchAction.id, launchAction.workbenchId, sessionContext);
        return redirFr.bind((r) => {
            return NavRequestUtil.fromRedirection(r, launchAction, sessionContext);
        });
    }
    setAppContextStateToLoggedIn(appContextValues) {
        this._appWinDefTry = new Success(appContextValues.appWinDef);
        this._tenantSettingsTry = new Success(appContextValues.tenantSettings);
        this._sessionContextTry = new Success(appContextValues.sessionContext);
        this._appContextState = AppContextState.LOGGED_IN;
    }
    setAppContextStateToLoggedOut() {
        this._appWinDefTry = new Failure("Not logged in");
        this._tenantSettingsTry = new Failure('Not logged in"');
        this._sessionContextTry = new Failure('Not loggged in');
        this._appContextState = AppContextState.LOGGED_OUT;
    }
}
AppContext.ONE_DAY_IN_MILLIS = 60 * 60 * 24 * 1000;
/**
 * *********************************
 */
export class AppWinDef {
    constructor(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }
    get appVendors() {
        return this._applicationVendors;
    }
    get windowHeight() {
        return this._windowHeight;
    }
    get windowTitle() {
        return this._windowTitle;
    }
    get windowWidth() {
        return this._windowWidth;
    }
    get workbenches() {
        return this._workbenches;
    }
}
/**
 * *********************************
 */
/*
 @TODO

 Test all of the deserialization methods
 They should all be handled, but the cover many of the edge cases (i.e. List<List<CellDef>>)
 */
export class CellDef {
    constructor(_values) {
        this._values = _values;
    }
    get values() {
        return this._values;
    }
}
/**
 * *********************************
 */
export class CodeRef {
    constructor(_code, _description) {
        this._code = _code;
        this._description = _description;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new CodeRef(pair[0], pair[1]);
    }
    get code() {
        return this._code;
    }
    get description() {
        return this._description;
    }
    toString() {
        return this.code + ":" + this.description;
    }
}
/**
 * *********************************
 */
export class ColumnDef {
    constructor(_name, _heading, _propertyDef) {
        this._name = _name;
        this._heading = _heading;
        this._propertyDef = _propertyDef;
    }
    get heading() {
        return this._heading;
    }
    get isInlineMediaStyle() {
        return this._propertyDef.isInlineMediaStyle;
    }
    get name() {
        return this._name;
    }
    get propertyDef() {
        return this._propertyDef;
    }
}
/**
 * *********************************
 */
export class ContextAction {
    constructor(actionId, objectId, fromActionSource) {
        this.actionId = actionId;
        this.objectId = objectId;
        this.fromActionSource = fromActionSource;
    }
    get virtualPathSuffix() {
        return [this.objectId, this.actionId];
    }
}
/**
 * *********************************
 */
export class DataAnno {
    constructor(_name, _value) {
        this._name = _name;
        this._value = _value;
    }
    static annotatePropsUsingWSDataAnnotation(props, jsonObj) {
        return DialogTriple.fromListOfWSDialogObject(jsonObj, 'WSDataAnnotation', OType.factoryFn).bind((propAnnos) => {
            var annotatedProps = [];
            for (var i = 0; i < props.length; i++) {
                var p = props[i];
                var annos = propAnnos[i];
                if (annos) {
                    annotatedProps.push(new Prop(p.name, p.value, annos));
                }
                else {
                    annotatedProps.push(p);
                }
            }
            return new Success(annotatedProps);
        });
    }
    static backgroundColor(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    }
    static foregroundColor(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    }
    static fromWS(otype, jsonObj) {
        var stringObj = jsonObj['annotations'];
        if (stringObj['WS_LTYPE'] !== 'String') {
            return new Failure('DataAnno:fromWS: expected WS_LTYPE of String but found ' + stringObj['WS_LTYPE']);
        }
        var annoStrings = stringObj['values'];
        var annos = [];
        for (var i = 0; i < annoStrings.length; i++) {
            annos.push(DataAnno.parseString(annoStrings[i]));
        }
        return new Success(annos);
    }
    static imageName(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isImageName;
        });
        return result ? result.value : null;
    }
    static imagePlacement(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    }
    static isBoldText(annos) {
        return annos.some((anno) => {
            return anno.isBoldText;
        });
    }
    static isItalicText(annos) {
        return annos.some((anno) => {
            return anno.isItalicText;
        });
    }
    static isPlacementCenter(annos) {
        return annos.some((anno) => {
            return anno.isPlacementCenter;
        });
    }
    static isPlacementLeft(annos) {
        return annos.some((anno) => {
            return anno.isPlacementLeft;
        });
    }
    static isPlacementRight(annos) {
        return annos.some((anno) => {
            return anno.isPlacementRight;
        });
    }
    static isPlacementStretchUnder(annos) {
        return annos.some((anno) => {
            return anno.isPlacementStretchUnder;
        });
    }
    static isPlacementUnder(annos) {
        return annos.some((anno) => {
            return anno.isPlacementUnder;
        });
    }
    static isUnderlineText(annos) {
        return annos.some((anno) => {
            return anno.isUnderlineText;
        });
    }
    static overrideText(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    }
    static tipText(annos) {
        var result = ArrayUtil.find(annos, (anno) => {
            return anno.isTipText;
        });
        return result ? result.value : null;
    }
    static toListOfWSDataAnno(annos) {
        var result = { 'WS_LTYPE': 'WSDataAnno' };
        var values = [];
        annos.forEach((anno) => {
            values.push(anno.toWS());
        });
        result['values'] = values;
        return result;
    }
    static parseString(formatted) {
        var pair = StringUtil.splitSimpleKeyValuePair(formatted);
        return new DataAnno(pair[0], pair[1]);
    }
    get backgroundColor() {
        return this.isBackgroundColor ? this.value : null;
    }
    get foregroundColor() {
        return this.isForegroundColor ? this.value : null;
    }
    equals(dataAnno) {
        return this.name === dataAnno.name;
    }
    get isBackgroundColor() {
        return this.name === DataAnno.BACKGROUND_COLOR;
    }
    get isBoldText() {
        return this.name === DataAnno.BOLD_TEXT && this.value === DataAnno.TRUE_VALUE;
    }
    get isForegroundColor() {
        return this.name === DataAnno.FOREGROUND_COLOR;
    }
    get isImageName() {
        return this.name === DataAnno.IMAGE_NAME;
    }
    get isImagePlacement() {
        return this.name === DataAnno.IMAGE_PLACEMENT;
    }
    get isItalicText() {
        return this.name === DataAnno.ITALIC_TEXT && this.value === DataAnno.TRUE_VALUE;
    }
    get isOverrideText() {
        return this.name === DataAnno.OVERRIDE_TEXT;
    }
    get isPlacementCenter() {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_CENTER;
    }
    get isPlacementLeft() {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_LEFT;
    }
    get isPlacementRight() {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_RIGHT;
    }
    get isPlacementStretchUnder() {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_STRETCH_UNDER;
    }
    get isPlacementUnder() {
        return this.isImagePlacement && this.value === DataAnno.PLACEMENT_UNDER;
    }
    get isTipText() {
        return this.name === DataAnno.TIP_TEXT;
    }
    get isUnderlineText() {
        return this.name === DataAnno.UNDERLINE && this.value === DataAnno.TRUE_VALUE;
    }
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    toWS() {
        return { 'WS_OTYPE': 'WSDataAnno', 'name': this.name, 'value': this.value };
    }
}
DataAnno.BOLD_TEXT = "BOLD_TEXT";
DataAnno.BACKGROUND_COLOR = "BGND_COLOR";
DataAnno.FOREGROUND_COLOR = "FGND_COLOR";
DataAnno.IMAGE_NAME = "IMAGE_NAME";
DataAnno.IMAGE_PLACEMENT = "IMAGE_PLACEMENT";
DataAnno.ITALIC_TEXT = "ITALIC_TEXT";
DataAnno.OVERRIDE_TEXT = "OVRD_TEXT";
DataAnno.TIP_TEXT = "TIP_TEXT";
DataAnno.UNDERLINE = "UNDERLINE";
DataAnno.TRUE_VALUE = "1";
DataAnno.PLACEMENT_CENTER = "CENTER";
DataAnno.PLACEMENT_LEFT = "LEFT";
DataAnno.PLACEMENT_RIGHT = "RIGHT";
DataAnno.PLACEMENT_UNDER = "UNDER";
DataAnno.PLACEMENT_STRETCH_UNDER = "STRETCH_UNDER";
/**
 * *********************************
 */
export class DialogHandle {
    constructor(handleValue, sessionHandle) {
        this.handleValue = handleValue;
        this.sessionHandle = sessionHandle;
    }
}
/**
 * *********************************
 */
export class DialogService {
    static changePaneMode(dialogHandle, paneMode, sessionContext) {
        var method = 'changePaneMode';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'paneMode': PaneMode[paneMode]
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('changePaneMode', DialogTriple.fromWSDialogObject(result, 'WSChangePaneModeResult', OType.factoryFn));
        });
    }
    static closeEditorModel(dialogHandle, sessionContext) {
        var method = 'close';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture('closeEditorModel', result);
        });
    }
    static getAvailableValues(dialogHandle, propertyName, pendingWrites, sessionContext) {
        var method = 'getAvailableValues';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getAvailableValues', DialogTriple.fromWSDialogObject(result, 'WSGetAvailableValuesResult', OType.factoryFn));
        });
    }
    static getActiveColumnDefs(dialogHandle, sessionContext) {
        var method = 'getActiveColumnDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getActiveColumnDefs', DialogTriple.fromWSDialogObject(result, 'WSGetActiveColumnDefsResult', OType.factoryFn));
        });
    }
    static getEditorModelMenuDefs(dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getEditorModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    }
    static getEditorModelPaneDef(dialogHandle, paneId, sessionContext) {
        var method = 'getPaneDef';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        params['paneId'] = paneId;
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getEditorModelPaneDef', DialogTriple.fromWSDialogObjectResult(result, 'WSGetPaneDefResult', 'WSPaneDef', 'paneDef', OType.factoryFn));
        });
    }
    static getQueryModelMenuDefs(dialogHandle, sessionContext) {
        var method = 'getMenuDefs';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('getQueryModelMenuDefs', DialogTriple.fromWSDialogObjectsResult(result, 'WSGetMenuDefsResult', 'WSMenuDef', 'menuDefs', OType.factoryFn));
        });
    }
    static openEditorModelFromRedir(redirection, sessionContext) {
        var method = 'open2';
        var params = {
            'editorMode': redirection.dialogMode,
            'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle')
        };
        if (redirection.objectId)
            params['objectId'] = redirection.objectId;
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('openEditorModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenEditorModelResult', OType.factoryFn));
        });
    }
    static openQueryModelFromRedir(redirection, sessionContext) {
        if (!redirection.isQuery)
            return Future.createFailedFuture('DialogService::openQueryModelFromRedir', 'Redirection must be a query');
        var method = 'open';
        var params = { 'dialogHandle': OType.serializeObject(redirection.dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('openQueryModelFromRedir', DialogTriple.fromWSDialogObject(result, 'WSOpenQueryModelResult', OType.factoryFn));
        });
    }
    static performEditorAction(dialogHandle, actionId, pendingWrites, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (pendingWrites)
            params['pendingWrites'] = pendingWrites.toWSEditorRecord();
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performEditorAction', redirectionTry);
        });
    }
    static performQueryAction(dialogHandle, actionId, targets, sessionContext) {
        var method = 'performAction';
        var params = {
            'actionId': actionId,
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle')
        };
        if (targets) {
            params['targets'] = targets;
        }
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var redirectionTry = DialogTriple.extractRedirection(result, 'WSPerformActionResult');
            if (redirectionTry.isSuccess) {
                var r = redirectionTry.success;
                r.fromDialogProperties = result['dialogProperties'];
                redirectionTry = new Success(r);
            }
            return Future.createCompletedFuture('performQueryAction', redirectionTry);
        });
    }
    static processSideEffects(dialogHandle, sessionContext, propertyName, propertyValue, pendingWrites) {
        var method = 'handlePropertyChange';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'propertyName': propertyName,
            'propertyValue': Prop.toWSProperty(propertyValue),
            'pendingWrites': pendingWrites.toWSEditorRecord()
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('processSideEffects', DialogTriple.fromWSDialogObject(result, 'WSHandlePropertyChangeResult', OType.factoryFn));
        });
    }
    static queryQueryModel(dialogHandle, direction, maxRows, fromObjectId, sessionContext) {
        var method = 'query';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'maxRows': maxRows,
            'direction': direction === QueryDirection.BACKWARD ? 'BACKWARD' : 'FORWARD'
        };
        if (fromObjectId && fromObjectId.trim() !== '') {
            params['fromObjectId'] = fromObjectId.trim();
        }
        Log.info('Running query');
        var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var call = Call.createCall(DialogService.QUERY_SERVICE_PATH, method, params, sessionContext);
            return Future.createCompletedFuture('DialogService::queryQueryModel', DialogTriple.fromWSDialogObject(result, 'WSQueryResult', OType.factoryFn));
        });
    }
    static readEditorModel(dialogHandle, sessionContext) {
        var method = 'read';
        var params = { 'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle') };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture('readEditorModel', DialogTriple.fromWSDialogObject(result, 'WSReadResult', OType.factoryFn));
        });
    }
    static writeEditorModel(dialogHandle, entityRec, sessionContext) {
        var method = 'write';
        var params = {
            'dialogHandle': OType.serializeObject(dialogHandle, 'WSDialogHandle'),
            'editorRecord': entityRec.toWSEditorRecord()
        };
        var call = Call.createCall(DialogService.EDITOR_SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            var writeResultTry = DialogTriple.fromWSDialogObject(result, 'WSWriteResult', OType.factoryFn);
            if (writeResultTry.isSuccess && writeResultTry.success.isLeft) {
                var redirection = writeResultTry.success.left;
                redirection.fromDialogProperties = result['dialogProperties'] || {};
                writeResultTry = new Success(Either.left(redirection));
            }
            return Future.createCompletedFuture('writeEditorModel', writeResultTry);
        });
    }
}
DialogService.EDITOR_SERVICE_NAME = 'EditorService';
DialogService.EDITOR_SERVICE_PATH = 'soi-json-v02/' + DialogService.EDITOR_SERVICE_NAME;
DialogService.QUERY_SERVICE_NAME = 'QueryService';
DialogService.QUERY_SERVICE_PATH = 'soi-json-v02/' + DialogService.QUERY_SERVICE_NAME;
/**
 * *********************************
 */
export class DialogTriple {
    static extractList(jsonObject, Ltype, extractor) {
        var result;
        if (jsonObject) {
            var lt = jsonObject['WS_LTYPE'];
            if (Ltype === lt) {
                if (jsonObject['values']) {
                    var realValues = [];
                    var values = jsonObject['values'];
                    values.every((item) => {
                        var extdValue = extractor(item);
                        if (extdValue.isFailure) {
                            result = new Failure(extdValue.failure);
                            return false;
                        }
                        realValues.push(extdValue.success);
                        return true;
                    });
                    if (!result) {
                        result = new Success(realValues);
                    }
                }
                else {
                    result = new Failure("DialogTriple::extractList: Values array not found");
                }
            }
            else {
                result = new Failure("DialogTriple::extractList: Expected WS_LTYPE " + Ltype + " but found " + lt);
            }
        }
        return result;
    }
    static extractRedirection(jsonObject, Otype) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, false, () => {
            return new Success(new NullRedirection({}));
        });
        var answer;
        if (tripleTry.isSuccess) {
            var triple = tripleTry.success;
            answer = triple.isLeft ? new Success(triple.left) : new Success(triple.right);
        }
        else {
            answer = new Failure(tripleTry.failure);
        }
        return answer;
    }
    static extractTriple(jsonObject, Otype, extractor) {
        return DialogTriple._extractTriple(jsonObject, Otype, false, extractor);
    }
    static extractValue(jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, false, extractor);
    }
    static extractValueIgnoringRedirection(jsonObject, Otype, extractor) {
        return DialogTriple._extractValue(jsonObject, Otype, true, extractor);
    }
    static fromWSDialogObject(obj, Otype, factoryFn, ignoreRedirection = false) {
        if (!obj) {
            return new Failure('DialogTriple::fromWSDialogObject: Cannot extract from null value');
        }
        else if (typeof obj !== 'object') {
            return new Success(obj);
        }
        try {
            if (!factoryFn) {
                /* Assume we're just going to coerce the exiting object */
                return DialogTriple.extractValue(obj, Otype, () => {
                    return new Success(obj);
                });
            }
            else {
                if (ignoreRedirection) {
                    return DialogTriple.extractValueIgnoringRedirection(obj, Otype, () => {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
                else {
                    return DialogTriple.extractValue(obj, Otype, () => {
                        return OType.deserializeObject(obj, Otype, factoryFn);
                    });
                }
            }
        }
        catch (e) {
            return new Failure('DialogTriple::fromWSDialogObject: ' + e.name + ": " + e.message);
        }
    }
    static fromListOfWSDialogObject(jsonObject, Ltype, factoryFn, ignoreRedirection = false) {
        return DialogTriple.extractList(jsonObject, Ltype, (value) => {
            /*note - we could add a check here to make sure the otype 'is a' ltype, to enforce the generic constraint
             i.e. list items should be lype assignment compatible*/
            if (!value)
                return new Success(null);
            var Otype = value['WS_OTYPE'] || Ltype;
            return DialogTriple.fromWSDialogObject(value, Otype, factoryFn, ignoreRedirection);
        });
    }
    static fromWSDialogObjectResult(jsonObject, resultOtype, targetOtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, () => {
            return DialogTriple.fromWSDialogObject(jsonObject[objPropName], targetOtype, factoryFn);
        });
    }
    static fromWSDialogObjectsResult(jsonObject, resultOtype, targetLtype, objPropName, factoryFn) {
        return DialogTriple.extractValue(jsonObject, resultOtype, () => {
            return DialogTriple.fromListOfWSDialogObject(jsonObject[objPropName], targetLtype, factoryFn);
        });
    }
    static _extractTriple(jsonObject, Otype, ignoreRedirection, extractor) {
        if (!jsonObject) {
            return new Failure('DialogTriple::extractTriple: cannot extract object of WS_OTYPE ' + Otype + ' because json object is null');
        }
        else {
            if (Array.isArray(jsonObject)) {
                //verify we'll dealing with a nested List
                if (Otype.indexOf('List') !== 0) {
                    return new Failure("DialogTriple::extractTriple: expected OType of List<> for Array obj");
                }
            }
            else {
                var ot = jsonObject['WS_OTYPE'];
                if (!ot || Otype !== ot) {
                    return new Failure('DialogTriple:extractTriple: expected O_TYPE ' + Otype + ' but found ' + ot);
                }
                else {
                    if (jsonObject['exception']) {
                        var dialogException = jsonObject['exception'];
                        return new Failure(dialogException);
                    }
                    else if (jsonObject['redirection'] && !ignoreRedirection) {
                        var drt = DialogTriple.fromWSDialogObject(jsonObject['redirection'], 'WSRedirection', OType.factoryFn);
                        if (drt.isFailure) {
                            return new Failure(drt.failure);
                        }
                        else {
                            const either = Either.left(drt.success);
                            return new Success(either);
                        }
                    }
                }
            }
            var result;
            if (extractor) {
                var valueTry = extractor();
                if (valueTry.isFailure) {
                    result = new Failure(valueTry.failure);
                }
                else {
                    result = new Success(Either.right(valueTry.success));
                }
            }
            else {
                result = new Failure('DialogTriple::extractTriple: Triple is not an exception or redirection and no value extractor was provided');
            }
            return result;
        }
    }
    static _extractValue(jsonObject, Otype, ignoreRedirection, extractor) {
        var tripleTry = DialogTriple._extractTriple(jsonObject, Otype, ignoreRedirection, extractor);
        var result;
        if (tripleTry.isFailure) {
            result = new Failure(tripleTry.failure);
        }
        else {
            var triple = tripleTry.success;
            if (triple.isLeft) {
                result = new Failure('DialogTriple::extractValue: Unexpected redirection for O_TYPE: ' + Otype);
            }
            else {
                result = new Success(triple.right);
            }
        }
        return result;
    }
}
/**
 * *********************************
 */
var EditorState;
(function (EditorState) {
    EditorState[EditorState["READ"] = 0] = "READ";
    EditorState[EditorState["WRITE"] = 1] = "WRITE";
    EditorState[EditorState["DESTROYED"] = 2] = "DESTROYED";
})(EditorState || (EditorState = {}));
;
/**
 * *********************************
 */
export class EntityRecDef {
    constructor(_propDefs) {
        this._propDefs = _propDefs;
    }
    get propCount() {
        return this.propDefs.length;
    }
    propDefAtName(name) {
        var propDef = null;
        this.propDefs.some((p) => {
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
    get propDefs() {
        return this._propDefs;
    }
    set propDefs(propDefs) {
        this._propDefs = propDefs;
    }
    get propertyDefs() {
        return this._propDefs;
    }
    set propertyDefs(propDefs) {
        this._propDefs = propDefs;
    }
    get propNames() {
        return this.propDefs.map((p) => {
            return p.name;
        });
    }
}
/**
 * *********************************
 */
export class FormContextBuilder {
    constructor(_dialogRedirection, _actionSource, _sessionContext) {
        this._dialogRedirection = _dialogRedirection;
        this._actionSource = _actionSource;
        this._sessionContext = _sessionContext;
    }
    get actionSource() {
        return this._actionSource;
    }
    build() {
        if (!this.dialogRedirection.isEditor) {
            return Future.createFailedFuture('FormContextBuilder::build', 'Forms with a root query model are not supported');
        }
        var xOpenFr = DialogService.openEditorModelFromRedir(this._dialogRedirection, this.sessionContext);
        var openAllFr = xOpenFr.bind((formXOpen) => {
            var formXOpenFr = Future.createSuccessfulFuture('FormContext/open/openForm', formXOpen);
            var formXFormDefFr = this.fetchXFormDef(formXOpen);
            var formMenuDefsFr = DialogService.getEditorModelMenuDefs(formXOpen.formRedirection.dialogHandle, this.sessionContext);
            var formChildrenFr = formXFormDefFr.bind((xFormDef) => {
                var childrenXOpenFr = this.openChildren(formXOpen);
                var childrenXPaneDefsFr = this.fetchChildrenXPaneDefs(formXOpen, xFormDef);
                var childrenActiveColDefsFr = this.fetchChildrenActiveColDefs(formXOpen);
                var childrenMenuDefsFr = this.fetchChildrenMenuDefs(formXOpen);
                return Future.sequence([childrenXOpenFr, childrenXPaneDefsFr, childrenActiveColDefsFr, childrenMenuDefsFr]);
            });
            return Future.sequence([formXOpenFr, formXFormDefFr, formMenuDefsFr, formChildrenFr]);
        });
        return openAllFr.bind((value) => {
            var formDefTry = this.completeOpenPromise(value);
            var formContextTry = null;
            if (formDefTry.isFailure) {
                formContextTry = new Failure(formDefTry.failure);
            }
            else {
                var formDef = formDefTry.success;
                var childContexts = this.createChildrenContexts(formDef);
                var formContext = new FormContext(this.dialogRedirection, this._actionSource, formDef, childContexts, false, false, this.sessionContext);
                formContextTry = new Success(formContext);
            }
            return Future.createCompletedFuture('FormContextBuilder::build', formContextTry);
        });
    }
    get dialogRedirection() {
        return this._dialogRedirection;
    }
    get sessionContext() {
        return this._sessionContext;
    }
    completeOpenPromise(openAllResults) {
        var flattenedTry = Try.flatten(openAllResults);
        if (flattenedTry.isFailure) {
            return new Failure('FormContextBuilder::build: ' + ObjUtil.formatRecAttr(flattenedTry.failure));
        }
        var flattened = flattenedTry.success;
        if (flattened.length != 4)
            return new Failure('FormContextBuilder::build: Open form should have resulted in 4 elements');
        var formXOpen = flattened[0];
        var formXFormDef = flattened[1];
        var formMenuDefs = flattened[2];
        var formChildren = flattened[3];
        if (formChildren.length != 4)
            return new Failure('FormContextBuilder::build: Open form should have resulted in 3 elements for children panes');
        var childrenXOpens = formChildren[0];
        var childrenXPaneDefs = formChildren[1];
        var childrenXActiveColDefs = formChildren[2];
        var childrenMenuDefs = formChildren[3];
        return FormDef.fromOpenFormResult(formXOpen, formXFormDef, formMenuDefs, childrenXOpens, childrenXPaneDefs, childrenXActiveColDefs, childrenMenuDefs);
    }
    createChildrenContexts(formDef) {
        var result = [];
        formDef.childrenDefs.forEach((paneDef, i) => {
            if (paneDef instanceof ListDef) {
                result.push(new ListContext(i));
            }
            else if (paneDef instanceof DetailsDef) {
                result.push(new DetailsContext(i));
            }
            else if (paneDef instanceof MapDef) {
                result.push(new MapContext(i));
            }
            else if (paneDef instanceof GraphDef) {
                result.push(new GraphContext(i));
            }
            else if (paneDef instanceof CalendarDef) {
                result.push(new CalendarContext(i));
            }
            else if (paneDef instanceof ImagePickerDef) {
                result.push(new ImagePickerContext(i));
            }
            else if (paneDef instanceof BarcodeScanDef) {
                result.push(new BarcodeScanContext(i));
            }
            else if (paneDef instanceof GeoFixDef) {
                result.push(new GeoFixContext(i));
            }
            else if (paneDef instanceof GeoLocationDef) {
                result.push(new GeoLocationContext(i));
            }
        });
        return result;
    }
    fetchChildrenActiveColDefs(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp) => {
            if (xComp.redirection.isQuery) {
                return DialogService.getActiveColumnDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
            else {
                return Future.createSuccessfulFuture('FormContextBuilder::fetchChildrenActiveColDefs', null);
            }
        });
        return Future.sequence(seqOfFutures);
    }
    fetchChildrenMenuDefs(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = xComps.map((xComp) => {
            if (xComp.redirection.isEditor) {
                return DialogService.getEditorModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
            else {
                return DialogService.getQueryModelMenuDefs(xComp.redirection.dialogHandle, this.sessionContext);
            }
        });
        return Future.sequence(seqOfFutures);
    }
    fetchChildrenXPaneDefs(formXOpen, xFormDef) {
        var formHandle = formXOpen.formModel.form.redirection.dialogHandle;
        var xRefs = xFormDef.paneDefRefs;
        var seqOfFutures = xRefs.map((xRef) => {
            return DialogService.getEditorModelPaneDef(formHandle, xRef.paneId, this.sessionContext);
        });
        return Future.sequence(seqOfFutures);
    }
    fetchXFormDef(xformOpenResult) {
        var dialogHandle = xformOpenResult.formRedirection.dialogHandle;
        var formPaneId = xformOpenResult.formPaneId;
        return DialogService.getEditorModelPaneDef(dialogHandle, formPaneId, this.sessionContext).bind((value) => {
            if (value instanceof XFormDef) {
                return Future.createSuccessfulFuture('fetchXFormDef/success', value);
            }
            else {
                return Future.createFailedFuture('fetchXFormDef/failure', 'Expected reponse to contain an XFormDef but got ' + ObjUtil.formatRecAttr(value));
            }
        });
    }
    openChildren(formXOpen) {
        var xComps = formXOpen.formModel.children;
        var seqOfFutures = [];
        xComps.forEach((nextXComp) => {
            var nextFr = null;
            if (nextXComp.redirection.isEditor) {
                nextFr = DialogService.openEditorModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            else {
                nextFr = DialogService.openQueryModelFromRedir(nextXComp.redirection, this.sessionContext);
            }
            seqOfFutures.push(nextFr);
        });
        return Future.sequence(seqOfFutures);
    }
}
/**
 * *********************************
 */
/*
 @TODO - current the gateway response is mocked, due to cross-domain issues
 This should be removed (and the commented section uncommented for production!!!
 */
export class GatewayService {
    static getServiceEndpoint(tenantId, serviceName, gatewayHost) {
        //We have to fake this for now, due to cross domain issues
        /*
         var fakeResponse = {
         responseType:"soi-json",
         tenantId:"***REMOVED***z",
         serverAssignment:"https://dfw.catavolt.net/vs301",
         appVersion:"1.3.262",soiVersion:"v02"
         }

         var endPointFuture = Future.createSuccessfulFuture<ServiceEndpoint>('serviceEndpoint', <any>fakeResponse);

         */
        var f = Get.fromUrl('https://' + gatewayHost + '/' + tenantId + '/' + serviceName).perform();
        var endPointFuture = f.bind((jsonObject) => {
            //'bounce cast' the jsonObject here to coerce into ServiceEndpoint
            return Future.createSuccessfulFuture("serviceEndpoint", jsonObject);
        });
        return endPointFuture;
    }
}
/**
 * *********************************
 */
export class GeoFix {
    constructor(_latitude, _longitude, _source, _accuracy) {
        this._latitude = _latitude;
        this._longitude = _longitude;
        this._source = _source;
        this._accuracy = _accuracy;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    get source() {
        return this._source;
    }
    get accuracy() {
        return this._accuracy;
    }
    toString() {
        return this.latitude + ":" + this.longitude;
    }
}
/**
 * *********************************
 */
export class GeoLocation {
    constructor(_latitude, _longitude) {
        this._latitude = _latitude;
        this._longitude = _longitude;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    }
    get latitude() {
        return this._latitude;
    }
    get longitude() {
        return this._longitude;
    }
    toString() {
        return this.latitude + ":" + this.longitude;
    }
}
/**
 * *********************************
 */
export class GraphDataPointDef {
    constructor(_name, _type, _plotType, _legendkey) {
        this._name = _name;
        this._type = _type;
        this._plotType = _plotType;
        this._legendkey = _legendkey;
    }
}
/**
 * *********************************
 */
export class MenuDef {
    constructor(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
        this._name = _name;
        this._type = _type;
        this._actionId = _actionId;
        this._mode = _mode;
        this._label = _label;
        this._iconName = _iconName;
        this._directive = _directive;
        this._menuDefs = _menuDefs;
    }
    get actionId() {
        return this._actionId;
    }
    get directive() {
        return this._directive;
    }
    findAtId(actionId) {
        if (this.actionId === actionId)
            return this;
        var result = null;
        this.menuDefs.some((md) => {
            result = md.findAtId(actionId);
            return result != null;
        });
        return result;
    }
    get iconName() {
        return this._iconName;
    }
    get isPresaveDirective() {
        return this._directive && this._directive === 'PRESAVE';
    }
    get isRead() {
        return this._mode && this._mode.indexOf('R') > -1;
    }
    get isSeparator() {
        return this._type && this._type === 'separator';
    }
    get isWrite() {
        return this._mode && this._mode.indexOf('W') > -1;
    }
    get label() {
        return this._label;
    }
    get menuDefs() {
        return this._menuDefs;
    }
    get mode() {
        return this._mode;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
}
export class NavRequestUtil {
    static fromRedirection(redirection, actionSource, sessionContext) {
        var result;
        if (redirection instanceof WebRedirection) {
            result = Future.createSuccessfulFuture('NavRequest::fromRedirection', redirection);
        }
        else if (redirection instanceof WorkbenchRedirection) {
            var wbr = redirection;
            result = AppContext.singleton.getWorkbench(sessionContext, wbr.workbenchId).map((wb) => {
                return wb;
            });
        }
        else if (redirection instanceof DialogRedirection) {
            var dr = redirection;
            var fcb = new FormContextBuilder(dr, actionSource, sessionContext);
            result = fcb.build();
        }
        else if (redirection instanceof NullRedirection) {
            var nullRedir = redirection;
            var nullNavRequest = new NullNavRequest();
            ObjUtil.addAllProps(nullRedir.fromDialogProperties, nullNavRequest.fromDialogProperties);
            result = Future.createSuccessfulFuture('NavRequest:fromRedirection/nullRedirection', nullNavRequest);
        }
        else {
            result = Future.createFailedFuture('NavRequest::fromRedirection', 'Unrecognized type of Redirection ' + ObjUtil.formatRecAttr(redirection));
        }
        return result;
    }
}
/**
 * *********************************
 */
export class NullNavRequest {
    constructor() {
        this.fromDialogProperties = {};
    }
}
/**
 * *********************************
 */
export class ObjectRef {
    constructor(_objectId, _description) {
        this._objectId = _objectId;
        this._description = _description;
    }
    static fromFormattedValue(value) {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new ObjectRef(pair[0], pair[1]);
    }
    get description() {
        return this._description;
    }
    get objectId() {
        return this._objectId;
    }
    toString() {
        return this.objectId + ":" + this.description;
    }
}
/**
 * *********************************
 */
export var PaneMode;
(function (PaneMode) {
    PaneMode[PaneMode["READ"] = 0] = "READ";
    PaneMode[PaneMode["WRITE"] = 1] = "WRITE";
})(PaneMode || (PaneMode = {}));
/**
 * *********************************
 */
export class PropDef {
    constructor(_name, _type, _elementType, _style, _propertyLength, _propertyScale, _presLength, _presScale, _dataDictionaryKey, _maintainable, _writeEnabled, _canCauseSideEffects) {
        this._name = _name;
        this._type = _type;
        this._elementType = _elementType;
        this._style = _style;
        this._propertyLength = _propertyLength;
        this._propertyScale = _propertyScale;
        this._presLength = _presLength;
        this._presScale = _presScale;
        this._dataDictionaryKey = _dataDictionaryKey;
        this._maintainable = _maintainable;
        this._writeEnabled = _writeEnabled;
        this._canCauseSideEffects = _canCauseSideEffects;
    }
    get canCauseSideEffects() {
        return this._canCauseSideEffects;
    }
    get dataDictionaryKey() {
        return this._dataDictionaryKey;
    }
    get elementType() {
        return this._elementType;
    }
    get isBarcodeType() {
        return this.type &&
            this.type === 'STRING' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_BARCODE';
    }
    get isBinaryType() {
        return this.isLargeBinaryType;
    }
    get isBooleanType() {
        return this.type && this.type === 'BOOLEAN';
    }
    get isCodeRefType() {
        return this.type && this.type === 'CODE_REF';
    }
    get isDateType() {
        return this.type && this.type === 'DATE';
    }
    get isDateTimeType() {
        return this.type && this.type === 'DATE_TIME';
    }
    get isDecimalType() {
        return this.type && this.type === 'DECIMAL';
    }
    get isDoubleType() {
        return this.type && this.type === 'DOUBLE';
    }
    get isEmailType() {
        return this.type && this.type === 'DATA_EMAIL';
    }
    get isGeoFixType() {
        return this.type && this.type === 'GEO_FIX';
    }
    get isGeoLocationType() {
        return this.type && this.type === 'GEO_LOCATION';
    }
    get isHTMLType() {
        return this.type && this.type === 'DATA_HTML';
    }
    get isListType() {
        return this.type && this.type === 'LIST';
    }
    get isInlineMediaStyle() {
        return this.style &&
            (this.style === PropDef.STYLE_INLINE_MEDIA || this.style === PropDef.STYLE_INLINE_MEDIA2);
    }
    get isIntType() {
        return this.type && this.type === 'INT';
    }
    get isLargeBinaryType() {
        return this.type &&
            this.type === 'com.dgoi.core.domain.BinaryRef' &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_LARGEBINARY';
    }
    get isLongType() {
        return this.type && this.type === 'LONG';
    }
    get isMoneyType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_MONEY';
    }
    get isNumericType() {
        return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
    }
    get isObjRefType() {
        return this.type && this.type === 'OBJ_REF';
    }
    get isPasswordType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PASSWORD';
    }
    get isPercentType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_PERCENT';
    }
    get isStringType() {
        return this.type && this.type === 'STRING';
    }
    get isTelephoneType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_TELEPHONE';
    }
    get isTextBlock() {
        return this.dataDictionaryKey && this.dataDictionaryKey === 'DATA_TEXT_BLOCK';
    }
    get isTimeType() {
        return this.type && this.type === 'TIME';
    }
    get isUnformattedNumericType() {
        return this.isNumericType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_UNFORMATTED_NUMBER';
    }
    get isURLType() {
        return this.isStringType &&
            this.dataDictionaryKey &&
            this.dataDictionaryKey === 'DATA_URL';
    }
    get maintainable() {
        return this._maintainable;
    }
    get name() {
        return this._name;
    }
    get presLength() {
        return this._presLength;
    }
    get presScale() {
        return this._presScale;
    }
    get propertyLength() {
        return this._propertyLength;
    }
    get propertyScale() {
        return this._propertyScale;
    }
    get style() {
        return this._style;
    }
    get type() {
        return this._type;
    }
    get writeEnabled() {
        return this._writeEnabled;
    }
}
PropDef.STYLE_INLINE_MEDIA = "inlineMedia";
PropDef.STYLE_INLINE_MEDIA2 = "Image/Video";
/**
 * *********************************
 */
export class PropFormatter {
    static formatForRead(prop, propDef) {
        return 'R:' + prop ? PropFormatter.toString(prop) : '';
    }
    static formatForWrite(prop, propDef) {
        return prop ? PropFormatter.toString(prop) : '';
    }
    static parse(value, propDef) {
        var propValue = value;
        if (propDef.isDecimalType) {
            propValue = Number(value);
        }
        else if (propDef.isLongType) {
            propValue = Number(value);
        }
        else if (propDef.isBooleanType) {
            propValue = value !== 'false';
        }
        else if (propDef.isDateType) {
            propValue = new Date(value);
        }
        else if (propDef.isDateTimeType) {
            propValue = new Date(value);
        }
        else if (propDef.isTimeType) {
            propValue = new Date(value);
        }
        else if (propDef.isObjRefType) {
            propValue = ObjectRef.fromFormattedValue(value);
        }
        else if (propDef.isCodeRefType) {
            propValue = CodeRef.fromFormattedValue(value);
        }
        else if (propDef.isGeoFixType) {
            propValue = GeoFix.fromFormattedValue(value);
        }
        else if (propDef.isGeoLocationType) {
            propValue = GeoLocation.fromFormattedValue(value);
        }
        return propValue;
    }
    static toString(o) {
        if (typeof o === 'number') {
            return String(o);
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                return o.toUTCString();
            }
            else if (o instanceof CodeRef) {
                return o.toString();
            }
            else if (o instanceof ObjectRef) {
                return o.toString();
            }
            else if (o instanceof GeoFix) {
                return o.toString();
            }
            else if (o instanceof GeoLocation) {
                return o.toString();
            }
            else {
                return String(o);
            }
        }
        else {
            return String(o);
        }
    }
}
export class Prop {
    constructor(_name, _value, _annos = []) {
        this._name = _name;
        this._value = _value;
        this._annos = _annos;
    }
    static fromListOfWSValue(values) {
        var props = [];
        values.forEach((v) => {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure)
                return new Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new Success(props);
    }
    static fromWSNameAndWSValue(name, value) {
        var propTry = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new Failure(propTry.failure);
        }
        return new Success(new Prop(name, propTry.success));
    }
    static fromWSNamesAndValues(names, values) {
        if (names.length != values.length) {
            return new Failure("Prop::fromWSNamesAndValues: names and values must be of same length");
        }
        var list = [];
        for (var i = 0; i < names.length; i++) {
            var propTry = Prop.fromWSNameAndWSValue(names[i], values[i]);
            if (propTry.isFailure) {
                return new Failure(propTry.failure);
            }
            list.push(propTry.success);
        }
        return new Success(list);
    }
    static fromWSValue(value) {
        var propValue = value;
        if (value && 'object' === typeof value) {
            var PType = value['WS_PTYPE'];
            var strVal = value['value'];
            if (PType) {
                if (PType === 'Decimal') {
                    propValue = Number(strVal);
                }
                else if (PType === 'Date') {
                    //propValue = new Date(strVal);
                    propValue = strVal;
                }
                else if (PType === 'DateTime') {
                    //propValue = new Date(strVal);
                    propValue = strVal;
                }
                else if (PType === 'Time') {
                    //propValue = new Date(strVal);
                    propValue = strVal;
                }
                else if (PType === 'BinaryRef') {
                    var binaryRefTry = BinaryRef.fromWSValue(strVal, value['properties']);
                    if (binaryRefTry.isFailure)
                        return new Failure(binaryRefTry.failure);
                    propValue = binaryRefTry.success;
                }
                else if (PType === 'ObjectRef') {
                    propValue = ObjectRef.fromFormattedValue(strVal);
                }
                else if (PType === 'CodeRef') {
                    propValue = CodeRef.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoFix') {
                    propValue = GeoFix.fromFormattedValue(strVal);
                }
                else if (PType === 'GeoLocation') {
                    propValue = GeoLocation.fromFormattedValue(strVal);
                }
                else {
                    return new Failure('Prop::fromWSValue: Property WS_PTYPE is not valid: ' + PType);
                }
            }
        }
        return new Success(propValue);
    }
    static fromWS(otype, jsonObj) {
        var name = jsonObj['name'];
        var valueTry = Prop.fromWSValue(jsonObj['value']);
        if (valueTry.isFailure)
            return new Failure(valueTry.failure);
        var annos = null;
        if (jsonObj['annos']) {
            var annosListTry = DialogTriple.fromListOfWSDialogObject(jsonObj['annos'], 'WSDataAnno', OType.factoryFn);
            if (annosListTry.isFailure)
                return new Failure(annosListTry.failure);
            annos = annosListTry.success;
        }
        return new Success(new Prop(name, valueTry.success, annos));
    }
    static toWSProperty(o) {
        if (typeof o === 'number') {
            return { 'WS_PTYPE': 'Decimal', 'value': String(o) };
        }
        else if (typeof o === 'object') {
            if (o instanceof Date) {
                return { 'WS_PTYPE': 'DateTime', 'value': o.toUTCString() };
            }
            else if (o instanceof CodeRef) {
                return { 'WS_PTYPE': 'CodeRef', 'value': o.toString() };
            }
            else if (o instanceof ObjectRef) {
                return { 'WS_PTYPE': 'ObjectRef', 'value': o.toString() };
            }
            else if (o instanceof GeoFix) {
                return { 'WS_PTYPE': 'GeoFix', 'value': o.toString() };
            }
            else if (o instanceof GeoLocation) {
                return { 'WS_PTYPE': 'GeoLocation', 'value': o.toString() };
            }
        }
        else {
            return o;
        }
    }
    static toWSListOfProperties(list) {
        var result = { 'WS_LTYPE': 'Object' };
        var values = [];
        list.forEach((o) => {
            values.push(Prop.toWSProperty(o));
        });
        result['values'] = values;
        return result;
    }
    static toWSListOfString(list) {
        return { 'WS_LTYPE': 'String', 'values': list };
    }
    static toListOfWSProp(props) {
        var result = { 'WS_LTYPE': 'WSProp' };
        var values = [];
        props.forEach((prop) => {
            values.push(prop.toWS());
        });
        result['values'] = values;
        return result;
    }
    get annos() {
        return this._annos;
    }
    equals(prop) {
        return this.name === prop.name && this.value === prop.value;
    }
    get backgroundColor() {
        return DataAnno.backgroundColor(this.annos);
    }
    get foregroundColor() {
        return DataAnno.foregroundColor(this.annos);
    }
    get imageName() {
        return DataAnno.imageName(this.annos);
    }
    get imagePlacement() {
        return DataAnno.imagePlacement(this.annos);
    }
    get isBoldText() {
        return DataAnno.isBoldText(this.annos);
    }
    get isItalicText() {
        return DataAnno.isItalicText(this.annos);
    }
    get isPlacementCenter() {
        return DataAnno.isPlacementCenter(this.annos);
    }
    get isPlacementLeft() {
        return DataAnno.isPlacementLeft(this.annos);
    }
    get isPlacementRight() {
        return DataAnno.isPlacementRight(this.annos);
    }
    get isPlacementStretchUnder() {
        return DataAnno.isPlacementStretchUnder(this.annos);
    }
    get isPlacementUnder() {
        return DataAnno.isPlacementUnder(this.annos);
    }
    get isUnderline() {
        return DataAnno.isUnderlineText(this.annos);
    }
    get name() {
        return this._name;
    }
    get overrideText() {
        return DataAnno.overrideText(this.annos);
    }
    get tipText() {
        return DataAnno.tipText(this.annos);
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
    }
    toWS() {
        var result = { 'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Prop.toWSProperty(this.value) };
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
    constructor(entityRecs, hasMore) {
        this.entityRecs = entityRecs;
        this.hasMore = hasMore;
    }
}
/**
 * *********************************
 */
export class HasMoreQueryMarker extends NullEntityRec {
}
HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
export class IsEmptyQueryMarker extends NullEntityRec {
}
IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
export var QueryMarkerOption;
(function (QueryMarkerOption) {
    QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
    QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
    QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
})(QueryMarkerOption || (QueryMarkerOption = {}));
export class QueryScroller {
    constructor(_context, _pageSize, _firstObjectId, _markerOptions = []) {
        this._context = _context;
        this._pageSize = _pageSize;
        this._firstObjectId = _firstObjectId;
        this._markerOptions = _markerOptions;
        this.clear();
    }
    get buffer() {
        return this._buffer;
    }
    get bufferWithMarkers() {
        var result = ArrayUtil.copy(this._buffer);
        if (this.isComplete) {
            if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                if (this.isEmpty) {
                    result.push(IsEmptyQueryMarker.singleton);
                }
            }
        }
        else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
            if (result.length === 0) {
                result.push(HasMoreQueryMarker.singleton);
            }
            else {
                if (this._hasMoreBackward) {
                    result.unshift(HasMoreQueryMarker.singleton);
                }
                if (this._hasMoreForward) {
                    result.push(HasMoreQueryMarker.singleton);
                }
            }
        }
        return result;
    }
    get context() {
        return this._context;
    }
    get firstObjectId() {
        return this._firstObjectId;
    }
    get hasMoreBackward() {
        return this._hasMoreBackward;
    }
    get hasMoreForward() {
        return this._hasMoreForward;
    }
    get isComplete() {
        return !this._hasMoreBackward && !this._hasMoreForward;
    }
    get isCompleteAndEmpty() {
        return this.isComplete && this._buffer.length === 0;
    }
    get isEmpty() {
        return this._buffer.length === 0;
    }
    pageBackward() {
        if (!this._hasMoreBackward) {
            return Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
        }
        else {
            this._prevPageFr = this._prevPageFr.bind((queryResult) => {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                return this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._prevPageFr.map((queryResult) => {
            var afterSize = beforeSize;
            this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                this._buffer.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    }
    pageForward() {
        if (!this._hasMoreForward) {
            return Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
        }
        else {
            this._nextPageFr = this._nextPageFr.bind((queryResult) => {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                return this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._nextPageFr.map((queryResult) => {
            var afterSize = beforeSize;
            this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                this._buffer.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                queryResult.entityRecs.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    }
    get pageSize() {
        return this._pageSize;
    }
    refresh() {
        this.clear();
        return this.pageForward().map((entityRecList) => {
            this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    }
    trimFirst(n) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
        if (this._buffer.length === 0)
            this._hasMoreForward = true;
    }
    trimLast(n) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
        if (this._buffer.length === 0)
            this._hasMoreBackward = true;
    }
    clear() {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
    }
}
/**
 * *********************************
 */
export class SessionContextImpl {
    constructor(sessionHandle, userName, currentDivision, serverVersion, systemContext) {
        this.sessionHandle = sessionHandle;
        this.userName = userName;
        this.currentDivision = currentDivision;
        this.serverVersion = serverVersion;
        this.systemContext = systemContext;
        this._remoteSession = true;
    }
    static fromWSCreateSessionResult(jsonObject, systemContext) {
        var sessionContextTry = DialogTriple.fromWSDialogObject(jsonObject, 'WSCreateSessionResult', OType.factoryFn);
        return sessionContextTry.map((sessionContext) => {
            sessionContext.systemContext = systemContext;
            return sessionContext;
        });
    }
    static createSessionContext(gatewayHost, tenantId, clientType, userId, password) {
        var sessionContext = new SessionContextImpl(null, userId, "", null, null);
        sessionContext._gatewayHost = gatewayHost;
        sessionContext._tenantId = tenantId;
        sessionContext._clientType = clientType;
        sessionContext._userId = userId;
        sessionContext._password = password;
        sessionContext._remoteSession = false;
        return sessionContext;
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
    set online(online) {
        this._remoteSession = online;
    }
}
/**
 * *********************************
 */
export class SessionService {
    static createSession(tenantId, userId, password, clientType, systemContext) {
        var method = "createSessionDirectly";
        var params = {
            'tenantId': tenantId,
            'userId': userId,
            'password': password,
            'clientType': clientType
        };
        var call = Call.createCallWithoutSession(SessionService.SERVICE_PATH, method, params, systemContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("createSession/extractSessionContextFromResponse", SessionContextImpl.fromWSCreateSessionResult(result, systemContext));
        });
    }
    static deleteSession(sessionContext) {
        var method = "deleteSession";
        var params = {
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture("deleteSession/extractVoidResultFromResponse", result);
        });
    }
    static getSessionListProperty(propertyName, sessionContext) {
        var method = "getSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("getSessionListProperty/extractResultFromResponse", DialogTriple.fromWSDialogObject(result, 'WSGetSessionListPropertyResult', OType.factoryFn));
        });
    }
    static setSessionListProperty(propertyName, listProperty, sessionContext) {
        var method = "setSessionListProperty";
        var params = {
            'propertyName': propertyName,
            'listProperty': listProperty,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(SessionService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createSuccessfulFuture("setSessionListProperty/extractVoidResultFromResponse", result);
        });
    }
}
SessionService.SERVICE_NAME = "SessionService";
SessionService.SERVICE_PATH = "soi-json-v02/" + SessionService.SERVICE_NAME;
/**
 * *********************************
 */
export class SortPropDef {
    constructor(_name, _direction) {
        this._name = _name;
        this._direction = _direction;
    }
    get direction() {
        return this._direction;
    }
    get name() {
        return this._name;
    }
}
/**
 * *********************************
 */
export class SystemContextImpl {
    constructor(_urlString) {
        this._urlString = _urlString;
    }
    get urlString() {
        return this._urlString;
    }
}
/**
 * *********************************
 */
export class WorkbenchLaunchAction {
    constructor(id, workbenchId, name, alias, iconBase) {
        this.id = id;
        this.workbenchId = workbenchId;
        this.name = name;
        this.alias = alias;
        this.iconBase = iconBase;
    }
    get actionId() {
        return this.id;
    }
    get fromActionSource() {
        return null;
    }
    get virtualPathSuffix() {
        return [this.workbenchId, this.id];
    }
}
/**
 * *********************************
 */
export class WorkbenchService {
    static getAppWinDef(sessionContext) {
        var method = "getApplicationWindowDef";
        var params = { 'sessionHandle': sessionContext.sessionHandle };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("createSession/extractAppWinDefFromResult", DialogTriple.fromWSDialogObjectResult(result, 'WSApplicationWindowDefResult', 'WSApplicationWindowDef', 'applicationWindowDef', OType.factoryFn));
        });
    }
    static getWorkbench(sessionContext, workbenchId) {
        var method = "getWorkbench";
        var params = {
            'sessionHandle': sessionContext.sessionHandle,
            'workbenchId': workbenchId
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("getWorkbench/extractObject", DialogTriple.fromWSDialogObjectResult(result, 'WSWorkbenchResult', 'WSWorkbench', 'workbench', OType.factoryFn));
        });
    }
    static performLaunchAction(actionId, workbenchId, sessionContext) {
        var method = "performLaunchAction";
        var params = {
            'actionId': actionId,
            'workbenchId': workbenchId,
            'sessionHandle': sessionContext.sessionHandle
        };
        var call = Call.createCall(WorkbenchService.SERVICE_PATH, method, params, sessionContext);
        return call.perform().bind((result) => {
            return Future.createCompletedFuture("performLaunchAction/extractRedirection", DialogTriple.fromWSDialogObject(result['redirection'], 'WSRedirection', OType.factoryFn));
        });
    }
}
WorkbenchService.SERVICE_NAME = "WorkbenchService";
WorkbenchService.SERVICE_PATH = "soi-json-v02/" + WorkbenchService.SERVICE_NAME;
/**
 * *********************************
 */
export class Workbench {
    constructor(_id, _name, _alias, _actions) {
        this._id = _id;
        this._name = _name;
        this._alias = _alias;
        this._actions = _actions;
    }
    get alias() {
        return this._alias;
    }
    getLaunchActionById(launchActionId) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction) {
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
    get workbenchLaunchActions() {
        return ArrayUtil.copy(this._actions);
    }
}
/* XPane Classes */
/**
 * *********************************
 */
export class XPaneDef {
    constructor() {
    }
    static fromWS(otype, jsonObj) {
        if (jsonObj['listDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['listDef'], 'WSListDef', OType.factoryFn);
        }
        else if (jsonObj['detailsDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['detailsDef'], 'WSDetailsDef', OType.factoryFn);
        }
        else if (jsonObj['formDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['formDef'], 'WSFormDef', OType.factoryFn);
        }
        else if (jsonObj['mapDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['mapDef'], 'WSMapDef', OType.factoryFn);
        }
        else if (jsonObj['graphDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['graphDef'], 'WSGraphDef', OType.factoryFn);
        }
        else if (jsonObj['barcodeScanDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['barcodeScanDef'], 'WSBarcodeScanDef', OType.factoryFn);
        }
        else if (jsonObj['imagePickerDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['imagePickerDef'], 'WSImagePickerDef', OType.factoryFn);
        }
        else if (jsonObj['geoFixDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoFixDef'], 'WSGeoFixDef', OType.factoryFn);
        }
        else if (jsonObj['geoLocationDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['geoLocationDef'], 'WSGeoLocationDef', OType.factoryFn);
        }
        else if (jsonObj['calendarDef']) {
            return DialogTriple.fromWSDialogObject(jsonObj['calendarDef'], 'WSCalendarDef', OType.factoryFn);
        }
        else {
            return new Failure('XPaneDef::fromWS: Cannot determine concrete class for XPaneDef ' + ObjUtil.formatRecAttr(jsonObj));
        }
    }
}
/**
 * *********************************
 */
export class XBarcodeScanDef extends XPaneDef {
    constructor(paneId, name, title) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
}
/**
 * *********************************
 */
export class XCalendarDef extends XPaneDef {
    constructor(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.initialStyle = initialStyle;
        this.startDateProperty = startDateProperty;
        this.startTimeProperty = startTimeProperty;
        this.endDateProperty = endDateProperty;
        this.endTimeProperty = endTimeProperty;
        this.occurDateProperty = occurDateProperty;
        this.occurTimeProperty = occurTimeProperty;
    }
}
/**
 * *********************************
 */
export class XChangePaneModeResult {
    constructor(editorRecordDef, dialogProperties) {
        this.editorRecordDef = editorRecordDef;
        this.dialogProperties = dialogProperties;
    }
    get entityRecDef() {
        return this.editorRecordDef;
    }
    get dialogProps() {
        return this.dialogProperties;
    }
}
/**
 * *********************************
 */
/*
 @TODO

 Note! Use this as a test example!
 It has an Array of Array with subitems that also have Array of Array!!
 */
export class XDetailsDef extends XPaneDef {
    constructor(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.cancelButtonText = cancelButtonText;
        this.commitButtonText = commitButtonText;
        this.editable = editable;
        this.focusPropertyName = focusPropertyName;
        this.overrideGML = overrideGML;
        this.rows = rows;
    }
    get graphicalMarkup() {
        return this.overrideGML;
    }
}
/**
 * *********************************
 */
export class XFormDef extends XPaneDef {
    constructor(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
        super();
        this.borderStyle = borderStyle;
        this.formLayout = formLayout;
        this.formStyle = formStyle;
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.headerDefRef = headerDefRef;
        this.paneDefRefs = paneDefRefs;
    }
}
/**
 * *********************************
 */
export class XFormModelComp {
    constructor(paneId, redirection, label, title) {
        this.paneId = paneId;
        this.redirection = redirection;
        this.label = label;
        this.title = title;
    }
}
/**
 * *********************************
 */
export class XFormModel {
    constructor(form, header, children, placement, refreshTimer, sizeToWindow) {
        this.form = form;
        this.header = header;
        this.children = children;
        this.placement = placement;
        this.refreshTimer = refreshTimer;
        this.sizeToWindow = sizeToWindow;
    }
    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    static fromWS(otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', OType.factoryFn, true).bind((form) => {
            var header = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', OType.factoryFn, true);
                if (headerTry.isFailure)
                    return new Failure(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', OType.factoryFn, true).bind((children) => {
                return new Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });
    }
}
/**
 * *********************************
 */
export class XGeoFixDef extends XPaneDef {
    constructor(paneId, name, title) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
}
/**
 * *********************************
 */
export class XGeoLocationDef extends XPaneDef {
    constructor(paneId, name, title) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
}
/**
 * *********************************
 */
export class XGetActiveColumnDefsResult {
    constructor(columnsStyle, columns) {
        this.columnsStyle = columnsStyle;
        this.columns = columns;
    }
    get columnDefs() {
        return this.columns;
    }
}
/**
 * *********************************
 */
export class XGetAvailableValuesResult {
    constructor(list) {
        this.list = list;
    }
    static fromWS(otype, jsonObj) {
        var listJson = jsonObj['list'];
        var valuesJson = listJson['values'];
        return Prop.fromListOfWSValue(valuesJson).bind((values) => {
            return new Success(new XGetAvailableValuesResult(values));
        });
    }
}
/**
 * *********************************
 */
export class XGetSessionListPropertyResult {
    constructor(_list, _dialogProps) {
        this._list = _list;
        this._dialogProps = _dialogProps;
    }
    get dialogProps() {
        return this._dialogProps;
    }
    get values() {
        return this._list;
    }
    valuesAsDictionary() {
        var result = {};
        this.values.forEach((v) => {
            var pair = StringUtil.splitSimpleKeyValuePair(v);
            result[pair[0]] = pair[1];
        });
        return result;
    }
}
/**
 * *********************************
 */
export class XGraphDef extends XPaneDef {
    constructor(paneId, name, title, graphType, identityDataPoint, groupingDataPoint, dataPoints, filterDataPoints, sampleModel) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.graphType = graphType;
        this.identityDataPoint = identityDataPoint;
        this.groupingDataPoint = groupingDataPoint;
        this.dataPoints = dataPoints;
        this.filterDataPoints = filterDataPoints;
        this.sampleModel = sampleModel;
    }
}
/**
 * *********************************
 */
export class XImagePickerDef extends XPaneDef {
    constructor(paneId, name, title, URLProperty, defaultActionId) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.URLProperty = URLProperty;
        this.defaultActionId = defaultActionId;
    }
}
/**
 * *********************************
 */
export class XListDef extends XPaneDef {
    constructor(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.style = style;
        this.initialColumns = initialColumns;
        this.columnsStyle = columnsStyle;
        this.overrideGML = overrideGML;
    }
    get graphicalMarkup() {
        return this.overrideGML;
    }
    set graphicalMarkup(graphicalMarkup) {
        this.overrideGML = graphicalMarkup;
    }
}
/**
 * *********************************
 */
export class XMapDef extends XPaneDef {
    constructor(paneId, name, title, descriptionProperty, streetProperty, cityProperty, stateProperty, postalCodeProperty, latitudeProperty, longitudeProperty) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.streetProperty = streetProperty;
        this.cityProperty = cityProperty;
        this.stateProperty = stateProperty;
        this.postalCodeProperty = postalCodeProperty;
        this.latitudeProperty = latitudeProperty;
        this.longitudeProperty = longitudeProperty;
    }
    //descriptionProperty is misspelled in json returned by server currently...
    set descrptionProperty(prop) {
        this.descriptionProperty = prop;
    }
}
/**
 * *********************************
 */
export class XOpenEditorModelResult {
    constructor(editorRecordDef, formModel) {
        this.editorRecordDef = editorRecordDef;
        this.formModel = formModel;
    }
    get entityRecDef() {
        return this.editorRecordDef;
    }
    get formPaneId() {
        return this.formModel.form.paneId;
    }
    get formRedirection() {
        return this.formModel.form.redirection;
    }
}
/**
 * *********************************
 */
export class XOpenQueryModelResult {
    constructor(entityRecDef, sortPropertyDef, defaultActionId) {
        this.entityRecDef = entityRecDef;
        this.sortPropertyDef = sortPropertyDef;
        this.defaultActionId = defaultActionId;
    }
    static fromWS(otype, jsonObj) {
        var queryRecDefJson = jsonObj['queryRecordDef'];
        var defaultActionId = queryRecDefJson['defaultActionId'];
        return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['propertyDefs'], 'WSPropertyDef', OType.factoryFn).bind((propDefs) => {
            var entityRecDef = new EntityRecDef(propDefs);
            return DialogTriple.fromListOfWSDialogObject(queryRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs) => {
                return new Success(new XOpenQueryModelResult(entityRecDef, sortPropDefs, defaultActionId));
            });
        });
    }
}
/**
 * *********************************
 */
export class XPaneDefRef {
    constructor(name, paneId, title, type) {
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.type = type;
    }
}
/**
 * *********************************
 */
export class XPropertyChangeResult {
    constructor(availableValueChanges, propertyName, sideEffects, editorRecordDef) {
        this.availableValueChanges = availableValueChanges;
        this.propertyName = propertyName;
        this.sideEffects = sideEffects;
        this.editorRecordDef = editorRecordDef;
    }
    get sideEffectsDef() {
        return this.editorRecordDef;
    }
}
/**
 * *********************************
 */
export class XQueryResult {
    constructor(entityRecs, entityRecDef, hasMore, sortPropDefs, defaultActionId, dialogProps) {
        this.entityRecs = entityRecs;
        this.entityRecDef = entityRecDef;
        this.hasMore = hasMore;
        this.sortPropDefs = sortPropDefs;
        this.defaultActionId = defaultActionId;
        this.dialogProps = dialogProps;
    }
    static fromWS(otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['queryRecordDef'], 'WSQueryRecordDef', OType.factoryFn).bind((entityRecDef) => {
            var entityRecDefJson = jsonObj['queryRecordDef'];
            var actionId = jsonObj['defaultActionId'];
            return DialogTriple.fromListOfWSDialogObject(entityRecDefJson['sortPropertyDefs'], 'WSSortPropertyDef', OType.factoryFn).bind((sortPropDefs) => {
                var queryRecsJson = jsonObj['queryRecords'];
                if (queryRecsJson['WS_LTYPE'] !== 'WSQueryRecord') {
                    return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of WSQueryRecord but found ' + queryRecsJson['WS_LTYPE']);
                }
                var queryRecsValues = queryRecsJson['values'];
                var entityRecs = [];
                for (var i = 0; i < queryRecsValues.length; i++) {
                    var queryRecValue = queryRecsValues[i];
                    if (queryRecValue['WS_OTYPE'] !== 'WSQueryRecord') {
                        return new Failure('XQueryResult::fromWS: Expected WS_OTYPE of WSQueryRecord but found ' + queryRecValue['WS_LTYPE']);
                    }
                    var objectId = queryRecValue['objectId'];
                    var recPropsObj = queryRecValue['properties'];
                    if (recPropsObj['WS_LTYPE'] !== 'Object') {
                        return new Failure('XQueryResult::fromWS: Expected WS_LTYPE of Object but found ' + recPropsObj['WS_LTYPE']);
                    }
                    var recPropsObjValues = recPropsObj['values'];
                    var propsTry = Prop.fromWSNamesAndValues(entityRecDef.propNames, recPropsObjValues);
                    if (propsTry.isFailure)
                        return new Failure(propsTry.failure);
                    var props = propsTry.success;
                    if (queryRecValue['propertyAnnotations']) {
                        var propAnnosJson = queryRecValue['propertyAnnotations'];
                        var annotatedPropsTry = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosJson);
                        if (annotatedPropsTry.isFailure)
                            return new Failure(annotatedPropsTry.failure);
                        props = annotatedPropsTry.success;
                    }
                    var recAnnos = null;
                    if (queryRecValue['recordAnnotation']) {
                        var recAnnosTry = DialogTriple.fromWSDialogObject(queryRecValue['recordAnnotation'], 'WSDataAnnotation', OType.factoryFn);
                        if (recAnnosTry.isFailure)
                            return new Failure(recAnnosTry.failure);
                        recAnnos = recAnnosTry.success;
                    }
                    var entityRec = EntityRecUtil.newEntityRec(objectId, props, recAnnos);
                    entityRecs.push(entityRec);
                }
                var dialogProps = jsonObj['dialogProperties'];
                var hasMore = jsonObj['hasMore'];
                return new Success(new XQueryResult(entityRecs, entityRecDef, hasMore, sortPropDefs, actionId, dialogProps));
            });
        });
    }
}
/**
 * *********************************
 */
export class XReadPropertyResult {
    constructor() {
    }
}
/**
 * *********************************
 */
export class XReadResult {
    constructor(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    get entityRec() {
        return this._editorRecord;
    }
    get entityRecDef() {
        return this._editorRecordDef;
    }
    get dialogProps() {
        return this._dialogProperties;
    }
}
/**
 * *********************************
 */
export class XWriteResult {
    constructor(_editorRecord, _editorRecordDef, _dialogProperties) {
        this._editorRecord = _editorRecord;
        this._editorRecordDef = _editorRecordDef;
        this._dialogProperties = _dialogProperties;
    }
    static fromWS(otype, jsonObj) {
        return DialogTriple.extractTriple(jsonObj, 'WSWriteResult', () => {
            return OType.deserializeObject(jsonObj, 'XWriteResult', OType.factoryFn);
        });
    }
    get dialogProps() {
        return this._dialogProperties;
    }
    get entityRec() {
        return this._editorRecord;
    }
    get entityRecDef() {
        return this._editorRecordDef;
    }
    get isDestroyed() {
        var destoyedStr = this.dialogProps['destroyed'];
        return destoyedStr && destoyedStr.toLowerCase() === 'true';
    }
}
/*
  OType must be last as it references almost all other classes in the module
 */
export class OType {
    static typeInstance(name) {
        var type = OType.types[name];
        return type && new type;
    }
    static factoryFn(otype, jsonObj) {
        var typeFn = OType.typeFns[otype];
        if (typeFn) {
            return typeFn(otype, jsonObj);
        }
        return null;
    }
    static deserializeObject(obj, Otype, factoryFn) {
        Log.debug('Deserializing ' + Otype);
        if (Array.isArray(obj)) {
            //it's a nested array (no LTYPE!)
            return OType.handleNestedArray(Otype, obj);
        }
        else {
            var newObj = null;
            var objTry = factoryFn(Otype, obj); //this returns null if there is no custom function
            if (objTry) {
                if (objTry.isFailure) {
                    var error = 'OType::deserializeObject: factory failed to produce object for ' + Otype + " : "
                        + ObjUtil.formatRecAttr(objTry.failure);
                    Log.error(error);
                    return new Failure(error);
                }
                newObj = objTry.success;
            }
            else {
                newObj = OType.typeInstance(Otype);
                if (!newObj) {
                    Log.error('OType::deserializeObject: no type constructor found for ' + Otype);
                    return new Failure('OType::deserializeObject: no type constructor found for ' + Otype);
                }
                for (var prop in obj) {
                    var value = obj[prop];
                    Log.debug("prop: " + prop + " is type " + typeof value);
                    if (value && typeof value === 'object') {
                        if ('WS_OTYPE' in value) {
                            var otypeTry = DialogTriple.fromWSDialogObject(value, value['WS_OTYPE'], OType.factoryFn);
                            if (otypeTry.isFailure)
                                return new Failure(otypeTry.failure);
                            OType.assignPropIfDefined(prop, otypeTry.success, newObj, Otype);
                        }
                        else if ('WS_LTYPE' in value) {
                            var ltypeTry = DialogTriple.fromListOfWSDialogObject(value, value['WS_LTYPE'], OType.factoryFn);
                            if (ltypeTry.isFailure)
                                return new Failure(ltypeTry.failure);
                            OType.assignPropIfDefined(prop, ltypeTry.success, newObj, Otype);
                        }
                        else {
                            OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                        }
                    }
                    else {
                        OType.assignPropIfDefined(prop, obj[prop], newObj, Otype);
                    }
                }
            }
            return new Success(newObj);
        }
    }
    static serializeObject(obj, Otype, filterFn) {
        var newObj = { 'WS_OTYPE': Otype };
        return ObjUtil.copyNonNullFieldsOnly(obj, newObj, (prop) => {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    }
    static handleNestedArray(Otype, obj) {
        return OType.extractLType(Otype).bind((ltype) => {
            var newArrayTry = OType.deserializeNestedArray(obj, ltype);
            if (newArrayTry.isFailure)
                return new Failure(newArrayTry.failure);
            return new Success(newArrayTry.success);
        });
    }
    static deserializeNestedArray(array, ltype) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            var value = array[i];
            if (value && typeof value === 'object') {
                var otypeTry = DialogTriple.fromWSDialogObject(value, ltype, OType.factoryFn);
                if (otypeTry.isFailure) {
                    return new Failure(otypeTry.failure);
                }
                newArray.push(otypeTry.success);
            }
            else {
                newArray.push(value);
            }
        }
        return new Success(newArray);
    }
    static extractLType(Otype) {
        if (Otype.length > 5 && Otype.slice(0, 5) !== 'List<') {
            return new Failure('Expected OType of List<some_type> but found ' + Otype);
        }
        var ltype = Otype.slice(5, -1);
        return new Success(ltype);
    }
    static assignPropIfDefined(prop, value, target, otype = 'object') {
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
            }
            else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                }
                else {
                    Log.debug("Didn't find target value for prop " + prop + " on target for " + otype);
                }
            }
        }
        catch (error) {
            Log.error('OType::assignPropIfDefined: Failed to set prop: ' + prop + ' on target: ' + error);
        }
    }
}
OType.types = {
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
    'XWriteResult': XWriteResult
};
OType.typeFns = {
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
    'WSWriteResult': XWriteResult.fromWS
};
/**
 * *********************************
 */
