/**
 * Created by rburson on 3/27/15.
 */
import { StringDictionary } from "./util";
import { Try, Either, Future, TryClosure, MapFn } from "./fp";
import { SessionContext, SystemContext } from "./ws";
/**
 * *********************************
 */
export declare class CellValueDef {
    private _style;
    static fromWS(otype: string, jsonObj: any): Try<CellValueDef>;
    constructor(_style: string);
    isInlineMediaStyle: boolean;
    style: string;
}
/**
 * *********************************
 */
export declare class AttributeCellValueDef extends CellValueDef {
    private _propertyName;
    private _presentationLength;
    private _entryMethod;
    private _autoFillCapable;
    private _hint;
    private _toolTip;
    private _fieldActions;
    constructor(_propertyName: string, _presentationLength: number, _entryMethod: string, _autoFillCapable: boolean, _hint: string, _toolTip: string, _fieldActions: Array<MenuDef>, style: string);
    autoFileCapable: boolean;
    entryMethod: string;
    fieldActions: Array<MenuDef>;
    hint: string;
    isComboBoxEntryMethod: boolean;
    isDropDownEntryMethod: boolean;
    isTextFieldEntryMethod: boolean;
    presentationLength: number;
    propertyName: string;
    toolTip: string;
}
/**
 * *********************************
 */
export declare class ForcedLineCellValueDef extends CellValueDef {
    constructor();
}
/**
 * *********************************
 */
export declare class LabelCellValueDef extends CellValueDef {
    private _value;
    constructor(_value: string, style: string);
    value: string;
}
/**
 * *********************************
 */
export declare class SubstitutionCellValueDef extends CellValueDef {
    private _value;
    constructor(_value: string, style: string);
    value: string;
}
/**
 * *********************************
 */
export declare class TabCellValueDef extends CellValueDef {
    constructor();
}
/**
 * *********************************
 */
export declare class Attachment {
    name: string;
    attachmentData: any;
    constructor(name: string, attachmentData: any);
}
/**
 * *********************************
 */
/**
 * Top-level class, representing a Catavolt 'Pane' definition.
 * All 'Context' classes have a composite {@link PaneDef} that defines the Pane along with a single record
 * or a list of records.  See {@EntityRecord}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class PaneContext {
    private static ANNO_NAME_KEY;
    private static PROP_NAME_KEY;
    private static CHAR_CHUNK_SIZE;
    static BINARY_CHUNK_SIZE: number;
    entityRecDef: EntityRecDef;
    private _binaryCache;
    private _lastRefreshTime;
    private _parentContext;
    private _paneRef;
    /**
     * Has this 'Pane' been destroyed?
     */
    isDestroyed: boolean;
    /**
     * Updates a settings object with the new settings from a 'Navigation'
     * @param initialSettings
     * @param navRequest
     * @returns {StringDictionary}
     */
    static resolveSettingsFromNavRequest(initialSettings: StringDictionary, navRequest: NavRequest): StringDictionary;
    /**
     *
     * @param paneRef
     * @private
     */
    constructor(paneRef: number);
    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    actionSource: ActionSource;
    /**
     * Load a Binary property from a record
     * @param propName
     * @param entityRec
     * @returns {any}
     */
    binaryAt(propName: string, entityRec: EntityRec): Future<Binary>;
    /**
     * Get the dialog alias
     * @returns {any}
     */
    dialogAlias: string;
    /**
     * Find a menu def on this Pane with the given actionId
     * @param actionId
     * @returns {MenuDef}
     */
    findMenuDefAt(actionId: string): MenuDef;
    /**
     * Get a string representation of this property suitable for 'reading'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForRead(prop: Prop, propName: string): string;
    /**
     * Get a string representation of this property suitable for 'writing'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForWrite(prop: Prop, propName: string): string;
    /**
     * Get the underlying form definition {@link FormDef} for this Pane.
     * If this is not a {@link FormContext} this will be the {@link FormDef} of the owning/parent Form
     * @returns {FormDef}
     */
    formDef: FormDef;
    /**
     * Returns whether or not this pane loaded properly
     * @returns {boolean}
     */
    hasError: boolean;
    /**
     * Return the error associated with this pane, if any
     * @returns {any}
     */
    error: DialogException;
    /**
     * Returns whether or not the data in this pane is out of date
     * @returns {boolean}
     */
    isRefreshNeeded: boolean;
    /**
     * Get the last time this pane's data was refreshed
     * @returns {Date}
     */
    /**
     * @param time
     */
    lastRefreshTime: Date;
    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    menuDefs: Array<MenuDef>;
    /**
     * @private
     * @returns {FormContext|boolean}
     */
    offlineCapable: boolean;
    /**
     * Get the underlying @{link PaneDef} associated with this Context
     * @returns {PaneDef}
     */
    paneDef: PaneDef;
    /**
     * Get the numeric value, representing this Pane's place in the parent {@link FormContext}'s list of child panes.
     * See {@link FormContext.childrenContexts}
     * @returns {number}
     */
    paneRef: number;
    /**
     * Get the title of this Pane
     * @returns {string}
     */
    paneTitle: string;
    /**
     * Get the parent {@link FormContext}
     * @returns {FormContext}
     */
    parentContext: FormContext;
    /**
     * Parses a value to prepare for 'writing' back to the server
     * @param formattedValue
     * @param propName
     * @returns {any}
     */
    parseValue(formattedValue: any, propName: string): any;
    /**
     * Get the propery definition for a property name
     * @param propName
     * @returns {PropDef}
     */
    propDefAtName(propName: string): PropDef;
    /**
     * Get the session information
     * @returns {SessionContext}
     */
    sessionContext: SessionContext;
    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    dialogRedirection: DialogRedirection;
    initialize(): void;
    /**
     * Read all the Binary values in this {@link EntityRec}
     * @param entityRec
     * @returns {Future<Array<Try<Binary>>>}
     */
    readBinaries(entityRec: EntityRec): Future<Array<Try<Binary>>>;
    writeAttachment(attachment: Attachment): Future<void>;
    writeAttachments(entityRec: EntityRec): Future<Array<Try<void>>>;
    /**
     * Write all Binary values in this {@link EntityRecord} back to the server
     * @param entityRec
     * @returns {Future<Array<Try<XWritePropertyResult>>>}
     */
    writeBinaries(entityRec: EntityRec): Future<Array<Try<XWritePropertyResult>>>;
    protected readBinary(propName: string, entityRec: EntityRec): Future<Binary>;
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
export declare class EditorContext extends PaneContext {
    private static GPS_ACCURACY;
    private static GPS_SECONDS;
    private _buffer;
    private _editorState;
    private _entityRecDef;
    private _settings;
    /**
     * @private
     * @param paneRef
     */
    constructor(paneRef: number);
    /**
     * Get the current buffered record
     * @returns {EntityBuffer}
     */
    buffer: EntityBuffer;
    /**
     * Toggle the current mode of this Editor
     * @param paneMode
     * @returns {Future<EntityRecDef>}
     */
    changePaneMode(paneMode: PaneMode): Future<EntityRecDef>;
    /**
     * Get the associated entity record
     * @returns {EntityRec}
     */
    entityRec: EntityRec;
    /**
     * Get the current version of the entity record, with any pending changes present
     * @returns {EntityRec}
     */
    entityRecNow: EntityRec;
    /**
     * Get the associated entity record definition
     * @returns {EntityRecDef}
     */
    entityRecDef: EntityRecDef;
    /**
     * Get the possible values for a 'constrained value' property
     * @param propName
     * @returns {Future<Array<any>>}
     */
    getAvailableValues(propName: string): Future<Array<Object>>;
    /**
     * Returns whether or not this cell definition contains a binary value
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isBinary(cellValueDef: AttributeCellValueDef): boolean;
    /**
     * Returns whether or not this Editor Pane is destroyed
     * @returns {boolean}
     */
    isDestroyed: boolean;
    /**
     * Returns whether or not this Editor is in 'read' mode
     * @returns {boolean}
     */
    isReadMode: boolean;
    /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */
    isReadModeFor(propName: string): boolean;
    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    isWriteMode: boolean;
    /**
     * Perform the action associated with the given MenuDef on this EditorPane.
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param menuDef
     * @param pendingWrites
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menuDef: MenuDef, pendingWrites: EntityRec): Future<NavRequest>;
    /**
     * Properties whose {@link PropDef.canCauseSideEffects} value is true, may change other underlying values in the model.
     * This method will update those underlying values, given the property name that is changing, and the new value.
     * This is frequently used with {@link EditorContext.getAvailableValues}.  When a value is seleted, other properties
     * available values may change. (i.e. Country, State, City dropdowns)
     * @param propertyName
     * @param value
     * @returns {Future<null>}
     */
    processSideEffects(propertyName: string, value: any): Future<void>;
    /**
     * Read (load) the {@link EntityRec} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<EntityRec>}
     */
    read(): Future<EntityRec>;
    /**
     * Get the requested GPS accuracy
     * @returns {Number}
     */
    requestedAccuracy(): number;
    /**
     * Get the requested GPS timeout in seconds
     * @returns {Number}
     */
    requestedTimeoutSeconds(): number;
    /**
     * Set the value of a property in this {@link EntityRecord}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */
    setPropValue(name: string, value: any): any;
    /**
     * Set a binary property from a string formatted as a 'data url'
     * See {@link https://en.wikipedia.org/wiki/Data_URI_scheme}
     * @param name
     * @param dataUrl
     */
    setBinaryPropWithDataUrl(name: string, dataUrl: string): void;
    /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */
    setBinaryPropWithEncodedData(name: string, encodedData: string, mimeType: string): void;
    /**
     * Write this record (i.e. {@link EntityRec}} back to the server
     * @returns {Future<Either<NavRequest, EntityRec>>}
     */
    write(): Future<Either<NavRequest, EntityRec>>;
    /**
     * @private
     */
    initialize(): void;
    /**
     * Get this Editor Pane's settings
     * @returns {StringDictionary}
     */
    settings: StringDictionary;
    protected readBinary(propName: string, entityRec: EntityRec): Future<Binary>;
    private removeSpecialProps(entityRec);
    private initBuffer(entityRec);
    private isDestroyedSetting;
    private isGlobalRefreshSetting;
    private isLocalRefreshSetting;
    private isReadModeSetting;
    private isRefreshSetting;
    private paneModeSetting;
    private putSetting(key, value);
    private putSettings(settings);
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
export declare class FormContext extends PaneContext {
    private _dialogRedirection;
    private _actionSource;
    private _formDef;
    private _childrenContexts;
    private _offlineCapable;
    private _offlineData;
    private _sessionContext;
    private _destroyed;
    private _offlineProps;
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
    constructor(_dialogRedirection: DialogRedirection, _actionSource: ActionSource, _formDef: FormDef, _childrenContexts: Array<PaneContext>, _offlineCapable: boolean, _offlineData: boolean, _sessionContext: SessionContext);
    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    actionSource: ActionSource;
    /**
     * Get the list of child contexts that 'compose' this Form
     * @returns {Array<PaneContext>}
     */
    childrenContexts: Array<PaneContext>;
    /**
     * Close this form
     * @returns {Future<VoidResult>}
     */
    close(): Future<VoidResult>;
    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    dialogRedirection: DialogRedirection;
    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    entityRecDef: EntityRecDef;
    /**
     * Get the underlying Form definition for this FormContext
     * @returns {FormDef}
     */
    formDef: FormDef;
    /**
     * @private
     */
    headerContext: PaneContext;
    /**
     * Perform the action associated with the given MenuDef on this Form
     * @param menuDef
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menuDef: MenuDef): Future<NavRequest>;
    /**
     * Returns whether or not this Form is destroyed
     * @returns {boolean}
     */
    isDestroyed: boolean;
    /**
     * @private
     * @returns {boolean}
     */
    offlineCapable: boolean;
    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    menuDefs: Array<MenuDef>;
    /**
     * @private
     * @returns {StringDictionary}
     */
    offlineProps: StringDictionary;
    /**
     * Get the underlying form definition associated with this FormContext
     * @returns {FormDef}
     */
    paneDef: PaneDef;
    /**
     * Get the current session information
     * @returns {SessionContext}
     */
    sessionContext: SessionContext;
    /** --------------------- MODULE ------------------------------*/
    /**
     * @private
     * @returns {boolean}
     */
    isAnyChildDestroyed: boolean;
    /**
     * @private
     * @param navRequest
     */
    processNavRequestForDestroyed(navRequest: NavRequest): void;
}
/**
 * Enum specifying query direction
 */
export declare enum QueryDirection {
    FORWARD = 0,
    BACKWARD = 1,
}
/**
 * PaneContext Subtype that represents a 'Query Pane'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class QueryContext extends PaneContext {
    private _offlineRecs;
    private _settings;
    private _lastQueryFr;
    private _queryState;
    private _scroller;
    /**
     * @private
     * @param paneRef
     * @param _offlineRecs
     * @param _settings
     */
    constructor(paneRef: number, _offlineRecs?: Array<EntityRec>, _settings?: StringDictionary);
    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    entityRecDef: EntityRecDef;
    /**
     * Returns whether or not a column is of a binary type
     * @param columnDef
     * @returns {PropDef|boolean}
     */
    isBinary(columnDef: ColumnDef): boolean;
    /**
     * Returns whether or not this Query Pane is destroyed
     * @returns {boolean}
     */
    isDestroyed: boolean;
    /**
     * Get the last query result as a {@link Future}
     * @returns {Future<QueryResult>}
     */
    lastQueryFr: Future<QueryResult>;
    /**
     * @private
     * @returns {Array<EntityRec>}
     */
    offlineRecs: Array<EntityRec>;
    /**
     * Get the pane mode
     * @returns {string}
     */
    paneMode: string;
    /**
     * Perform this action associated with the given MenuDef on this Pane.
     * The targets array is expected to be an array of object ids.
     * @param menuDef
     * @param targets
     * @returns {Future<NavRequest>}
     */
    performMenuAction(menuDef: MenuDef, targets: Array<string>): Future<NavRequest>;
    /**
     * Perform a query
     * Note: {@link QueryScroller} is the preferred way to perform a query.
     * see {@link QueryContext.newScroller} and {@link QueryContext.setScroller}
     * @param maxRows
     * @param direction
     * @param fromObjectId
     * @returns {Future<QueryResult>}
     */
    query(maxRows: number, direction: QueryDirection, fromObjectId: string): Future<QueryResult>;
    /**
     * Clear the QueryScroller's buffer and perform this query
     * @returns {Future<Array<EntityRec>>}
     */
    refresh(): Future<Array<EntityRec>>;
    /**
     * Get the associated QueryScroller
     * @returns {QueryScroller}
     */
    scroller: QueryScroller;
    /**
     * Creates a new QueryScroller with the given values
     * @param pageSize
     * @param firstObjectId
     * @param markerOptions
     * @returns {QueryScroller}
     */
    setScroller(pageSize: number, firstObjectId: string, markerOptions: Array<QueryMarkerOption>): QueryScroller;
    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    newScroller(): QueryScroller;
    /**
     * Get the settings associated with this Query
     * @returns {StringDictionary}
     */
    settings(): StringDictionary;
    protected readBinary(propName: string, entityRec: EntityRec): Future<Binary>;
    private isDestroyedSetting;
    private isGlobalRefreshSetting;
    private isLocalRefreshSetting;
    private isRefreshSetting;
}
/**
 * EditorContext Subtype that represents a 'BarcodeScan Pane'.
 * A Barcode Scan is an Editor Pane with the purpose of displaying property values for a single record that
 * represents barcode information.
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}.
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class BarcodeScanContext extends EditorContext {
    constructor(paneRef: number);
    barcodeScanDef: BarcodeScanDef;
}
/**
 * EditorContext Subtype that represents a 'Details Pane'.
 * A Details Pane is an Editor Pane with the purpose of displaying property values for a single record,
 * usually as names/values in a tabular arrangement.
 * See {@link DetailsDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class DetailsContext extends EditorContext {
    constructor(paneRef: number);
    detailsDef: DetailsDef;
    printMarkupURL: string;
}
/**
 * EditorContext Subtype that represents a 'GeoFix Pane'.
 * A GeoFix Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoFixDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class GeoFixContext extends EditorContext {
    constructor(paneRef: number);
    geoFixDef: GeoFixDef;
}
/**
 * EditorContext Subtype that represents a 'GeoLocation Pane'.
 * A GeoLocation Pane is an Editor Pane with the purpose of displaying property values for a single record that
 * represents a GPS location
 * See {@link GeoLocationDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class GeoLocationContext extends EditorContext {
    constructor(paneRef: number);
    geoLocationDef: GeoLocationDef;
}
/**
 * QueryContext Subtype that represents a 'Calendar Pane'.
 * A 'Calendar' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying Calendar related information.
 * See {@link CalendarDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class CalendarContext extends QueryContext {
    constructor(paneRef: number);
    calendarDef: CalendarDef;
}
/**
 * QueryContext Subtype that represents a 'Graph Pane'.
 * A 'Graph' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying graphs and charts.
 * See {@link GraphDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class GraphContext extends QueryContext {
    constructor(paneRef: number);
    graphDef: GraphDef;
}
/**
* QueryContext Subtype that represents an 'Image Picker Pane'.
* An 'Image Picker' is a type of query backed by a list of Records and a single Record definition, with the
* purpose of displaying an Image Picker component.
* See {@link ImagePickerDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
*/
export declare class ImagePickerContext extends QueryContext {
    constructor(paneRef: number);
    imagePickerDef: ImagePickerDef;
}
/**
 * QueryContext Subtype that represents a 'List Pane'.
 * An 'List' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying a tabular list of records.
 * See {@link ListDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class ListContext extends QueryContext {
    constructor(paneRef: number, offlineRecs?: Array<EntityRec>, settings?: StringDictionary);
    columnHeadings: Array<string>;
    listDef: ListDef;
    rowValues(entityRec: EntityRec): Array<any>;
    style: string;
}
/**
 * QueryContext Subtype that represents a 'Map Pane'.
 * A 'Map' is a type of query backed by a list of Records and a single Record definition, with the
 * purpose of displaying an annotated map with location markers.
 * See {@link MapDef}, {@link EntityRec} and {@link EntityRecDef}.
 * Context classes, while similar to {@link PaneDef} and subclasses, contain both the corresponding subtype of pane definition {@link PaneDef}
 * (i.e. describing this UI component, layout, etc.) and also the 'data record(s)' as one or more {@link EntityRec}(s)
 */
export declare class MapContext extends QueryContext {
    constructor(paneRef: number);
    mapDef: MapDef;
}
export declare class PrintMarkupContext extends EditorContext {
    constructor(paneRef: number);
    printMarkupDef: PrintMarkupDef;
}
/**
 * A PaneDef represents a Catavolt 'Pane' definition.  A Pane can be thought of as a 'panel' or UI component
 * that is responsible for displaying a data record or records. The Pane describes 'how' and 'where' the data will be
 * displayed, as well as surrounding 'meta' data (i.e. the Pane title, the Pane's menus).  The Pane itself does not contain
 * the record or records to be displayed, but may be combined with a {@link EntityRecord}(s) to display the data.
 */
export declare class PaneDef {
    private _paneId;
    private _name;
    private _label;
    private _title;
    private _menuDefs;
    private _entityRecDef;
    private _dialogRedirection;
    private _settings;
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
    static fromOpenPaneResult(childXOpenResult: XOpenDialogModelResult, childXComp: XFormModelComp, childXPaneDefRef: XPaneDefRef, childXPaneDef: XPaneDef, childXActiveColDefs: XGetActiveColumnDefsResult, childMenuDefs: Array<MenuDef>, printMarkupXML: string): Try<PaneDef>;
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
    constructor(_paneId: string, _name: string, _label: string, _title: string, _menuDefs: Array<MenuDef>, _entityRecDef: EntityRecDef, _dialogRedirection: DialogRedirection, _settings: StringDictionary);
    /**
     * Get the {@link DialogHandle} associated with this PaneDef
     * @returns {DialogHandle}
     */
    dialogHandle: DialogHandle;
    /**
     * Get the {@link DialogRedirection} with which this Pane was constructed
     * @returns {DialogRedirection}
     */
    dialogRedirection: DialogRedirection;
    /**
     * Get the entity record definition
     * @returns {EntityRecDef}
     */
    entityRecDef: EntityRecDef;
    /**
     * Find the title for this Pane
     * @returns {string}
     */
    findTitle(): string;
    /**
     * Get the label for this Pane
     * @returns {string}
     */
    label: string;
    /**
     * Get the all {@link MenuDef}'s associated with this Pane
     * @returns {Array<MenuDef>}
     */
    menuDefs: Array<MenuDef>;
    name: string;
    paneId: string;
    settings: StringDictionary;
    title: string;
}
/**
 * PaneDef Subtype that describes a Barcode Pane
 */
export declare class BarcodeScanDef extends PaneDef {
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
}
/**
 * PaneDef Subtype that describes a Calendar Pane
 */
export declare class CalendarDef extends PaneDef {
    private _descriptionPropName;
    private _initialStyle;
    private _startDatePropName;
    private _startTimePropName;
    private _endDatePropName;
    private _endTimePropName;
    private _occurDatePropName;
    private _occurTimePropName;
    private _defaultActionId;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _descriptionPropName: string, _initialStyle: string, _startDatePropName: string, _startTimePropName: string, _endDatePropName: string, _endTimePropName: string, _occurDatePropName: string, _occurTimePropName: string, _defaultActionId: string);
    descriptionPropName: string;
    initialStyle: string;
    startDatePropName: string;
    startTimePropName: string;
    endDatePropName: string;
    endTimePropName: string;
    occurDatePropName: string;
    occurTimePropName: string;
    defaultActionId: string;
}
/**
 * PaneDef Subtype that describes a Details Pane
 */
export declare class DetailsDef extends PaneDef {
    private _cancelButtonText;
    private _commitButtonText;
    private _editable;
    private _focusPropName;
    private _graphicalMarkup;
    private _rows;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _cancelButtonText: string, _commitButtonText: string, _editable: boolean, _focusPropName: string, _graphicalMarkup: string, _rows: Array<Array<CellDef>>);
    cancelButtonText: string;
    commitButtonText: string;
    editable: boolean;
    focusPropName: string;
    graphicalMarkup: string;
    rows: Array<Array<CellDef>>;
}
/**
 * PaneDef Subtype that represents an error
 */
export declare class ErrorDef extends PaneDef {
    exception: DialogException;
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
    constructor(dialogRedirection: DialogRedirection, settings: StringDictionary, exception: DialogException);
}
/**
 * PaneDef Subtype that describes a Form Pane
 */
export declare class FormDef extends PaneDef {
    private _formLayout;
    private _formStyle;
    private _borderStyle;
    private _headerDef;
    private _childrenDefs;
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
    static fromOpenFormResult(formXOpenResult: XOpenEditorModelResult, formXFormDef: XFormDef, formMenuDefs: Array<MenuDef>, childrenXOpens: Array<XOpenDialogModelResult>, childrenXPaneDefs: Array<XPaneDef>, childrenXActiveColDefs: Array<XGetActiveColumnDefsResult>, childrenMenuDefs: Array<Array<MenuDef>>, childrenPrintMarkupXML: Array<string>): Try<FormDef>;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _formLayout: string, _formStyle: string, _borderStyle: string, _headerDef: DetailsDef, _childrenDefs: Array<PaneDef>);
    borderStyle: string;
    childrenDefs: Array<PaneDef>;
    formLayout: string;
    formStyle: string;
    headerDef: DetailsDef;
    isCompositeForm: boolean;
    isFlowingLayout: boolean;
    isFlowingTopDownLayout: boolean;
    isFourBoxSquareLayout: boolean;
    isHorizontalLayout: boolean;
    isOptionsFormLayout: boolean;
    isTabsLayout: boolean;
    isThreeBoxOneLeftLayout: boolean;
    isThreeBoxOneOverLayout: boolean;
    isThreeBoxOneRightLayout: boolean;
    isThreeBoxOneUnderLayout: boolean;
    isTopDownLayout: boolean;
    isTwoVerticalLayout: boolean;
}
/**
 * PaneDef Subtype that describes a GeoFix Pane
 */
export declare class GeoFixDef extends PaneDef {
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
}
/**
 * *********************************
 */
/**
 * PaneDef Subtype that describes a GeoLocation Pane
 */
export declare class GeoLocationDef extends PaneDef {
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
}
/**
 * PaneDef Subtype that describes a Graph Pane
 */
export declare class GraphDef extends PaneDef {
    private _defaultActionId;
    private _graphType;
    private _displayQuadrantLines;
    private _identityDataPointDef;
    private _groupingDataPointDef;
    private _dataPointDefs;
    private _filterDataPointDefs;
    private _sampleModel;
    private _xAxisLabel;
    private _xAxisRangeFrom;
    private _xAxisRangeTo;
    private _yAxisLabel;
    private _yAxisRangeFrom;
    private _yAxisRangeTo;
    static GRAPH_TYPE_CARTESIAN: string;
    static GRAPH_TYPE_PIE: string;
    static PLOT_TYPE_BAR: string;
    static PLOT_TYPE_BUBBLE: string;
    static PLOT_TYPE_LINE: string;
    static PLOT_TYPE_SCATTER: string;
    static PLOT_TYPE_STACKED: string;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _defaultActionId: string, _graphType: string, _displayQuadrantLines: boolean, _identityDataPointDef: GraphDataPointDef, _groupingDataPointDef: GraphDataPointDef, _dataPointDefs: Array<GraphDataPointDef>, _filterDataPointDefs: Array<GraphDataPointDef>, _sampleModel: string, _xAxisLabel: string, _xAxisRangeFrom: number, _xAxisRangeTo: number, _yAxisLabel: string, _yAxisRangeFrom: number, _yAxisRangeTo: number);
    dataPointDefs: Array<GraphDataPointDef>;
    defaultActionId: string;
    displayQuadrantLines: boolean;
    filterDataPointDefs: Array<GraphDataPointDef>;
    identityDataPointDef: GraphDataPointDef;
    graphType: string;
    groupingDataPointDef: GraphDataPointDef;
    sampleModel: string;
    xAxisLabel: string;
    xAxisRangeFrom: number;
    xAxisRangeTo: number;
    yAxisLabel: string;
    yAxisRangeFrom: number;
    yAxisRangeTo: number;
}
/**
 * PaneDef Subtype that describes a ImagePicker Pane
 */
export declare class ImagePickerDef extends PaneDef {
    private _URLPropName;
    private _defaultActionId;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _URLPropName: string, _defaultActionId: string);
    defaultActionId: string;
    URLPropName: string;
}
/**
 * PaneDef Subtype that describes a List Pane
 */
export declare class ListDef extends PaneDef {
    private _style;
    private _initialColumns;
    private _activeColumnDefs;
    private _columnsStyle;
    private _defaultActionId;
    private _graphicalMarkup;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _style: string, _initialColumns: number, _activeColumnDefs: Array<ColumnDef>, _columnsStyle: string, _defaultActionId: string, _graphicalMarkup: string);
    activeColumnDefs: Array<ColumnDef>;
    columnsStyle: string;
    defaultActionId: string;
    graphicalMarkup: string;
    initialColumns: number;
    isDefaultStyle: boolean;
    isDetailsFormStyle: boolean;
    isFormStyle: boolean;
    isTabularStyle: boolean;
    style: string;
}
/**
 * PaneDef Subtype that describes a Map Pane
 */
export declare class MapDef extends PaneDef {
    private _descriptionPropName;
    private _streetPropName;
    private _cityPropName;
    private _statePropName;
    private _postalCodePropName;
    private _latitudePropName;
    private _longitudePropName;
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
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _descriptionPropName: string, _streetPropName: string, _cityPropName: string, _statePropName: string, _postalCodePropName: string, _latitudePropName: string, _longitudePropName: string);
    cityPropName: string;
    descriptionPropName: string;
    latitudePropName: string;
    longitudePropName: string;
    postalCodePropName: string;
    statePropName: string;
    streetPropName: string;
}
/**
 * *********************************
 */
/**
 * PaneDef Subtype that describes a Details Pane to be displayed as form
 */
export declare class PrintMarkupDef extends PaneDef {
    private _cancelButtonText;
    private _commitButtonText;
    private _editable;
    private _focusPropName;
    private _printMarkupXML;
    private _rows;
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
     * @param _printMarkup
     * @param _rows
     */
    constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _cancelButtonText: string, _commitButtonText: string, _editable: boolean, _focusPropName: string, _printMarkupXML: string, _rows: Array<Array<CellDef>>);
    cancelButtonText: string;
    commitButtonText: string;
    editable: boolean;
    focusPropName: string;
    printMarkupXML: string;
    rows: Array<Array<CellDef>>;
}
/**
 * *********************************
 */
export declare class BinaryRef {
    private _settings;
    constructor(_settings: StringDictionary);
    static fromWSValue(encodedValue: string, settings: StringDictionary): Try<BinaryRef>;
    settings: StringDictionary;
}
export declare class InlineBinaryRef extends BinaryRef {
    private _inlineData;
    constructor(_inlineData: string, settings: StringDictionary);
    inlineData: string;
    toString(): string;
}
export declare class ObjectBinaryRef extends BinaryRef {
    constructor(settings: StringDictionary);
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
    toUrl(): string;
}
/**
 * Represents a base64 encoded binary
 */
export declare class EncodedBinary implements Binary {
    private _data;
    private _mimeType;
    constructor(_data: string, _mimeType?: string);
    /**
     * Get the base64 encoded data
     * @returns {string}
     */
    data: string;
    /**
     * Get the mime-type
     * @returns {string|string}
     */
    mimeType: string;
    /**
     * Returns a 'data url' representation of this binary, including the encoded data
     * @returns {string}
     */
    toUrl(): string;
}
/**
 * Represents a remote binary
 */
export declare class UrlBinary implements Binary {
    private _url;
    constructor(_url: string);
    url: string;
    /**
     * Returns a url that 'points to' the binary data
     * @returns {string}
     */
    toUrl(): string;
}
/**
 * An object that directs the client to a new resource
 */
export declare class Redirection {
    static fromWS(otype: string, jsonObj: any): Try<Redirection>;
    fromDialogProperties: StringDictionary;
}
/**
 * Type of Redirection that represents a new Catavolt resource on the server
 */
export declare class DialogRedirection extends Redirection {
    private _dialogHandle;
    private _dialogType;
    private _dialogMode;
    private _paneMode;
    private _objectId;
    private _open;
    private _domainClassName;
    private _dialogModelClassName;
    private _dialogProperties;
    private _fromDialogProperties;
    constructor(_dialogHandle: DialogHandle, _dialogType: string, _dialogMode: string, _paneMode: string, _objectId: string, _open: boolean, _domainClassName: string, _dialogModelClassName: string, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
    dialogHandle: DialogHandle;
    dialogMode: string;
    dialogModelClassName: string;
    dialogProperties: StringDictionary;
    dialogType: string;
    domainClassName: string;
    fromDialogProperties: StringDictionary;
    isEditor: boolean;
    isQuery: boolean;
    objectId: string;
    open: boolean;
    paneMode: string;
}
export declare class NullRedirection extends Redirection {
    fromDialogProperties: StringDictionary;
    constructor(fromDialogProperties: StringDictionary);
}
export declare class WebRedirection extends Redirection implements NavRequest {
    private _webURL;
    private _open;
    private _dialogProperties;
    private _fromDialogProperties;
    constructor(_webURL: string, _open: boolean, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
    fromDialogProperties: StringDictionary;
    open: boolean;
    webURL: string;
}
export declare class WorkbenchRedirection extends Redirection {
    private _workbenchId;
    private _dialogProperties;
    private _fromDialogProperties;
    constructor(_workbenchId: string, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
    workbenchId: string;
    dialogProperties: StringDictionary;
    fromDialogProperties: StringDictionary;
}
/**
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export interface EntityRec {
    annos: Array<DataAnno>;
    annosAtName(propName: string): Array<DataAnno>;
    afterEffects(after: EntityRec): EntityRec;
    backgroundColor: string;
    backgroundColorFor(propName: string): string;
    foregroundColor: string;
    foregroundColorFor(propName: string): string;
    imageName: string;
    imageNameFor(propName: string): string;
    imagePlacement: string;
    imagePlacementFor(propName: string): string;
    isBoldText: boolean;
    isBoldTextFor(propName: string): boolean;
    isItalicText: boolean;
    isItalicTextFor(propName: string): boolean;
    isPlacementCenter: boolean;
    isPlacementCenterFor(propName: string): boolean;
    isPlacementLeft: boolean;
    isPlacementLeftFor(propName: string): boolean;
    isPlacementRight: boolean;
    isPlacementRightFor(propName: string): boolean;
    isPlacementStretchUnder: boolean;
    isPlacementStretchUnderFor(propName: string): boolean;
    isPlacementUnder: boolean;
    isPlacementUnderFor(propName: string): boolean;
    isUnderline: boolean;
    isUnderlineFor(propName: string): boolean;
    objectId: string;
    overrideText: string;
    overrideTextFor(propName: string): string;
    propAtIndex(index: number): Prop;
    propAtName(propName: string): Prop;
    propCount: number;
    propNames: Array<string>;
    propValues: Array<any>;
    props: Array<Prop>;
    tipText: string;
    tipTextFor(propName: string): string;
    toEntityRec(): EntityRec;
    toWSEditorRecord(): StringDictionary;
    toWS(): StringDictionary;
    valueAtName(propName: string): any;
}
/**
 * Utility for working with EntityRecs
 */
export declare class EntityRecUtil {
    static newEntityRec(objectId: string, props: Array<Prop>, annos?: Array<DataAnno>): EntityRec;
    static union(l1: Array<Prop>, l2: Array<Prop>): Array<Prop>;
    static fromWSEditorRecord(otype: string, jsonObj: any): Try<EntityRec>;
}
/**
 * An {@link EntityRec} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An EntityRec Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export declare class EntityBuffer implements EntityRec {
    private _before;
    private _after;
    static createEntityBuffer(objectId: string, before: Array<Prop>, after: Array<Prop>): EntityBuffer;
    constructor(_before: EntityRec, _after?: EntityRec);
    after: EntityRec;
    annos: Array<DataAnno>;
    annosAtName(propName: string): Array<DataAnno>;
    afterEffects(afterAnother?: EntityRec): EntityRec;
    backgroundColor: string;
    backgroundColorFor(propName: string): string;
    before: EntityRec;
    foregroundColor: string;
    foregroundColorFor(propName: string): string;
    imageName: string;
    imageNameFor(propName: string): string;
    imagePlacement: string;
    imagePlacementFor(propName: string): string;
    isBoldText: boolean;
    isBoldTextFor(propName: string): boolean;
    isChanged(name: string): boolean;
    isItalicText: boolean;
    isItalicTextFor(propName: string): boolean;
    isPlacementCenter: boolean;
    isPlacementCenterFor(propName: string): boolean;
    isPlacementLeft: boolean;
    isPlacementLeftFor(propName: string): boolean;
    isPlacementRight: boolean;
    isPlacementRightFor(propName: string): boolean;
    isPlacementStretchUnder: boolean;
    isPlacementStretchUnderFor(propName: string): boolean;
    isPlacementUnder: boolean;
    isPlacementUnderFor(propName: string): boolean;
    isUnderline: boolean;
    isUnderlineFor(propName: string): boolean;
    objectId: string;
    overrideText: string;
    overrideTextFor(propName: string): string;
    propAtIndex(index: number): Prop;
    propAtName(propName: string): Prop;
    propCount: number;
    propNames: Array<string>;
    props: Array<Prop>;
    propValues: Array<any>;
    setValue(name: string, value: any): void;
    tipText: string;
    tipTextFor(propName: string): string;
    toEntityRec(): EntityRec;
    toWSEditorRecord(): StringDictionary;
    toWS(): StringDictionary;
    valueAtName(propName: string): any;
}
/**
 * *********************************
 */
/**
 * The implementation of {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export declare class EntityRecImpl implements EntityRec {
    objectId: string;
    props: Array<Prop>;
    annos: Array<DataAnno>;
    constructor(objectId: string, props?: Array<Prop>, annos?: Array<DataAnno>);
    annosAtName(propName: string): Array<DataAnno>;
    afterEffects(after: EntityRec): EntityRec;
    backgroundColor: string;
    backgroundColorFor(propName: string): string;
    foregroundColor: string;
    foregroundColorFor(propName: string): string;
    imageName: string;
    imageNameFor(propName: string): string;
    imagePlacement: string;
    imagePlacementFor(propName: string): string;
    isBoldText: boolean;
    isBoldTextFor(propName: string): boolean;
    isItalicText: boolean;
    isItalicTextFor(propName: string): boolean;
    isPlacementCenter: boolean;
    isPlacementCenterFor(propName: string): boolean;
    isPlacementLeft: boolean;
    isPlacementLeftFor(propName: string): boolean;
    isPlacementRight: boolean;
    isPlacementRightFor(propName: string): boolean;
    isPlacementStretchUnder: boolean;
    isPlacementStretchUnderFor(propName: string): boolean;
    isPlacementUnder: boolean;
    isPlacementUnderFor(propName: string): boolean;
    isUnderline: boolean;
    isUnderlineFor(propName: string): boolean;
    overrideText: string;
    overrideTextFor(propName: string): string;
    propAtIndex(index: number): Prop;
    propAtName(propName: string): Prop;
    propCount: number;
    propNames: Array<string>;
    propValues: Array<any>;
    tipText: string;
    tipTextFor(propName: string): string;
    toEntityRec(): EntityRec;
    toWSEditorRecord(): StringDictionary;
    toWS(): StringDictionary;
    valueAtName(propName: string): any;
}
/**
 * *********************************
 */
/**
 * An empty or uninitialized {@link EntityRec}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export declare class NullEntityRec implements EntityRec {
    static singleton: NullEntityRec;
    constructor();
    annos: Array<DataAnno>;
    annosAtName(propName: string): Array<DataAnno>;
    afterEffects(after: EntityRec): EntityRec;
    backgroundColor: string;
    backgroundColorFor(propName: string): string;
    foregroundColor: string;
    foregroundColorFor(propName: string): string;
    imageName: string;
    imageNameFor(propName: string): string;
    imagePlacement: string;
    imagePlacementFor(propName: string): string;
    isBoldText: boolean;
    isBoldTextFor(propName: string): boolean;
    isItalicText: boolean;
    isItalicTextFor(propName: string): boolean;
    isPlacementCenter: boolean;
    isPlacementCenterFor(propName: string): boolean;
    isPlacementLeft: boolean;
    isPlacementLeftFor(propName: string): boolean;
    isPlacementRight: boolean;
    isPlacementRightFor(propName: string): boolean;
    isPlacementStretchUnder: boolean;
    isPlacementStretchUnderFor(propName: string): boolean;
    isPlacementUnder: boolean;
    isPlacementUnderFor(propName: string): boolean;
    isUnderline: boolean;
    isUnderlineFor(propName: string): boolean;
    objectId: string;
    overrideText: string;
    overrideTextFor(propName: string): string;
    propAtIndex(index: number): Prop;
    propAtName(propName: string): Prop;
    propCount: number;
    propNames: Array<string>;
    props: Array<Prop>;
    propValues: Array<any>;
    tipText: string;
    tipTextFor(propName: string): string;
    toEntityRec(): EntityRec;
    toWSEditorRecord(): StringDictionary;
    toWS(): StringDictionary;
    valueAtName(propName: string): any;
}
/**
 * *********************************
 */
export interface ActionSource {
    fromActionSource: ActionSource;
    virtualPathSuffix: Array<string>;
}
/**
 * Top-level entry point into the Catavolt API
 */
export declare class AppContext {
    private static _singleton;
    private static ONE_DAY_IN_MILLIS;
    lastMaintenanceTime: Date;
    private _appContextState;
    private _appWinDefTry;
    private _deviceProps;
    private _sessionContextTry;
    private _tenantSettingsTry;
    static defaultTTLInMillis: number;
    /**
     * Get the singleton instance of the AppContext
     * @returns {AppContext}
     */
    static singleton: AppContext;
    /**
     * Construct an AppContext
     * This should not be called directly, instead use the 'singleton' method
     * @private
     */
    constructor();
    /**
     * Get the AppWinDef Try
     * @returns {Try<AppWinDef>}
     */
    appWinDefTry: Try<AppWinDef>;
    /**
     * Get the device props
     * @returns {Array<string>}
     */
    deviceProps: Array<string>;
    /**
     * Checked logged in status
     * @returns {boolean}
     */
    isLoggedIn: boolean;
    /**
     * Open a {@link WorkbenchLaunchAction} expecting a Redirection
     * @param launchAction
     * @returns {Future<Redirection>}
     */
    getRedirForLaunchAction(launchAction: WorkbenchLaunchAction): Future<Redirection>;
    /**
     * Get a Worbench by workbenchId
     * @param sessionContext
     * @param workbenchId
     * @returns {Future<Workbench>}
     */
    getWorkbench(sessionContext: SessionContext, workbenchId: string): Future<Workbench>;
    /**
     * Log in and retrieve the AppWinDef
     * @param gatewayHost
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */
    login(gatewayHost: string, tenantId: string, clientType: string, userId: string, password: string): Future<AppWinDef>;
    /**
     * Login directly to a given url, bypassing the gateway host
     * @param url
     * @param tenantId
     * @param clientType
     * @param userId
     * @param password
     * @returns {Future<AppWinDef>}
     */
    loginDirectly(url: string, tenantId: string, clientType: string, userId: string, password: string): Future<AppWinDef>;
    /**
     * Logout and destroy the session
     * @returns {any}
     */
    logout(): Future<VoidResult>;
    /**
     * Login and create a new SessionContext
     *
     * @param systemContext
     * @param tenantId
     * @param userId
     * @param password
     * @param deviceProps
     * @param clientType
     * @returns {Future<SessionContext>}
     */
    newSessionContext(systemContext: SystemContext, tenantId: string, userId: string, password: string, deviceProps: Array<string>, clientType: string): Future<SessionContext>;
    /**
     * Get a SystemContext obj (containing the server endpoint)
     *
     * @param gatewayHost
     * @param tenantId
     * @returns {Future<SystemContextImpl>}
     */
    newSystemContext(gatewayHost: string, tenantId: string): Future<SystemContext>;
    /**
     * Open a redirection
     *
     * @param redirection
     * @param actionSource
     * @returns {Future<NavRequest>}
     */
    openRedirection(redirection: Redirection, actionSource: ActionSource): Future<NavRequest>;
    /**
     * Open a {@link WorkbenchLaunchAction}
     * @param launchAction
     * @returns {any}
     */
    performLaunchAction(launchAction: WorkbenchLaunchAction): Future<NavRequest>;
    /**
     * Refresh the AppContext
     * @param sessionContext
     * @param deviceProps
     * @returns {Future<AppWinDef>}
     */
    refreshContext(sessionContext: SessionContext): Future<AppWinDef>;
    /**
     * Get the SessionContext Try
     * @returns {Try<SessionContext>}
     */
    sessionContextTry: Try<SessionContext>;
    /**
     * Get the tenant settings Try
     * @returns {Try<StringDictionary>}
     */
    tenantSettingsTry: Try<StringDictionary>;
    private finalizeContext(sessionContext, deviceProps);
    private loginOnline(gatewayHost, tenantId, clientType, userId, password, deviceProps);
    private loginFromSystemContext(systemContext, tenantId, userId, password, deviceProps, clientType);
    private performLaunchActionOnline(launchAction, sessionContext);
    private setAppContextStateToLoggedIn(appContextValues);
    private setAppContextStateToLoggedOut();
}
/**
 * *********************************
 */
/**
 * Represents a singlel 'Window' definition, retrieved upon login.
 * Workbenches can be obtained through this object.
 */
export declare class AppWinDef {
    private _workbenches;
    private _applicationVendors;
    private _windowTitle;
    private _windowWidth;
    private _windowHeight;
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
    constructor(workbenches: Array<Workbench>, appVendors: Array<string>, windowTitle: string, windowWidth: number, windowHeight: number);
    /**
     * Get the app vendors array
     * @returns {Array<string>}
     */
    appVendors: Array<string>;
    /**
     * Get the window height
     * @returns {number}
     */
    windowHeight: number;
    /**
     * Get the window title
     * @returns {string}
     */
    windowTitle: string;
    /**
     * Get the window width
     * @returns {number}
     */
    windowWidth: number;
    /**
     * Get the list of available Workbenches
     * @returns {Array<Workbench>}
     */
    workbenches: Array<Workbench>;
}
/**
 * *********************************
 */
export declare class CellDef {
    private _values;
    constructor(_values: Array<CellValueDef>);
    values: Array<CellValueDef>;
}
/**
 * *********************************
 */
export declare class CodeRef {
    private _code;
    private _description;
    static fromFormattedValue(value: string): CodeRef;
    constructor(_code: string, _description: string);
    code: string;
    description: string;
    toString(): string;
}
/**
 * *********************************
 */
export declare class ColumnDef {
    private _name;
    private _heading;
    private _propertyDef;
    constructor(_name: string, _heading: string, _propertyDef: PropDef);
    heading: string;
    isInlineMediaStyle: boolean;
    name: string;
    propertyDef: PropDef;
}
/**
 * *********************************
 */
export declare class ContextAction implements ActionSource {
    actionId: string;
    objectId: string;
    fromActionSource: ActionSource;
    constructor(actionId: string, objectId: string, fromActionSource: ActionSource);
    virtualPathSuffix: Array<string>;
}
/**
 * *********************************
 */
export declare class DataAnno {
    private _name;
    private _value;
    private static BOLD_TEXT;
    private static BACKGROUND_COLOR;
    private static FOREGROUND_COLOR;
    private static IMAGE_NAME;
    private static IMAGE_PLACEMENT;
    private static ITALIC_TEXT;
    private static OVERRIDE_TEXT;
    private static TIP_TEXT;
    private static UNDERLINE;
    private static TRUE_VALUE;
    private static PLACEMENT_CENTER;
    private static PLACEMENT_LEFT;
    private static PLACEMENT_RIGHT;
    private static PLACEMENT_UNDER;
    private static PLACEMENT_STRETCH_UNDER;
    static annotatePropsUsingWSDataAnnotation(props: Array<Prop>, jsonObj: StringDictionary): Try<Array<Prop>>;
    static backgroundColor(annos: Array<DataAnno>): string;
    static foregroundColor(annos: Array<DataAnno>): string;
    static fromWS(otype: string, jsonObj: any): Try<Array<DataAnno>>;
    static imageName(annos: Array<DataAnno>): string;
    static imagePlacement(annos: Array<DataAnno>): string;
    static isBoldText(annos: Array<DataAnno>): boolean;
    static isItalicText(annos: Array<DataAnno>): boolean;
    static isPlacementCenter(annos: Array<DataAnno>): boolean;
    static isPlacementLeft(annos: Array<DataAnno>): boolean;
    static isPlacementRight(annos: Array<DataAnno>): boolean;
    static isPlacementStretchUnder(annos: Array<DataAnno>): boolean;
    static isPlacementUnder(annos: Array<DataAnno>): boolean;
    static isUnderlineText(annos: Array<DataAnno>): boolean;
    static overrideText(annos: Array<DataAnno>): string;
    static tipText(annos: Array<DataAnno>): string;
    static toListOfWSDataAnno(annos: Array<DataAnno>): StringDictionary;
    private static parseString(formatted);
    constructor(_name: string, _value: string);
    backgroundColor: string;
    foregroundColor: string;
    equals(dataAnno: DataAnno): boolean;
    isBackgroundColor: boolean;
    isBoldText: boolean;
    isForegroundColor: boolean;
    isImageName: boolean;
    isImagePlacement: boolean;
    isItalicText: boolean;
    isOverrideText: boolean;
    isPlacementCenter: boolean;
    isPlacementLeft: boolean;
    isPlacementRight: boolean;
    isPlacementStretchUnder: boolean;
    isPlacementUnder: boolean;
    isTipText: boolean;
    isUnderlineText: boolean;
    name: string;
    value: string;
    toWS(): StringDictionary;
}
/**
 * *********************************
 */
export declare class DialogException {
    iconName: string;
    message: string;
    name: string;
    stackTrace: string;
    title: string;
    cause: DialogException;
    userMessages: Array<UserMessage>;
    constructor(iconName?: string, message?: string, name?: string, stackTrace?: string, title?: string, cause?: DialogException, userMessages?: Array<UserMessage>);
}
export declare class UserMessage {
    message: string;
    messageType: string;
    explanation: string;
    propertyNames: Array<string>;
    constructor(message: string, messageType: string, explanation: string, propertyNames: Array<string>);
}
/**
 * *********************************
 */
export declare class DialogHandle {
    handleValue: number;
    sessionHandle: string;
    constructor(handleValue: number, sessionHandle: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class DialogService {
    private static EDITOR_SERVICE_NAME;
    private static EDITOR_SERVICE_PATH;
    private static QUERY_SERVICE_NAME;
    private static QUERY_SERVICE_PATH;
    private static ATTACHMENT_PATH;
    static addAttachment(dialogHandle: DialogHandle, attachment: Attachment, sessionContext: SessionContext): Future<void>;
    static changePaneMode(dialogHandle: DialogHandle, paneMode: PaneMode, sessionContext: SessionContext): Future<XChangePaneModeResult>;
    static closeEditorModel(dialogHandle: DialogHandle, sessionContext: SessionContext): Future<VoidResult>;
    static getAvailableValues(dialogHandle: DialogHandle, propertyName: string, pendingWrites: EntityRec, sessionContext: SessionContext): Future<XGetAvailableValuesResult>;
    static getActiveColumnDefs(dialogHandle: DialogHandle, sessionContext: SessionContext): Future<XGetActiveColumnDefsResult>;
    static getEditorModelMenuDefs(dialogHandle: DialogHandle, sessionContext: SessionContext): Future<Array<MenuDef>>;
    static getEditorModelPaneDef(dialogHandle: DialogHandle, paneId: string, sessionContext: SessionContext): Future<XPaneDef>;
    static getQueryModelMenuDefs(dialogHandle: DialogHandle, sessionContext: SessionContext): Future<Array<MenuDef>>;
    static openEditorModelFromRedir(redirection: DialogRedirection, sessionContext: SessionContext): Future<XOpenEditorModelResult>;
    static openQueryModelFromRedir(redirection: DialogRedirection, sessionContext: SessionContext): Future<XOpenQueryModelResult>;
    static performEditorAction(dialogHandle: DialogHandle, actionId: string, pendingWrites: EntityRec, sessionContext: SessionContext): Future<Redirection>;
    static performQueryAction(dialogHandle: DialogHandle, actionId: string, targets: Array<string>, sessionContext: SessionContext): Future<Redirection>;
    static processSideEffects(dialogHandle: DialogHandle, sessionContext: SessionContext, propertyName: string, propertyValue: any, pendingWrites: EntityRec): Future<XPropertyChangeResult>;
    static queryQueryModel(dialogHandle: DialogHandle, direction: QueryDirection, maxRows: number, fromObjectId: string, sessionContext: SessionContext): Future<XQueryResult>;
    static readEditorModel(dialogHandle: DialogHandle, sessionContext: SessionContext): Future<XReadResult>;
    static readEditorProperty(dialogHandle: DialogHandle, propertyName: string, readSeq: number, readLength: number, sessionContext: SessionContext): Future<XReadPropertyResult>;
    static readQueryProperty(dialogHandle: DialogHandle, propertyName: string, objectId: string, readSeq: number, readLength: number, sessionContext: SessionContext): Future<XReadPropertyResult>;
    static writeEditorModel(dialogHandle: DialogHandle, entityRec: EntityRec, sessionContext: SessionContext): Future<Either<Redirection, XWriteResult>>;
    static writeProperty(dialogHandle: DialogHandle, propertyName: string, data: string, append: boolean, sessionContext: SessionContext): Future<XWritePropertyResult>;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class DialogTriple {
    static extractList<A>(jsonObject: StringDictionary, Ltype: string, extractor: MapFn<any, Try<A>>): Try<A[]>;
    static extractRedirection(jsonObject: StringDictionary, Otype: string): Try<Redirection>;
    static extractTriple<A>(jsonObject: StringDictionary, Otype: string, extractor: TryClosure<A>): Try<Either<Redirection, A>>;
    static extractValue<A>(jsonObject: StringDictionary, Otype: string, extractor: TryClosure<A>): Try<A>;
    static extractValueIgnoringRedirection<A>(jsonObject: StringDictionary, Otype: string, extractor: TryClosure<A>): Try<A>;
    static fromWSDialogObject<A>(obj: any, Otype: string, factoryFn?: (otype: string, jsonObj?) => any, ignoreRedirection?: boolean): Try<A>;
    static fromListOfWSDialogObject<A>(jsonObject: StringDictionary, Ltype: string, factoryFn?: (otype: string, jsonObj?) => any, ignoreRedirection?: boolean): Try<Array<A>>;
    static fromWSDialogObjectResult<A>(jsonObject: StringDictionary, resultOtype: string, targetOtype: string, objPropName: string, factoryFn?: (otype: string, jsonObj?) => any): Try<A>;
    static fromWSDialogObjectsResult<A>(jsonObject: StringDictionary, resultOtype: string, targetLtype: string, objPropName: string, factoryFn?: (otype: string, jsonObj?) => any): Try<Array<A>>;
    private static _extractTriple<A>(jsonObject, Otype, ignoreRedirection, extractor);
    private static _extractValue<A>(jsonObject, Otype, ignoreRedirection, extractor);
}
/**
 * In the same way that a {@link PropDef} describes a {@link Prop}, an EntityRecDef describes an {@link EntityRec}.
 * It is composed of {@link PropDef}s while the {@link EntityRec} is composed of {@link Prop}s.
 * In other words it describes the structure or makeup of a row or record, but does not contain the data values themselves.
 * The corresponding {@link EntityRec} contains the actual values.
  */
export declare class EntityRecDef {
    private _propDefs;
    constructor(_propDefs: Array<PropDef>);
    propCount: number;
    propDefAtName(name: string): PropDef;
    propDefs: Array<PropDef>;
    propertyDefs: Array<PropDef>;
    propNames: Array<string>;
}
/**
 * Utility to construct a FormContext hierarchy from a {@link DialogRedirection}.
 */
export declare class FormContextBuilder {
    private _dialogRedirection;
    private _actionSource;
    private _sessionContext;
    private _initialFormXOpenFr;
    private _initialXFormDefFr;
    static createWithRedirection(dialogRedirection: DialogRedirection, actionSource: ActionSource, sessionContext: SessionContext): FormContextBuilder;
    static createWithInitialForm(initialFormXOpenFr: Future<XOpenEditorModelResult>, initialXFormDefFr: Future<XFormDef>, dialogRedirection: DialogRedirection, actionSource: ActionSource, sessionContext: SessionContext): FormContextBuilder;
    constructor();
    /**
     * Get the action source for this Pane
     * @returns {ActionSource}
     */
    actionSource: ActionSource;
    build(): Future<FormContext>;
    /**
     * Get the {@link DialogRedirection} with which this Form was constructed
     * @returns {DialogRedirection}
     */
    dialogRedirection: DialogRedirection;
    sessionContext: SessionContext;
    private buildFormModelForNestedForm(topFormXOpen, formModelComp, childFormModelComps);
    private completeOpenPromise(flattened);
    private containsNestedForms(formXOpen, xFormDef);
    private createChildrenContexts(formDef);
    private fetchChildrenActiveColDefs(formXOpen);
    private fetchChildrenMenuDefs(formXOpen);
    private fetchChildrenXPaneDefs(formXOpen, xFormDef);
    private fetchChildrenPrintMarkupXMLs(formXOpen);
    private fetchXFormDefWithXOpenResult(xformOpenResult);
    private fetchXFormDef(dialogHandle, formPaneId);
    private getFlattenedResults(openAllResults);
    private loadNestedForms(formXOpen, xFormDef);
    private openChildren(formXOpen);
    private retrieveChildFormContexts(flattened);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class GatewayService {
    static getServiceEndpoint(tenantId: string, serviceName: string, gatewayHost: string): Future<ServiceEndpoint>;
}
/**
 * *********************************
 */
export declare class GeoFix {
    private _latitude;
    private _longitude;
    private _source;
    private _accuracy;
    static fromFormattedValue(value: string): GeoFix;
    constructor(_latitude: number, _longitude: number, _source: string, _accuracy: number);
    latitude: number;
    longitude: number;
    source: string;
    accuracy: number;
    toString(): string;
}
/**
 * *********************************
 */
export declare class GeoLocation {
    private _latitude;
    private _longitude;
    static fromFormattedValue(value: string): GeoLocation;
    constructor(_latitude: number, _longitude: number);
    latitude: number;
    longitude: number;
    toString(): string;
}
/**
 * *********************************
 */
export declare class GraphDataPointDef {
    name: string;
    type: string;
    plotType: string;
    legendKey: string;
    bubbleRadiusName: string;
    bubbleRadiusType: string;
    seriesColor: string;
    xAxisName: string;
    xAxisType: string;
    constructor(name: string, type: string, plotType: string, legendKey: string, bubbleRadiusName: string, bubbleRadiusType: string, seriesColor: string, xAxisName: string, xAxisType: string);
}
/**
 * *********************************
 */
export declare class MenuDef {
    private _name;
    private _type;
    private _actionId;
    private _mode;
    private _label;
    private _iconName;
    private _directive;
    private _showOnMenu;
    private _menuDefs;
    static findSubMenuDef(md: MenuDef, matcher: (menuDef: MenuDef) => boolean): MenuDef;
    constructor(_name: string, _type: string, _actionId: string, _mode: string, _label: string, _iconName: string, _directive: string, _showOnMenu: boolean, _menuDefs: Array<MenuDef>);
    actionId: string;
    directive: string;
    findAtId(actionId: string): MenuDef;
    findContextMenuDef(): MenuDef;
    iconName: string;
    isPresaveDirective: boolean;
    isRead: boolean;
    isSeparator: boolean;
    isWrite: boolean;
    label: string;
    /**
     * Get the child {@link MenuDef}'s
     * @returns {Array<MenuDef>}
     */
    menuDefs: Array<MenuDef>;
    mode: string;
    name: string;
    showOnMenu: boolean;
    type: string;
}
/**
 * *********************************
 */
export interface NavRequest {
}
export declare class NavRequestUtil {
    static fromRedirection(redirection: Redirection, actionSource: ActionSource, sessionContext: SessionContext): Future<NavRequest>;
}
/**
 * *********************************
 */
export declare class NullNavRequest implements NavRequest {
    fromDialogProperties: StringDictionary;
    constructor();
}
/**
 * *********************************
 */
export declare class ObjectRef {
    private _objectId;
    private _description;
    static fromFormattedValue(value: string): ObjectRef;
    constructor(_objectId: string, _description: string);
    description: string;
    objectId: string;
    toString(): string;
}
/**
 * *********************************
 */
export declare enum PaneMode {
    READ = 0,
    WRITE = 1,
}
/**
 * Contains information that 'defines' a property {@link Prop} (name/value)
 * The information describes the property and can be thought of as the property 'type.
 * An instance of the {@link Prop} contains the actual data value.
 */
export declare class PropDef {
    private _name;
    private _type;
    private _elementType;
    private _style;
    private _propertyLength;
    private _propertyScale;
    private _presLength;
    private _presScale;
    private _dataDictionaryKey;
    private _maintainable;
    private _writeEnabled;
    private _canCauseSideEffects;
    static STYLE_INLINE_MEDIA: string;
    static STYLE_INLINE_MEDIA2: string;
    constructor(_name: string, _type: string, _elementType: string, _style: string, _propertyLength: number, _propertyScale: number, _presLength: number, _presScale: number, _dataDictionaryKey: string, _maintainable: boolean, _writeEnabled: boolean, _canCauseSideEffects: boolean);
    /**
     * Gets whether or not a refresh is needed after a change in this property's value
     * @returns {boolean}
     */
    canCauseSideEffects: boolean;
    dataDictionaryKey: string;
    elementType: string;
    isBarcodeType: boolean;
    isBinaryType: boolean;
    isBooleanType: boolean;
    isCodeRefType: boolean;
    isDateType: boolean;
    isDateTimeType: boolean;
    isDecimalType: boolean;
    isDoubleType: boolean;
    isEmailType: boolean;
    isFileAttachment: boolean;
    isGeoFixType: boolean;
    isGeoLocationType: boolean;
    isHTMLType: boolean;
    isListType: boolean;
    isInlineMediaStyle: boolean;
    isIntType: boolean;
    isLargeBinaryType: boolean;
    isLongType: boolean;
    isMoneyType: boolean;
    isNumericType: boolean;
    isObjRefType: boolean;
    isPasswordType: boolean;
    isPercentType: boolean;
    isStringType: boolean;
    isTelephoneType: boolean;
    isTextBlock: boolean;
    isTimeType: boolean;
    isUnformattedNumericType: boolean;
    isURLType: boolean;
    maintainable: boolean;
    name: string;
    presLength: number;
    presScale: number;
    propertyLength: number;
    propertyScale: number;
    style: string;
    type: string;
    writeEnabled: boolean;
}
/**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */
export declare class PropFormatter {
    /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForRead(prop: Prop, propDef: PropDef): string;
    static formatValueForRead(value: any, propDef: PropDef): string;
    /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForWrite(prop: Prop, propDef: PropDef): string;
    /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value.
     * @param value
     * @param propDef
     * @returns {any}
     */
    static parse(value: any, propDef: PropDef): any;
    /**
     * Render this value as a string
     * @param o
     * @param propDef
     * @returns {any}
     */
    static toString(o: any, propDef: PropDef): string;
}
/**
 * Represents a 'value' or field in a row or record. See {@link EntityRec}
 * A Prop has a corresponding {@link PropDef} that describes the property.
 * Like an {@link EntityRec}, a Prop may also have {@link DataAnno}s (style annotations),
 * but these apply to the property only
 */
export declare class Prop {
    private _name;
    private _value;
    private _annos;
    /**
     * @private
     * @param values
     * @returns {Success}
     */
    static fromListOfWSValue(values: Array<any>): Try<Array<any>>;
    /**
     * @private
     * @param name
     * @param value
     * @returns {any}
     */
    static fromWSNameAndWSValue(name: string, value: any): Try<Prop>;
    /**
     * @private
     * @param names
     * @param values
     * @returns {any}
     */
    static fromWSNamesAndValues(names: Array<string>, values: Array<any>): Try<Array<Prop>>;
    /**
     * @private
     * @param value
     * @returns {any}
     */
    static fromWSValue(value: any): Try<any>;
    /**
     * @private
     * @param otype
     * @param jsonObj
     * @returns {any}
     */
    static fromWS(otype: string, jsonObj: any): Try<Prop>;
    /**
     * @private
     * @param o
     * @returns {any}
     */
    static toWSProperty(o: any): any;
    /**
     *
     * @param list
     * @returns {StringDictionary}
     */
    static toWSListOfProperties(list: Array<any>): StringDictionary;
    /**
     * @private
     * @param list
     * @returns {{WS_LTYPE: string, values: Array<string>}}
     */
    static toWSListOfString(list: Array<string>): StringDictionary;
    /**
     *
     * @private
     * @param props
     * @returns {StringDictionary}
     */
    static toListOfWSProp(props: Array<Prop>): StringDictionary;
    /**
     *
     * @private
     * @param _name
     * @param _value
     * @param _annos
     */
    constructor(_name: string, _value: any, _annos?: Array<DataAnno>);
    /**
     * Get the data annotations associated with this property
     * @returns {Array<DataAnno>}
     */
    annos: Array<DataAnno>;
    equals(prop: Prop): boolean;
    backgroundColor: string;
    foregroundColor: string;
    imageName: string;
    imagePlacement: string;
    isBoldText: boolean;
    isItalicText: boolean;
    isPlacementCenter: boolean;
    isPlacementLeft: boolean;
    isPlacementRight: boolean;
    isPlacementStretchUnder: boolean;
    isPlacementUnder: boolean;
    isUnderline: boolean;
    /**
     * Get the property name
     * @returns {string}
     */
    name: string;
    overrideText: string;
    tipText: string;
    /**
     * Get the property value
     * @returns {any}
     */
    value: any;
    /**
     * @private
     * @returns {StringDictionary}
     */
    toWS(): StringDictionary;
}
/**
 * *********************************
 */
export declare class QueryResult {
    entityRecs: Array<EntityRec>;
    hasMore: boolean;
    constructor(entityRecs: Array<EntityRec>, hasMore: boolean);
}
/**
 * *********************************
 */
export declare class HasMoreQueryMarker extends NullEntityRec {
    static singleton: HasMoreQueryMarker;
}
export declare class IsEmptyQueryMarker extends NullEntityRec {
    static singleton: IsEmptyQueryMarker;
}
export declare enum QueryMarkerOption {
    None = 0,
    IsEmpty = 1,
    HasMore = 2,
}
export declare class QueryScroller {
    private _context;
    private _pageSize;
    private _firstObjectId;
    private _markerOptions;
    private _buffer;
    private _hasMoreBackward;
    private _hasMoreForward;
    private _nextPageFr;
    private _prevPageFr;
    private _firstResultOid;
    constructor(_context: QueryContext, _pageSize: number, _firstObjectId: string, _markerOptions?: Array<QueryMarkerOption>);
    buffer: Array<EntityRec>;
    bufferWithMarkers: Array<EntityRec>;
    context: QueryContext;
    firstObjectId: string;
    hasMoreBackward: boolean;
    hasMoreForward: boolean;
    isComplete: boolean;
    isCompleteAndEmpty: boolean;
    isEmpty: boolean;
    pageBackward(): Future<Array<EntityRec>>;
    pageForward(): Future<Array<EntityRec>>;
    pageSize: number;
    refresh(): Future<Array<EntityRec>>;
    trimFirst(n: number): void;
    trimLast(n: number): void;
    private clear();
}
/**
 * *********************************
 */
export interface ServiceEndpoint {
    serverAssignment: string;
    tenantId: string;
    responseType: string;
    soiVersion: string;
}
/**
 * *********************************
 */
export declare class SessionContextImpl implements SessionContext {
    private _clientType;
    private _gatewayHost;
    private _password;
    private _remoteSession;
    private _userId;
    currentDivision: string;
    serverVersion: string;
    sessionHandle: string;
    systemContext: SystemContext;
    tenantId: string;
    userName: string;
    static fromWSCreateSessionResult(jsonObject: {
        [id: string]: any;
    }, systemContext: SystemContext, tenantId: string): Try<SessionContext>;
    static createSessionContext(gatewayHost: string, tenantId: string, clientType: string, userId: string, password: string): SessionContext;
    constructor(sessionHandle: string, userName: string, currentDivision: string, serverVersion: string, systemContext: SystemContext, tenantId: string);
    clientType: string;
    gatewayHost: string;
    isLocalSession: boolean;
    isRemoteSession: boolean;
    password: string;
    userId: string;
    online: boolean;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class SessionService {
    private static SERVICE_NAME;
    private static SERVICE_PATH;
    static createSession(tenantId: string, userId: string, password: string, clientType: string, systemContext: SystemContext): Future<SessionContext>;
    static deleteSession(sessionContext: SessionContext): Future<VoidResult>;
    static getSessionListProperty(propertyName: string, sessionContext: SessionContext): Future<XGetSessionListPropertyResult>;
    static setSessionListProperty(propertyName: string, listProperty: Array<string>, sessionContext: SessionContext): Future<VoidResult>;
}
/**
 * *********************************
 */
export declare class SortPropDef {
    private _name;
    private _direction;
    constructor(_name: string, _direction: string);
    direction: string;
    name: string;
}
/**
 * *********************************
 */
export declare class SystemContextImpl implements SystemContext {
    private _urlString;
    constructor(_urlString: string);
    urlString: string;
}
/**
 * *********************************
 */
export interface VoidResult {
}
/**
 * *********************************
 */
export declare class WorkbenchLaunchAction implements ActionSource {
    id: string;
    workbenchId: string;
    name: string;
    alias: string;
    iconBase: string;
    constructor(id: string, workbenchId: string, name: string, alias: string, iconBase: string);
    actionId: string;
    fromActionSource: ActionSource;
    virtualPathSuffix: Array<string>;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class WorkbenchService {
    private static SERVICE_NAME;
    private static SERVICE_PATH;
    static getAppWinDef(sessionContext: SessionContext): Future<AppWinDef>;
    static getWorkbench(sessionContext: SessionContext, workbenchId: string): Future<Workbench>;
    static performLaunchAction(actionId: string, workbenchId: string, sessionContext: SessionContext): Future<Redirection>;
}
/**
 * *********************************
 */
export declare class Workbench implements NavRequest {
    private _id;
    private _name;
    private _alias;
    private _actions;
    constructor(_id: string, _name: string, _alias: string, _actions: Array<WorkbenchLaunchAction>);
    alias: string;
    getLaunchActionById(launchActionId: string): any;
    name: string;
    workbenchId: string;
    workbenchLaunchActions: Array<WorkbenchLaunchAction>;
}
/**
 * @private
 */
export declare class XPaneDef {
    static fromWS(otype: string, jsonObj: any): Try<XPaneDef>;
    constructor();
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XBarcodeScanDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    constructor(paneId: string, name: string, title: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XCalendarDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    descriptionProperty: string;
    initialStyle: string;
    startDateProperty: string;
    startTimeProperty: string;
    endDateProperty: string;
    endTimeProperty: string;
    occurDateProperty: string;
    occurTimeProperty: string;
    constructor(paneId: string, name: string, title: string, descriptionProperty: string, initialStyle: string, startDateProperty: string, startTimeProperty: string, endDateProperty: string, endTimeProperty: string, occurDateProperty: string, occurTimeProperty: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XChangePaneModeResult {
    editorRecordDef: EntityRecDef;
    dialogProperties: StringDictionary;
    constructor(editorRecordDef: EntityRecDef, dialogProperties: StringDictionary);
    entityRecDef: EntityRecDef;
    dialogProps: StringDictionary;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XDetailsDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    cancelButtonText: string;
    commitButtonText: string;
    editable: boolean;
    focusPropertyName: string;
    overrideGML: string;
    rows: Array<Array<CellDef>>;
    constructor(paneId: string, name: string, title: string, cancelButtonText: string, commitButtonText: string, editable: boolean, focusPropertyName: string, overrideGML: string, rows: Array<Array<CellDef>>);
    graphicalMarkup: string;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XFormDef extends XPaneDef {
    borderStyle: string;
    formLayout: string;
    formStyle: string;
    name: string;
    paneId: string;
    title: string;
    headerDefRef: XPaneDefRef;
    paneDefRefs: Array<XPaneDefRef>;
    constructor(borderStyle: string, formLayout: string, formStyle: string, name: string, paneId: string, title: string, headerDefRef: XPaneDefRef, paneDefRefs: Array<XPaneDefRef>);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XFormModelComp {
    paneId: string;
    redirection: DialogRedirection;
    label: string;
    title: string;
    constructor(paneId: string, redirection: DialogRedirection, label: string, title: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XFormModel {
    form: XFormModelComp;
    header: XFormModelComp;
    children: Array<XFormModelComp>;
    placement: string;
    refreshTimer: number;
    sizeToWindow: boolean;
    constructor(form: XFormModelComp, header: XFormModelComp, children: Array<XFormModelComp>, placement: string, refreshTimer: number, sizeToWindow: boolean);
    static fromWS(otype: string, jsonObj: any): Try<XFormModel>;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGeoFixDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    constructor(paneId: string, name: string, title: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGeoLocationDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    constructor(paneId: string, name: string, title: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGetActiveColumnDefsResult {
    columnsStyle: string;
    columns: Array<ColumnDef>;
    constructor(columnsStyle: string, columns: Array<ColumnDef>);
    columnDefs: Array<ColumnDef>;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGetAvailableValuesResult {
    list: Array<any>;
    static fromWS(otype: string, jsonObj: any): Try<XGetAvailableValuesResult>;
    constructor(list: Array<any>);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGetSessionListPropertyResult {
    private _list;
    private _dialogProps;
    constructor(_list: Array<string>, _dialogProps: StringDictionary);
    dialogProps: StringDictionary;
    values: Array<string>;
    valuesAsDictionary(): StringDictionary;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XGraphDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    graphType: string;
    displayQuadrantLines: boolean;
    identityDataPoint: GraphDataPointDef;
    groupingDataPoint: GraphDataPointDef;
    dataPoints: Array<GraphDataPointDef>;
    filterDataPoints: Array<GraphDataPointDef>;
    sampleModel: string;
    xAxisLabel: string;
    xAxisRangeFrom: number;
    xAxisRangeTo: number;
    yAxisLabel: string;
    yAxisRangeFrom: number;
    yAxisRangeTo: number;
    constructor(paneId: string, name: string, title: string, graphType: string, displayQuadrantLines: boolean, identityDataPoint: GraphDataPointDef, groupingDataPoint: GraphDataPointDef, dataPoints: Array<GraphDataPointDef>, filterDataPoints: Array<GraphDataPointDef>, sampleModel: string, xAxisLabel: string, xAxisRangeFrom: number, xAxisRangeTo: number, yAxisLabel: string, yAxisRangeFrom: number, yAxisRangeTo: number);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XImagePickerDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    URLProperty: string;
    defaultActionId: string;
    constructor(paneId: string, name: string, title: string, URLProperty: string, defaultActionId: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XListDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    style: string;
    initialColumns: number;
    columnsStyle: string;
    overrideGML: string;
    constructor(paneId: string, name: string, title: string, style: string, initialColumns: number, columnsStyle: string, overrideGML: string);
    graphicalMarkup: string;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XMapDef extends XPaneDef {
    paneId: string;
    name: string;
    title: string;
    descriptionProperty: string;
    streetProperty: string;
    cityProperty: string;
    stateProperty: string;
    postalCodeProperty: string;
    latitudeProperty: string;
    longitudeProperty: string;
    constructor(paneId: string, name: string, title: string, descriptionProperty: string, streetProperty: string, cityProperty: string, stateProperty: string, postalCodeProperty: string, latitudeProperty: string, longitudeProperty: string);
    descrptionProperty: string;
}
/**
 * *********************************
 */
/**
 * @private
 */
export interface XOpenDialogModelResult {
    entityRecDef: EntityRecDef;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XOpenEditorModelResult implements XOpenDialogModelResult {
    editorRecordDef: EntityRecDef;
    formModel: XFormModel;
    constructor(editorRecordDef: EntityRecDef, formModel: XFormModel);
    entityRecDef: EntityRecDef;
    formPaneId: string;
    formRedirection: DialogRedirection;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XOpenQueryModelResult implements XOpenDialogModelResult {
    entityRecDef: EntityRecDef;
    sortPropertyDef: Array<SortPropDef>;
    defaultActionId: string;
    static fromWS(otype: string, jsonObj: any): Try<XOpenQueryModelResult>;
    constructor(entityRecDef: EntityRecDef, sortPropertyDef: Array<SortPropDef>, defaultActionId: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XOpenDialogModelErrorResult implements XOpenDialogModelResult {
    exception: DialogException;
    entityRecDef: EntityRecDef;
    constructor(exception: DialogException);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XPaneDefRef {
    name: string;
    paneId: string;
    title: string;
    type: string;
    static FORM_TYPE: string;
    constructor(name: string, paneId: string, title: string, type: string);
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XPropertyChangeResult {
    availableValueChanges: Array<string>;
    propertyName: string;
    sideEffects: XReadResult;
    editorRecordDef: EntityRecDef;
    constructor(availableValueChanges: Array<string>, propertyName: string, sideEffects: XReadResult, editorRecordDef: EntityRecDef);
    sideEffectsDef: EntityRecDef;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XQueryResult {
    entityRecs: Array<EntityRec>;
    entityRecDef: EntityRecDef;
    hasMore: boolean;
    sortPropDefs: Array<SortPropDef>;
    defaultActionId: string;
    dialogProps: StringDictionary;
    constructor(entityRecs: Array<EntityRec>, entityRecDef: EntityRecDef, hasMore: boolean, sortPropDefs: Array<SortPropDef>, defaultActionId: string, dialogProps: StringDictionary);
    static fromWS(otype: string, jsonObj: any): Try<XQueryResult>;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XReadResult {
    private _editorRecord;
    private _editorRecordDef;
    private _dialogProperties;
    constructor(_editorRecord: EntityRec, _editorRecordDef: EntityRecDef, _dialogProperties: StringDictionary);
    entityRec: EntityRec;
    entityRecDef: EntityRecDef;
    dialogProps: StringDictionary;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XWriteResult {
    private _editorRecord;
    private _editorRecordDef;
    private _dialogProperties;
    constructor(_editorRecord: EntityRec, _editorRecordDef: EntityRecDef, _dialogProperties: StringDictionary);
    dialogProps: StringDictionary;
    entityRec: EntityRec;
    entityRecDef: EntityRecDef;
    isDestroyed: boolean;
}
/**
 * *********************************
 */
/**
 * @private
 */
export declare class XWritePropertyResult {
    dialogProperties: StringDictionary;
    constructor(dialogProperties: StringDictionary);
}
/**
 * @private
 */
export declare class XReadPropertyResult {
    dialogProperties: StringDictionary;
    hasMore: boolean;
    data: string;
    dataLength: number;
    constructor(dialogProperties: StringDictionary, hasMore: boolean, data: string, dataLength: number);
}
/**
 * @private
 */
export declare class OType {
    private static types;
    private static typeFns;
    private static typeInstance(name);
    static factoryFn<A>(otype: string, jsonObj: any): Try<A>;
    static deserializeObject<A>(obj: any, Otype: string, factoryFn: (otype: string, jsonObj?) => any): Try<A>;
    static serializeObject(obj: any, Otype: string, filterFn?: (prop) => boolean): StringDictionary;
    private static handleNestedArray<A>(Otype, obj);
    private static deserializeNestedArray(array, ltype);
    private static extractLType(Otype);
    private static assignPropIfDefined(prop, value, target, otype?);
}
