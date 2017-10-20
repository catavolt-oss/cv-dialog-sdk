/**
 * Created by rburson on 10/19/17.
 */

import {StringDictionary, Log, ObjUtil, StringUtil} from './util'
/*
 ************************** Dialog Models ****************************
 * These models correspond to those in the WebAPI schema specification
 * *******************************************************************
 */



/** ************** Base classes have to be defined first i.e. Order matters ********************/

export abstract class View {

    readonly id: string;
    readonly menu: Menu;
    readonly name: string;
    readonly title: string;
    readonly viewType: ViewType;

}

export type ViewMode = "READ" | "WRITE";

export type ViewType ='hxgn.api.dialog.BarcodeScan' | 'hxgn.api.dialog.Calendar' | 'hxgn.api.dialog.Details'
    | 'hxgn.api.dialog.Form' | 'hxgn.api.dialog.GeoFix' | 'hxgn.api.dialog.GeoLocation'
    | 'hxgn.api.dialog.Graph' | 'hxgn.api.dialog.List' | 'hxgn.api.dialog.Map' | 'hxgn.api.dialog.Stream';


/** ************************** Subclasses *******************************************************/

export interface AppWindow {

    readonly initialAction:WorkbenchAction;
    readonly notificationsAction:WorkbenchAction;
    readonly windowHeight:number;
    readonly windowWidth:number;
    readonly windowTitle:string;
    readonly workbenches:ReadonlyArray<Workbench>;

}

/**
 * Defines how to present a business-value in a UI component
 */
export interface AttributeCellValue extends CellValue {

    readonly propertyName: string;
    readonly entryMethod: AttributeCellValueEntryMethod;
    readonly hint: string;
    readonly tooltip: string;
    readonly mask: string;
    readonly autoFillCapable: boolean;
    readonly actions: Array<Menu>;

}

export type AttributeCellValueEntryMethod = "COMBO_BOX" | "DROP_DOWN" | "TEXT_FIELD" | "ICON_CHOOSER";

/**
 * A purely declarative type. This object has no additional properties.
 */
export class BarcodeScan extends View {
}

export type BarcodeScanViewTypeEnum = "hxgn.api.dialog.BarcodeScan";
/**
 * An abstract visual Calendar
 */
export class Calendar extends View {

    readonly descriptionPropertyName: string;
    readonly initialStyle: string;
    readonly endDatePropertyName: string;
    readonly endTimePropertyName: string;
    readonly occurDatePropertyName: string;
    readonly occurTimePropertyName: string;
    readonly startDatePropertyName: string;
    readonly startTimePropertyName: string;
}

export interface Cell extends Array<CellValue> {}

export interface CellValue {
    /**
     * A schema reference for the view definition meta-data
     */
    readonly cellValueType: string;
}

export type ClientType = 'DESKTOP' | 'MOBILE';

export interface Column {

    readonly propertyName:string;
    readonly heading:string;

}

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
 * A abstract definition for small visual area populated with labels and values. Labels are typically presented as simple text phrases.
 * Values are usually presented inside a UI component, such as a TextField or ComboBox.
 */
export class Details extends View {

    readonly cancelButtonText: string;
    readonly commitButtonText: string;
    readonly editable: boolean;
    readonly focusPropertyName: string;
    readonly gmlMarkup: string;
    readonly rows: Array<Array<Cell>>;

}


export interface DialogId {
    readonly dialogId: string;
}

export interface Dialog {

    readonly businessClassName:string;
    readonly children: Array<Dialog>;
    readonly dialogClassName:string;
    readonly dialogMode:DialogMode;
    readonly dialogType:string;
    readonly id:string;
    readonly recordDef: RecordDef;
    readonly sessionId:string;
    readonly tenantId: string;
    readonly view: View;
    readonly  viewMode: ViewMode;

}

export interface DialogMessage {

    /**
     * A short language-independent identifier
     */
    readonly code:string;

    readonly type: DialogMessageType;
    /**
     * A human-readable informative description. If a code is provided, then this message explains the meaning of the code.
     */
    readonly message:string;
    /**
     * An object typically provided to help programmers diagnose an error.
     * For example, a cause can be the name of a host programming exception.
     */
    readonly cause: any;
    /**
     * This property is provided when the message pertains to one or more properties in a user interface view.
     */
    readonly propertyNames: Array<string>;
    /**
     * If this message is a generalization or aggregation, then children messages can be used to explain the individual facets.
     */
    readonly children: Array<DialogMessage>;
    /**
     * If the case of a host programming error, this property contains a stack trace of the host programming langa.
     */
    readonly stackTrace: string;

}

export type DialogMessageType = "CONFIRM" | "ERROR" | "INFO" | "WARN";

export type DialogMode = 'COPY' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';

export interface DialogRedirection extends Redirection {

    readonly dialogId:string;
    readonly dialogType:DialogType;
    readonly dialogMode:DialogMode;
    readonly dialogClassName:string;
    readonly businessClassName:string;
    readonly businessId:string;
    readonly viewMode:ViewMode;

}

export type DialogType = 'hxgn.api.dialog.EditorDialog' | 'hxgn.api.dialog.QueryDialog'

export interface EditorDialog extends Dialog {

    readonly businessId: string;
    readonly record: Record;

}

export interface Filter {

    readonly not: boolean;
    readonly operand1: any;
    readonly operator: FilterOperator;
    readonly operand2: any;

}

export type FilterOperator = "AND" | "CONTAINS" | "ENDS_WITH" | "EQUAL_TO" |
    "GREATER_THAN" | "GREATER_THAN_OR_EQUAL_TO" | "LESS_THAN" | "LESS_THAN_OR_EQUAL_TO"
    | "NOT_EQUAL_TO" | "OR" | "STARTS_WITH";



/**
 * A purely declarative type. This object has no additional properties.
 */
export interface ForcedLineCellValue extends CellValue {
}

/**
 * A composition of View objects that, together, comprise a UI form.
 */
export class Form extends View {

    readonly borderStyle: string;
    readonly formStyle: string;
    readonly formLayout: string;

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export class GeoFix extends View {

    static fromFormattedValue(value:string):GeoFix {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoFix(Number(pair[0]), Number(pair[1]), null, null);
    }

    constructor(readonly latitude:number,
                readonly longitude:number,
                readonly source:string,
                readonly accuracy:number) {
        super();
    }

    toString():string {
        return this.latitude + ":" + this.longitude;
    }
}


/**
 * A purely declarative type. This object has no additional properties.
 */
export class GeoLocation extends View {


    static fromFormattedValue(value:string):GeoLocation {
        var pair = StringUtil.splitSimpleKeyValuePair(value);
        return new GeoLocation(Number(pair[0]), Number(pair[1]));
    }

    constructor(readonly latitude:number,
                readonly longitude:number) {
        super();
    }

    toString():string {
        return this.latitude + ":" + this.longitude;
    }
}

/**
 * A view describing how to display a collection of data as a line graph, pie chart, bar chart, etc.
 */
export class Graph extends View {

    readonly dataPoints: Array<GraphDataPoint>;
    readonly filterDataPoints: Array<GraphDataPoint>;
    readonly graphType: string;
    readonly groupingDataPoint: GraphDataPoint;
    readonly identityDataPoint: GraphDataPoint;

}

export interface GraphDataPoint {

    readonly propertyName: string;
    readonly legendKey: string;
    readonly plotType: string;
    readonly type: string;

}

/**
 * A text description typically preceeding a UI component as a prompt
 */
export interface LabelCellValue extends CellValue {
    readonly value: string;
}

export interface Login {

    readonly userId:string;
    readonly password:string;
    readonly clientType:ClientType;
    readonly deviceProperties:StringDictionary;

}

/**
 * Columns, filter and sorts for a UI list component.
 */
export class List extends View {

    readonly style: string;
    readonly columnStyle: string;
    readonly gmlMarkup: string;
    readonly fixedColumnCount: number;
    readonly columns: Array<Column>;
    readonly filter: Array<Filter>;
    readonly sort: Array<Sort>;

}

export class Map extends View {

    readonly cityPropertyName: string;
    readonly descriptionPropertyName: string;
    readonly latitudePropertyName: string;
    readonly longitudePropertyName: string;
    readonly postalCodePropertyName: string;
    readonly statePropertyName: string;
    readonly streetPropertyName: string;

}

export interface Menu {

    readonly children: Array<Menu>;
    /**
     * A special value understood by the UI, such as 'refresh'
     */
    readonly directive: string;
    readonly id: string;
    readonly iconUrl: string;
    readonly label: string;
    /**
     * The menu is allowed (active) for these modes
     */
    readonly modes: Array<string>;
    readonly name: string;
    readonly type: string;

}

export interface NavRequest {}

export interface NullRedirection extends Redirection {
}

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

export interface Property {
    readonly value:any;
}

/**
 /**
 * A property definition describes a particular value of a business entity. Business entities are transacted as records,
 * therefore properties and lists of properties are referred to as fields and records. Moreover, a list of property definitions
 * is referred to as a record definition and is the metadata describing the read/write capabilities of a specific dialog model
 * in use by a specific user in a specific workflow.
 * Contains information that 'defines' a property {@link Prop} (name/value)
 * An instance of the {@link Property} contains the actual data value.
 */
export class PropertyDef {

    static STYLE_INLINE_MEDIA = "inlineMedia";
    static STYLE_INLINE_MEDIA2 = "Image/Video";

    constructor(/**
                 * The canCauseSideEffects meta property indicates that writing to this property can cause LOCAL side effects
                 * (on the same business object). For example, changing a 'zipCode' property case cause the 'state' property to change. If a user interface changes a property that can cause side effects, it should refresh the associated business view.
                 */
                readonly canCauseSideEffects: boolean,
                /**
                 * Length of a type to be displayed. Some types are longer than what is practically needed by the application.
                 * This property is used to define the practical length used in user interfaces.
                 */
                readonly displayLength: number,
                /**
                 * Scale of a decimal type to be displayed. Some decimal types are longer than what is practically needed by
                 * the application. This property is used to define the practical scale used in user interfaces.
                 */
                readonly displayScale: number,
                /**
                 * The format property further describes the value using names that correlate, when possible, to the
                 * Open API formats. Some example format names are date, date-time, uuid, int32 and int64. The format name decimal
                 * is used to describe a string holding an arbitrary precision BCD value. For more information,
                 * see the Open API Spec at https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md
                 */
                readonly format: string,
                /**
                 * Length of a type. This can be the length of a string or the length of a decimal.
                 */
                readonly length: number,
                readonly maintainable: boolean,
                /**
                 * The name of a business-data value
                 */
                readonly name: string,
                /**
                 * Scale of a decimal type
                 */
                readonly scale: number,
                /**
                 * Whereas 'type' and 'format' define the physical meaning of a property, the 'semanticType' adds meaningful
                 * insight into the usage of the property. For example, a 'decimal' type may be further defined semantically as a 'money' type.
                 */
                readonly semanticType: string,
                /**
                 * The type of business-data value. A valid type is either one of the OpenAPI basic values
                 * [array boolean integer null number object string] or a fully qualified type name that can be retrieved from the schema service.
                 */
                readonly propertyType: string,
                readonly writeEnabled: boolean) {
    }

    get isBarcodeType(): boolean {
        return this.propertyType &&
            this.propertyType === 'STRING' &&
            this.semanticType &&
            this.semanticType === 'DATA_BARCODE';
    }

    get isBinaryType(): boolean {
        return this.isLargeBinaryType || this.isSignatureType;
    }

    get isBooleanType(): boolean {
        return this.propertyType && this.propertyType === 'BOOLEAN';
    }

    get isCodeRefType(): boolean {
        return this.propertyType && this.propertyType === 'CODE_REF';
    }

    get isDateType(): boolean {
        return this.propertyType && this.propertyType === 'DATE';
    }

    get isDateTimeType(): boolean {
        return this.propertyType && this.propertyType === 'DATE_TIME';
    }

    get isDecimalType(): boolean {
        return this.propertyType && this.propertyType === 'DECIMAL';
    }

    get isDoubleType(): boolean {
        return this.propertyType && this.propertyType === 'DOUBLE';
    }

    get isEmailType(): boolean {
        return this.propertyType && this.propertyType === 'DATA_EMAIL';
    }

    get isFileAttachment(): boolean {
        return this.semanticType &&
            this.semanticType === 'DATA_UPLOAD_FILE';
    }

    get isGeoFixType(): boolean {
        return this.propertyType && this.propertyType === 'GEO_FIX';
    }

    get isGeoLocationType(): boolean {
        return this.propertyType && this.propertyType === 'GEO_LOCATION';
    }

    get isHTMLType(): boolean {
        return this.propertyType && this.propertyType === 'DATA_HTML';
    }

    get isListType(): boolean {
        return this.propertyType && this.propertyType === 'LIST';
    }

    get isIntType(): boolean {
        return this.propertyType && this.propertyType === 'INT';
    }

    get isLargeBinaryType(): boolean {
        return this.propertyType &&
            this.propertyType === 'com.dgoi.core.domain.BinaryRef' &&
            this.semanticType &&
            this.semanticType === 'DATA_LARGEBINARY';
    }

    get isLongType(): boolean {
        return this.propertyType && this.propertyType === 'LONG';
    }

    get isMoneyType(): boolean {
        return this.isNumericType &&
            this.semanticType &&
            this.semanticType === 'DATA_MONEY';
    }

    get isNumericType(): boolean {
        return this.isDecimalType || this.isDoubleType || this.isIntType || this.isLongType;
    }

    get isObjRefType(): boolean {
        return this.propertyType && this.propertyType === 'OBJ_REF';
    }

    get isPasswordType(): boolean {
        return this.isStringType &&
            this.semanticType &&
            this.semanticType === 'DATA_PASSWORD';
    }

    get isPercentType(): boolean {
        return this.isNumericType &&
            this.semanticType &&
            this.semanticType === 'DATA_PERCENT';
    }

    get isSignatureType(): boolean {
        return this.propertyType &&
            this.propertyType === 'com.dgoi.core.domain.BinaryRef' &&
            this.semanticType &&
            this.semanticType === 'DATA_LARGEBINARY_SIGNATURE';
    }

    get isStringType(): boolean {
        return this.propertyType && this.propertyType === 'STRING';
    }

    get isTelephoneType(): boolean {
        return this.isStringType &&
            this.semanticType &&
            this.semanticType === 'DATA_TELEPHONE';
    }

    get isTextBlock(): boolean {
        return this.semanticType && this.semanticType === 'DATA_TEXT_BLOCK';
    }

    get isTimeType(): boolean {
        return this.propertyType && this.propertyType === 'TIME';
    }

    get isUnformattedNumericType(): boolean {
        return this.isNumericType &&
            this.semanticType &&
            this.semanticType === 'DATA_UNFORMATTED_NUMBER';
    }

    get isURLType(): boolean {
        return this.isStringType &&
            this.semanticType &&
            this.semanticType === 'DATA_URL';
    }
}

/**
 * Query dialog
 */
export interface QueryDialog extends Dialog {

    readonly records: Records;

}

export interface Record {

    readonly id: string;
    readonly properties: any;

}

export interface RecordDef extends Array<PropertyDef> {
}

export interface Records extends Array<Record> {
}

export interface Redirection {

    readonly otherProperties: any;
    readonly redirectionType:RedirectionType;
    readonly referringDialog: any;
    readonly sessionId: string;
    readonly tenantId: string;

}

export type RedirectionType =
    'hxgn.api.dialog.DialogRedirection' |
    'hxgn.api.dialog.WebRedirection' |
    'hxgn.api.dialog.WorkbenchRedirection' |
    'hxgn.api.dialog.NullRedirection'

export interface Session {

    readonly appVendors:ReadonlyArray<string>;
    /**
     * Current version of the underlying application (business) logic. This is not the middleware version.
     */
    readonly appVersion:string;
    readonly appWindow:AppWindow;
    /**
     * Current division is analagous to a \"sub-tenant\" and it's possible for users to tailor different desktops based
     * on their division.
     */
    readonly currentDivision:string;
    readonly id:string;
    readonly tenantId:string;
    /**
     * The dialog layer interacts with an application endpoint, transparent to the user interface. The serverAssignment
     * is not used by the user interface directly, but this value can be useful when diagnosing problems.
     */
    readonly serverAssignment:string;
    /**
     * Current version of the underlying middleware (not the application logic)
     */
    readonly serverVersion:string;
    /**
     * The tenantProperties object is arbitrary, its values are dynamically defined and it is used to return
     * tenant-specific values to the requesting client.
     */
    readonly tenantProperties:StringDictionary;
    readonly userId:string;

}

export interface SessionId {

    readonly sessionId: string;
}

export interface Sessions extends Array<Session> {
}

export interface Sort {

    readonly propertyName: string;
    readonly direction: SortDirection;

}

export type SortDirection = "ASC" | "DESC";

export class Stream extends View {

    readonly topic: string;
    readonly bufferSize: number;
    readonly view: View;

}

/**
 * A text template containing substitution parameters that is instantiated at presentation time and filled with business values.
 */
export interface SubstitutionCellValue extends CellValue {

    readonly value: string;

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export interface TabCellValue extends CellValue {
}


export interface Tenant {

    readonly id:string;
    readonly description:string;

}

export interface Workbench extends NavRequest {

    readonly actions:ReadonlyArray<WorkbenchAction>;
    readonly id:string;
    readonly name:string;
    readonly offlineCapable:boolean;

}

export interface WorkbenchAction {

    /**
     * An alternative unique identifier. An alias is typically used to identify an action that is used in offline mode.
     * An alias should be more descriptive than the id, therefore an alias makes offline logic more descriptive. descriptive.
     */
    readonly alias:string;
    readonly id:string;
    readonly iconBase:string;
    readonly name:string;

}

export interface NullRedirection extends Redirection {
}

export const BarcodeScanViewType = 'hxgn.api.dialog.BarcodeScan';
export const CalendarViewType = 'hxgn.api.dialog.Calendar';
export const DetailsViewType = 'hxgn.api.dialog.Details';
export const FormViewType = 'hxgn.api.dialog.Form';
export const GeoFixViewType = 'hxgn.api.dialog.GeoFix';
export const GeoLocationViewType = 'hxgn.api.dialog.GeoLocation';
export const GraphViewType = 'hxgn.api.dialog.Graph';
export const ListViewType = 'hxgn.api.dialog.List';
export const MapViewType = 'hxgn.api.dialog.Map';
export const StreamViewType = 'hxgn.api.dialog.Stream';

export interface WebRedirection extends Redirection {

    readonly url:string;

}

export interface WorkbenchRedirection extends Redirection {

    readonly workbenchId:string;

}

export class ModelUtil {

    private static types = {
       'hxgn.api.dialog.BarcodeScan': BarcodeScan,
       'hxgn.api.dialog.Calendar': Calendar,
       'hxgn.api.dialog.Details': Details,
       'hxgn.api.dialog.Form': Form,
       'hxgn.api.dialog.GeoFix': GeoFix,
       'hxgn.api.dialog.GeoLocation': GeoLocation,
       'hxgn.api.dialog.Graph': Graph,
       'hxgn.api.dialog.List': List,
       'hxgn.api.dialog.Map': Map,
       'hxgn.api.dialog.Stream': Stream
    };

    private static typeFns:{[index:string]:(s:string, a:any)=>Promise<any>} = {
    }

    private static typeInstance(name) {
        const type = ModelUtil.types[name];
        return type && new type;
    }

    static factoryFn<A>(type:string, jsonObj):Promise<A> {
       const typeFn:(string, any)=>Promise<A> = ModelUtil.typeFns[type];
        if (typeFn) {
            return typeFn(type, jsonObj);
        }
        return null;
    }

    static jsonToModel<A>(obj, factoryFn:(type:string, jsonObj?)=>any=ModelUtil.factoryFn):Promise<A | Array<A>> {

        if (Array.isArray(obj)) {
            return ModelUtil.deserializeArray(obj);
        } else {
            const objType = obj['type'];
            Log.debug(`Deserializing ${objType}`);
            const funcPr:Promise<A> = factoryFn(objType, obj); //this returns null if there is no custom function
            if (funcPr) {
                return funcPr.catch(error=> {
                    const message = `ModelUtil::jsonToModel: factory failed to produce object for : ${objType} : ${ObjUtil.formatRecAttr(error)}`;
                    Log.error(error);
                    throw new Error(message);
                });
            } else {
                return new Promise((resolve, reject)=>{
                    const newObj = ModelUtil.typeInstance(objType);
                    if (!newObj) {
                        const message = `ModelUtil::jsonToModel: no type constructor found for ${objType}`
                        Log.debug(message);
                        resolve(obj);  //assume it's an interface
                    } else {
                        Promise.all(Object.keys(obj).map(prop=>{
                            const value = obj[prop];
                            Log.debug(`prop: ${prop} is type ${typeof value}`);
                            if (value && typeof value === 'object') {
                                if(Array.isArray(value)) {
                                    return ModelUtil.jsonToModel(value);
                                } else if ('type' in value) {
                                    return ModelUtil.jsonToModel(value).then(model=>{
                                        ModelUtil.assignPropIfDefined(prop, model, newObj, objType);
                                    });
                                } else {
                                    return Promise.resolve(ModelUtil.assignPropIfDefined(prop, value, newObj, objType));
                                }
                            } else {
                                return Promise.resolve(ModelUtil.assignPropIfDefined(prop, value, newObj, objType));
                            }
                        })).then(result=>{
                           resolve(newObj);
                        }).catch(error=>reject(error));
                    }
                });
            }
        }
    }

    static modelToJson(obj, filterFn?:(prop)=>boolean):StringDictionary {
        return ObjUtil.copyNonNullFieldsOnly(obj, {}, (prop)=> {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    }

    private static deserializeArray<A>(array:Array<any>):Promise<Array<A>> {

       return Promise.all(array.map(value=>{
            if (value && typeof value === 'object') {
                return ModelUtil.jsonToModel(value);
            } else {
                return Promise.resolve(value);
            }
        }));

    }

    private static assignPropIfDefined(prop, value, target, type) {
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
                Log.info(`Assigning private prop _${prop} = ${value}`);
            } else {
                //it may be public
                if (prop in target) {
                    target[prop] = value;
                    Log.info(`Assigning public prop ${prop} = ${value}`);
                } else {
                    Log.debug(`Didn't find target value for prop ${prop} on target for ${type}`);
                }
            }
        } catch (error) {
            Log.error(`ModelUtil::assignPropIfDefined: Failed to set prop: ${prop} on target: ${error}`);
        }
    }
}

