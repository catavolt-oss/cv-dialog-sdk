/**
 * Created by rburson on 3/27/15.
 */

///<reference path="util.d.ts"/>
///<reference path="fp.d.ts"/>
///<reference path="ws.d.ts"/>

declare module "catavolt-dialog" {

    /**
     * Created by rburson on 3/27/15.
     */
    import { StringDictionary } from "catavolt-util";
    import { Try } from "catavolt-fp";
    import { Either } from "catavolt-fp";
    import { SessionContext } from "catavolt-ws";
    import { Future } from "catavolt-fp";
    import { SystemContext } from "catavolt-ws";
    import { UserException } from "catavolt-util";
    import { TryClosure } from "catavolt-fp";
    import { MapFn } from "catavolt-fp";
    /**
     * *********************************
     */
    export class CellValueDef {
        private _style;
        static fromWS(otype: string, jsonObj: any): Try<CellValueDef>;
        constructor(_style: string);
        isInlineMediaStyle: boolean;
        style: string;
    }
    /**
     * *********************************
     */
    export class AttributeCellValueDef extends CellValueDef {
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
    export class ForcedLineCellValueDef extends CellValueDef {
        constructor();
    }
    /**
     * *********************************
     */
    export class LabelCellValueDef extends CellValueDef {
        private _value;
        constructor(_value: string, style: string);
        value: string;
    }
    /**
     * *********************************
     */
    export class SubstitutionCellValueDef extends CellValueDef {
        private _value;
        constructor(_value: string, style: string);
        value: string;
    }
    /**
     * *********************************
     */
    export class TabCellValueDef extends CellValueDef {
        constructor();
    }
    /**
     * *********************************
     */
    export class PaneContext {
        private static ANNO_NAME_KEY;
        private static PROP_NAME_KEY;
        private static CHAR_CHUNK_SIZE;
        private static BINARY_CHUNK_SIZE;
        entityRecDef: EntityRecDef;
        private _binaryCache;
        private _lastRefreshTime;
        private _parentContext;
        private _paneRef;
        static resolveSettingsFromNavRequest(initialSettings: StringDictionary, navRequest: NavRequest): StringDictionary;
        constructor(paneRef: number);
        actionSource: ActionSource;
        binaryAt(propName: string, entityRec: EntityRec): Future<Binary>;
        dialogAlias: string;
        findMenuDefAt(actionId: string): MenuDef;
        formatForRead(propValue: any, propName: string): string;
        formatForWrite(propValue: any, propName: string): string;
        formDef: FormDef;
        isRefreshNeeded: boolean;
        lastRefreshTime: Date;
        menuDefs: Array<MenuDef>;
        offlineCapable: boolean;
        paneDef: PaneDef;
        paneRef: number;
        paneTitle: string;
        parentContext: FormContext;
        parseValue(formattedValue: string, propName: string): any;
        propDefAtName(propName: string): PropDef;
        sessionContext: SessionContext;
        /** --------------------- MODULE ------------------------------*/
        dialogRedirection: DialogRedirection;
        initialize(): void;
        readBinaries(entityRec: EntityRec): Future<Array<Try<Binary>>>;
        readBinary(propName: string): Future<Binary>;
        writeBinaries(entityRec: EntityRec): Future<Array<Try<XWritePropertyResult>>>;
    }
    /**
     * *********************************
     */
    export class EditorContext extends PaneContext {
        private static GPS_ACCURACY;
        private static GPS_SECONDS;
        private _buffer;
        private _editorState;
        private _entityRecDef;
        private _settings;
        constructor(paneRef: number);
        buffer: EntityBuffer;
        changePaneMode(paneMode: PaneMode): Future<EntityRecDef>;
        entityRec: EntityRec;
        entityRecNow: EntityRec;
        entityRecDef: EntityRecDef;
        getAvailableValues(propName: string): Future<Array<Object>>;
        isBinary(cellValueDef: AttributeCellValueDef): boolean;
        isDestroyed: boolean;
        isReadMode: boolean;
        isReadModeFor(propName: string): boolean;
        isWriteMode: boolean;
        performMenuAction(menuDef: MenuDef, pendingWrites: EntityRec): Future<NavRequest>;
        processSideEffects(propertyName: string, value: any): Future<void>;
        read(): Future<EntityRec>;
        requestedAccuracy(): number;
        requestedTimeoutSeconds(): number;
        write(): Future<Either<NavRequest, EntityRec>>;
        initialize(): void;
        settings: StringDictionary;
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
    export class FormContext extends PaneContext {
        private _dialogRedirection;
        private _actionSource;
        private _formDef;
        private _childrenContexts;
        private _offlineCapable;
        private _offlineData;
        private _sessionContext;
        private _destroyed;
        private _offlineProps;
        constructor(_dialogRedirection: DialogRedirection, _actionSource: ActionSource, _formDef: FormDef, _childrenContexts: Array<PaneContext>, _offlineCapable: boolean, _offlineData: boolean, _sessionContext: SessionContext);
        actionSource: ActionSource;
        childrenContexts: Array<PaneContext>;
        close(): Future<VoidResult>;
        dialogRedirection: DialogRedirection;
        entityRecDef: EntityRecDef;
        formDef: FormDef;
        headerContext: PaneContext;
        performMenuAction(menuDef: MenuDef): Future<NavRequest>;
        isDestroyed: boolean;
        offlineCapable: boolean;
        menuDefs: Array<MenuDef>;
        offlineProps: StringDictionary;
        paneDef: PaneDef;
        sessionContext: SessionContext;
        /** --------------------- MODULE ------------------------------*/
        isAnyChildDestroyed: boolean;
        processNavRequestForDestroyed(navRequest: NavRequest): void;
    }
    export enum QueryDirection {
        FORWARD = 0,
        BACKWARD = 1,
    }
    export class QueryContext extends PaneContext {
        private _offlineRecs;
        private _settings;
        private _lastQueryFr;
        private _queryState;
        private _scroller;
        constructor(paneRef: number, _offlineRecs?: Array<EntityRec>, _settings?: StringDictionary);
        entityRecDef: EntityRecDef;
        isBinary(columnDef: ColumnDef): boolean;
        isDestroyed: boolean;
        lastQueryFr: Future<QueryResult>;
        offlineRecs: Array<EntityRec>;
        paneMode: string;
        performMenuAction(menuDef: MenuDef, targets: Array<string>): Future<NavRequest>;
        query(maxRows: number, direction: QueryDirection, fromObjectId: string): Future<QueryResult>;
        refresh(): Future<Array<EntityRec>>;
        scroller: QueryScroller;
        setScroller(pageSize: number, firstObjectId: string, markerOptions: Array<QueryMarkerOption>): QueryScroller;
        newScroller(): QueryScroller;
        settings(): StringDictionary;
        private isDestroyedSetting;
        private isGlobalRefreshSetting;
        private isLocalRefreshSetting;
        private isRefreshSetting;
    }
    /**
     * *********************************
     */
    export class BarcodeScanContext extends EditorContext {
        constructor(paneRef: number);
        barcodeScanDef: BarcodeScanDef;
    }
    /**
     * *********************************
     */
    export class DetailsContext extends EditorContext {
        constructor(paneRef: number);
        detailsDef: DetailsDef;
        printMarkupURL: string;
    }
    /**
     * *********************************
     */
    export class GeoFixContext extends EditorContext {
        constructor(paneRef: number);
        geoFixDef: GeoFixDef;
    }
    /**
     * *********************************
     */
    export class GeoLocationContext extends EditorContext {
        constructor(paneRef: number);
        geoLocationDef: GeoLocationDef;
    }
    /**
     * *********************************
     */
    export class CalendarContext extends QueryContext {
        constructor(paneRef: number);
        calendarDef: CalendarDef;
    }
    /**
     * *********************************
     */
    export class GraphContext extends QueryContext {
        constructor(paneRef: number);
        graphDef: GraphDef;
    }
    /**
     * *********************************
     */
    export class ImagePickerContext extends QueryContext {
        constructor(paneRef: number);
        imagePickerDef: ImagePickerDef;
    }
    /**
     * *********************************
     */
    export class ListContext extends QueryContext {
        constructor(paneRef: number, offlineRecs?: Array<EntityRec>, settings?: StringDictionary);
        columnHeadings: Array<string>;
        listDef: ListDef;
        rowValues(entityRec: EntityRec): Array<any>;
        style: string;
    }
    /**
     * *********************************
     */
    export class MapContext extends QueryContext {
        constructor(paneRef: number);
        mapDef: MapDef;
    }
    /**
     * *********************************
     */
    export class PaneDef {
        private _paneId;
        private _name;
        private _label;
        private _title;
        private _menuDefs;
        private _entityRecDef;
        private _dialogRedirection;
        private _settings;
        static fromOpenPaneResult(childXOpenResult: XOpenDialogModelResult, childXComp: XFormModelComp, childXPaneDefRef: XPaneDefRef, childXPaneDef: XPaneDef, childXActiveColDefs: XGetActiveColumnDefsResult, childMenuDefs: Array<MenuDef>): Try<PaneDef>;
        constructor(_paneId: string, _name: string, _label: string, _title: string, _menuDefs: Array<MenuDef>, _entityRecDef: EntityRecDef, _dialogRedirection: DialogRedirection, _settings: StringDictionary);
        dialogHandle: DialogHandle;
        dialogRedirection: DialogRedirection;
        entityRecDef: EntityRecDef;
        findTitle(): string;
        label: string;
        menuDefs: Array<MenuDef>;
        name: string;
        paneId: string;
        settings: StringDictionary;
        title: string;
    }
    /**
     * *********************************
     */
    export class BarcodeScanDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
    /**
     * *********************************
     */
    export class CalendarDef extends PaneDef {
        private _descriptionPropName;
        private _initialStyle;
        private _startDatePropName;
        private _startTimePropName;
        private _endDatePropName;
        private _endTimePropName;
        private _occurDatePropName;
        private _occurTimePropName;
        private _defaultActionId;
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
     * *********************************
     */
    export class DetailsDef extends PaneDef {
        private _cancelButtonText;
        private _commitButtonText;
        private _editable;
        private _focusPropName;
        private _graphicalMarkup;
        private _rows;
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _cancelButtonText: string, _commitButtonText: string, _editable: boolean, _focusPropName: string, _graphicalMarkup: string, _rows: Array<Array<CellDef>>);
        cancelButtonText: string;
        commitButtonText: string;
        editable: boolean;
        focusPropName: string;
        graphicalMarkup: string;
        rows: Array<Array<CellDef>>;
    }
    /**
     * *********************************
     */
    export class FormDef extends PaneDef {
        private _formLayout;
        private _formStyle;
        private _borderStyle;
        private _headerDef;
        private _childrenDefs;
        static fromOpenFormResult(formXOpenResult: XOpenEditorModelResult, formXFormDef: XFormDef, formMenuDefs: Array<MenuDef>, childrenXOpens: Array<XOpenDialogModelResult>, childrenXPaneDefs: Array<XPaneDef>, childrenXActiveColDefs: Array<XGetActiveColumnDefsResult>, childrenMenuDefs: Array<Array<MenuDef>>): Try<FormDef>;
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _formLayout: string, _formStyle: string, _borderStyle: string, _headerDef: DetailsDef, _childrenDefs: Array<PaneDef>);
        borderStyle: string;
        childrenDefs: Array<PaneDef>;
        formLayout: string;
        formStyle: string;
        headerDef: DetailsDef;
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
     * *********************************
     */
    export class GeoFixDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
    /**
     * *********************************
     */
    export class GeoLocationDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
    /**
     * *********************************
     */
    export class GraphDef extends PaneDef {
        private _graphType;
        private _identityDataPointDef;
        private _groupingDataPointDef;
        private _dataPointDefs;
        private _filterDataPointDefs;
        private _sampleModel;
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _graphType: string, _identityDataPointDef: GraphDataPointDef, _groupingDataPointDef: GraphDataPointDef, _dataPointDefs: Array<GraphDataPointDef>, _filterDataPointDefs: Array<GraphDataPointDef>, _sampleModel: string);
        dataPointDefs: Array<GraphDataPointDef>;
        filterDataPointDefs: Array<GraphDataPointDef>;
        identityDataPointDef: GraphDataPointDef;
        groupingDataPointDef: GraphDataPointDef;
        sampleModel: string;
    }
    /**
     * *********************************
     */
    export class ImagePickerDef extends PaneDef {
        private _URLPropName;
        private _defaultActionId;
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _URLPropName: string, _defaultActionId: string);
        defaultActionId: string;
        URLPropName: string;
    }
    /**
     * *********************************
     */
    export class ListDef extends PaneDef {
        private _style;
        private _initialColumns;
        private _activeColumnDefs;
        private _columnsStyle;
        private _defaultActionId;
        private _graphicalMarkup;
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
     * *********************************
     */
    export class MapDef extends PaneDef {
        private _descriptionPropName;
        private _streetPropName;
        private _cityPropName;
        private _statePropName;
        private _postalCodePropName;
        private _latitudePropName;
        private _longitudePropName;
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
    export class BinaryRef {
        private _settings;
        constructor(_settings: StringDictionary);
        static fromWSValue(encodedValue: string, settings: StringDictionary): Try<BinaryRef>;
        settings: StringDictionary;
    }
    export class InlineBinaryRef extends BinaryRef {
        private _inlineData;
        constructor(_inlineData: string, settings: StringDictionary);
        inlineData: string;
        toString(): string;
    }
    export class ObjectBinaryRef extends BinaryRef {
        constructor(settings: StringDictionary);
    }
    /**
     * *********************************
     */
    export interface Binary {
        toUrl(): string;
    }
    /**
     * *********************************
     */
    export class EncodedBinary implements Binary {
        private _data;
        private _mimeType;
        constructor(_data: string, _mimeType?: string);
        data: string;
        mimeType: string;
        toUrl(): string;
    }
    export class UrlBinary implements Binary {
        private _url;
        constructor(_url: string);
        url: string;
        toUrl(): string;
    }
    /**
     * *********************************
     */
    export class Redirection {
        static fromWS(otype: string, jsonObj: any): Try<Redirection>;
        fromDialogProperties: StringDictionary;
    }
    /**
     * *********************************
     */
    export class DialogRedirection extends Redirection {
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
    /**
     * *********************************
     */
    export class NullRedirection extends Redirection {
        fromDialogProperties: StringDictionary;
        constructor(fromDialogProperties: StringDictionary);
    }
    /**
     * *********************************
     */
    export class WebRedirection extends Redirection implements NavRequest {
        private _webURL;
        private _open;
        private _dialogProperties;
        private _fromDialogProperties;
        constructor(_webURL: string, _open: boolean, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
        fromDialogProperties: StringDictionary;
    }
    /**
     * *********************************
     */
    export class WorkbenchRedirection extends Redirection {
        private _workbenchId;
        private _dialogProperties;
        private _fromDialogProperties;
        constructor(_workbenchId: string, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
        workbenchId: string;
        dialogProperties: StringDictionary;
        fromDialogProperties: StringDictionary;
    }
    /**
     * *********************************
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
    export class EntityRecUtil {
        static newEntityRec(objectId: string, props: Array<Prop>, annos?: Array<DataAnno>): EntityRec;
        static union(l1: Array<Prop>, l2: Array<Prop>): Array<Prop>;
        static fromWSEditorRecord(otype: string, jsonObj: any): Try<EntityRec>;
    }
    /**
     * *********************************
     */
    export class EntityBuffer implements EntityRec {
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
    export class EntityRecImpl implements EntityRec {
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
    export class NullEntityRec implements EntityRec {
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
    export class AppContext {
        private static _singleton;
        private static ONE_DAY_IN_MILLIS;
        lastMaintenanceTime: Date;
        private _appContextState;
        private _appWinDefTry;
        private _deviceProps;
        private _sessionContextTry;
        private _tenantSettingsTry;
        static defaultTTLInMillis: number;
        static singleton: AppContext;
        constructor();
        appWinDefTry: Try<AppWinDef>;
        deviceProps: Array<string>;
        isLoggedIn: boolean;
        getWorkbench(sessionContext: SessionContext, workbenchId: string): Future<Workbench>;
        login(gatewayHost: string, tenantId: string, clientType: string, userId: string, password: string): Future<AppWinDef>;
        loginDirectly(url: string, tenantId: string, clientType: string, userId: string, password: string): Future<AppWinDef>;
        logout(): Future<VoidResult>;
        performLaunchAction(launchAction: WorkbenchLaunchAction): Future<NavRequest>;
        refreshContext(sessionContext: SessionContext, deviceProps?: Array<string>): Future<AppWinDef>;
        sessionContextTry: Try<SessionContext>;
        tenantSettingsTry: Try<StringDictionary>;
        private finalizeContext(sessionContext, deviceProps);
        private loginOnline(gatewayHost, tenantId, clientType, userId, password, deviceProps);
        private loginFromSystemContext(systemContext, tenantId, userId, password, deviceProps, clientType);
        private newSystemContextFr(gatewayHost, tenantId);
        private performLaunchActionOnline(launchAction, sessionContext);
        private setAppContextStateToLoggedIn(appContextValues);
        private setAppContextStateToLoggedOut();
    }
    /**
     * *********************************
     */
    export class AppWinDef {
        private _workbenches;
        private _applicationVendors;
        private _windowTitle;
        private _windowWidth;
        private _windowHeight;
        constructor(workbenches: Array<Workbench>, appVendors: Array<string>, windowTitle: string, windowWidth: number, windowHeight: number);
        appVendors: Array<string>;
        windowHeight: number;
        windowTitle: string;
        windowWidth: number;
        workbenches: Array<Workbench>;
    }
    /**
     * *********************************
     */
    export class CellDef {
        private _values;
        constructor(_values: Array<CellValueDef>);
        values: Array<CellValueDef>;
    }
    /**
     * *********************************
     */
    export class CodeRef {
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
    export class ColumnDef {
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
    export class ContextAction implements ActionSource {
        actionId: string;
        objectId: string;
        fromActionSource: ActionSource;
        constructor(actionId: string, objectId: string, fromActionSource: ActionSource);
        virtualPathSuffix: Array<string>;
    }
    /**
     * *********************************
     */
    export class DataAnno {
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
    export interface DialogException extends UserException {
    }
    /**
     * *********************************
     */
    export class DialogHandle {
        handleValue: number;
        sessionHandle: string;
        constructor(handleValue: number, sessionHandle: string);
    }
    /**
     * *********************************
     */
    export class DialogService {
        private static EDITOR_SERVICE_NAME;
        private static EDITOR_SERVICE_PATH;
        private static QUERY_SERVICE_NAME;
        private static QUERY_SERVICE_PATH;
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
        static readProperty(dialogHandle: DialogHandle, propertyName: string, readSeq: number, readLength: number, sessionContext: SessionContext): Future<XReadPropertyResult>;
        static writeEditorModel(dialogHandle: DialogHandle, entityRec: EntityRec, sessionContext: SessionContext): Future<Either<Redirection, XWriteResult>>;
        static writeProperty(dialogHandle: DialogHandle, propertyName: string, data: string, append: boolean, sessionContext: SessionContext): Future<XWritePropertyResult>;
    }
    /**
     * *********************************
     */
    export class DialogTriple {
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
     * *********************************
     */
    export class EntityRecDef {
        private _propDefs;
        constructor(_propDefs: Array<PropDef>);
        propCount: number;
        propDefAtName(name: string): PropDef;
        propDefs: Array<PropDef>;
        propertyDefs: Array<PropDef>;
        propNames: Array<string>;
    }
    /**
     * *********************************
     */
    export class FormContextBuilder {
        private _dialogRedirection;
        private _actionSource;
        private _sessionContext;
        constructor(_dialogRedirection: DialogRedirection, _actionSource: ActionSource, _sessionContext: SessionContext);
        actionSource: ActionSource;
        build(): Future<FormContext>;
        dialogRedirection: DialogRedirection;
        sessionContext: SessionContext;
        private completeOpenPromise(openAllResults);
        private createChildrenContexts(formDef);
        private fetchChildrenActiveColDefs(formXOpen);
        private fetchChildrenMenuDefs(formXOpen);
        private fetchChildrenXPaneDefs(formXOpen, xFormDef);
        private fetchXFormDef(xformOpenResult);
        private openChildren(formXOpen);
    }
    /**
     * *********************************
     */
    export class GatewayService {
        static getServiceEndpoint(tenantId: string, serviceName: string, gatewayHost: string): Future<ServiceEndpoint>;
    }
    /**
     * *********************************
     */
    export class GeoFix {
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
    export class GeoLocation {
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
    export class GraphDataPointDef {
        private _name;
        private _type;
        private _plotType;
        private _legendkey;
        constructor(_name: string, _type: string, _plotType: string, _legendkey: string);
    }
    /**
     * *********************************
     */
    export class MenuDef {
        private _name;
        private _type;
        private _actionId;
        private _mode;
        private _label;
        private _iconName;
        private _directive;
        private _menuDefs;
        constructor(_name: string, _type: string, _actionId: string, _mode: string, _label: string, _iconName: string, _directive: string, _menuDefs: Array<MenuDef>);
        actionId: string;
        directive: string;
        findAtId(actionId: string): MenuDef;
        iconName: string;
        isPresaveDirective: boolean;
        isRead: boolean;
        isSeparator: boolean;
        isWrite: boolean;
        label: string;
        menuDefs: Array<MenuDef>;
        mode: string;
        name: string;
        type: string;
    }
    /**
     * *********************************
     */
    export interface NavRequest {
    }
    export class NavRequestUtil {
        static fromRedirection(redirection: Redirection, actionSource: ActionSource, sessionContext: SessionContext): Future<NavRequest>;
    }
    /**
     * *********************************
     */
    export class NullNavRequest implements NavRequest {
        fromDialogProperties: StringDictionary;
        constructor();
    }
    /**
     * *********************************
     */
    export class ObjectRef {
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
    export enum PaneMode {
        READ = 0,
        WRITE = 1,
    }
    /**
     * *********************************
     */
    export class PropDef {
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
     * *********************************
     */
    export class PropFormatter {
        static formatForRead(prop: any, propDef: PropDef): string;
        static formatForWrite(prop: any, propDef: PropDef): string;
        static parse(value: string, propDef: PropDef): any;
        static toString(o: any): string;
    }
    export class Prop {
        private _name;
        private _value;
        private _annos;
        static fromListOfWSValue(values: Array<any>): Try<Array<any>>;
        static fromWSNameAndWSValue(name: string, value: any): Try<Prop>;
        static fromWSNamesAndValues(names: Array<string>, values: Array<any>): Try<Array<Prop>>;
        static fromWSValue(value: any): Try<any>;
        static fromWS(otype: string, jsonObj: any): Try<Prop>;
        static toWSProperty(o: any): any;
        static toWSListOfProperties(list: Array<any>): StringDictionary;
        static toWSListOfString(list: Array<string>): StringDictionary;
        static toListOfWSProp(props: Array<Prop>): StringDictionary;
        constructor(_name: string, _value: any, _annos?: Array<DataAnno>);
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
        name: string;
        overrideText: string;
        tipText: string;
        value: any;
        toWS(): StringDictionary;
    }
    /**
     * *********************************
     */
    export class QueryResult {
        entityRecs: Array<EntityRec>;
        hasMore: boolean;
        constructor(entityRecs: Array<EntityRec>, hasMore: boolean);
    }
    /**
     * *********************************
     */
    export class HasMoreQueryMarker extends NullEntityRec {
        static singleton: HasMoreQueryMarker;
    }
    export class IsEmptyQueryMarker extends NullEntityRec {
        static singleton: IsEmptyQueryMarker;
    }
    export enum QueryMarkerOption {
        None = 0,
        IsEmpty = 1,
        HasMore = 2,
    }
    export class QueryScroller {
        private _context;
        private _pageSize;
        private _firstObjectId;
        private _markerOptions;
        private _buffer;
        private _hasMoreBackward;
        private _hasMoreForward;
        private _nextPageFr;
        private _prevPageFr;
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
    export class SessionContextImpl implements SessionContext {
        private _clientType;
        private _gatewayHost;
        private _password;
        private _remoteSession;
        private _tenantId;
        private _userId;
        currentDivision: string;
        serverVersion: string;
        sessionHandle: string;
        systemContext: SystemContext;
        userName: string;
        static fromWSCreateSessionResult(jsonObject: {
            [id: string]: any;
        }, systemContext: SystemContext): Try<SessionContext>;
        static createSessionContext(gatewayHost: string, tenantId: string, clientType: string, userId: string, password: string): SessionContext;
        constructor(sessionHandle: string, userName: string, currentDivision: string, serverVersion: string, systemContext: SystemContext);
        clientType: string;
        gatewayHost: string;
        isLocalSession: boolean;
        isRemoteSession: boolean;
        password: string;
        tenantId: string;
        userId: string;
        online: boolean;
    }
    /**
     * *********************************
     */
    export class SessionService {
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
    export class SortPropDef {
        private _name;
        private _direction;
        constructor(_name: string, _direction: string);
        direction: string;
        name: string;
    }
    /**
     * *********************************
     */
    export class SystemContextImpl implements SystemContext {
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
    export class WorkbenchLaunchAction implements ActionSource {
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
    export class WorkbenchService {
        private static SERVICE_NAME;
        private static SERVICE_PATH;
        static getAppWinDef(sessionContext: SessionContext): Future<AppWinDef>;
        static getWorkbench(sessionContext: SessionContext, workbenchId: string): Future<Workbench>;
        static performLaunchAction(actionId: string, workbenchId: string, sessionContext: SessionContext): Future<Redirection>;
    }
    /**
     * *********************************
     */
    export class Workbench implements NavRequest {
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
     * *********************************
     */
    export class XPaneDef {
        static fromWS(otype: string, jsonObj: any): Try<XPaneDef>;
        constructor();
    }
    /**
     * *********************************
     */
    export class XBarcodeScanDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
    /**
     * *********************************
     */
    export class XCalendarDef extends XPaneDef {
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
    export class XChangePaneModeResult {
        editorRecordDef: EntityRecDef;
        dialogProperties: StringDictionary;
        constructor(editorRecordDef: EntityRecDef, dialogProperties: StringDictionary);
        entityRecDef: EntityRecDef;
        dialogProps: StringDictionary;
    }
    /**
     * *********************************
     */
    export class XDetailsDef extends XPaneDef {
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
    export class XFormDef extends XPaneDef {
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
    export class XFormModelComp {
        paneId: string;
        redirection: DialogRedirection;
        label: string;
        title: string;
        constructor(paneId: string, redirection: DialogRedirection, label: string, title: string);
    }
    /**
     * *********************************
     */
    export class XFormModel {
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
    export class XGeoFixDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
    /**
     * *********************************
     */
    export class XGeoLocationDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
    /**
     * *********************************
     */
    export class XGetActiveColumnDefsResult {
        columnsStyle: string;
        columns: Array<ColumnDef>;
        constructor(columnsStyle: string, columns: Array<ColumnDef>);
        columnDefs: Array<ColumnDef>;
    }
    /**
     * *********************************
     */
    export class XGetAvailableValuesResult {
        list: Array<any>;
        static fromWS(otype: string, jsonObj: any): Try<XGetAvailableValuesResult>;
        constructor(list: Array<any>);
    }
    /**
     * *********************************
     */
    export class XGetSessionListPropertyResult {
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
    export class XGraphDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        graphType: string;
        identityDataPoint: GraphDataPointDef;
        groupingDataPoint: GraphDataPointDef;
        dataPoints: Array<GraphDataPointDef>;
        filterDataPoints: Array<GraphDataPointDef>;
        sampleModel: string;
        constructor(paneId: string, name: string, title: string, graphType: string, identityDataPoint: GraphDataPointDef, groupingDataPoint: GraphDataPointDef, dataPoints: Array<GraphDataPointDef>, filterDataPoints: Array<GraphDataPointDef>, sampleModel: string);
    }
    /**
     * *********************************
     */
    export class XImagePickerDef extends XPaneDef {
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
    export class XListDef extends XPaneDef {
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
    export class XMapDef extends XPaneDef {
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
    export interface XOpenDialogModelResult {
        entityRecDef: EntityRecDef;
    }
    /**
     * *********************************
     */
    export class XOpenEditorModelResult implements XOpenDialogModelResult {
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
    export class XOpenQueryModelResult implements XOpenDialogModelResult {
        entityRecDef: EntityRecDef;
        sortPropertyDef: Array<SortPropDef>;
        defaultActionId: string;
        static fromWS(otype: string, jsonObj: any): Try<XOpenQueryModelResult>;
        constructor(entityRecDef: EntityRecDef, sortPropertyDef: Array<SortPropDef>, defaultActionId: string);
    }
    /**
     * *********************************
     */
    export class XPaneDefRef {
        name: string;
        paneId: string;
        title: string;
        type: string;
        constructor(name: string, paneId: string, title: string, type: string);
    }
    /**
     * *********************************
     */
    export class XPropertyChangeResult {
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
    export class XQueryResult {
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
    export class XReadResult {
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
    export class XWriteResult {
        private _editorRecord;
        private _editorRecordDef;
        private _dialogProperties;
        static fromWS(otype: string, jsonObj: any): Try<Either<Redirection, XWriteResult>>;
        constructor(_editorRecord: EntityRec, _editorRecordDef: EntityRecDef, _dialogProperties: StringDictionary);
        dialogProps: StringDictionary;
        entityRec: EntityRec;
        entityRecDef: EntityRecDef;
        isDestroyed: boolean;
    }
    /**
     * *********************************
     */
    export class XWritePropertyResult {
        dialogProperties: StringDictionary;
        constructor(dialogProperties: StringDictionary);
    }
    export class XReadPropertyResult {
        dialogProperties: StringDictionary;
        hasMore: boolean;
        data: string;
        dataLength: number;
        constructor(dialogProperties: StringDictionary, hasMore: boolean, data: string, dataLength: number);
    }
    export class OType {
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

}
