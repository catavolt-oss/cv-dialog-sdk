/**
 * Created by rburson on 3/6/15.
 */
declare module catavolt.util {
    class ArrayUtil {
        static copy<T>(source: Array<T>): Array<T>;
        static find<T>(source: Array<T>, f: (T) => boolean): T;
    }
}
/**
 * Created by rburson on 4/4/15.
 */
declare module catavolt.util {
    class Base64 {
        private static _keyStr;
        static encode(input: any): string;
        static decode(input: any): string;
        private static _utf8_encode(s);
        static _utf8_decode(utftext: any): string;
    }
}
/**
 * Created by rburson on 3/20/15.
 */
declare module catavolt.util {
    class ObjUtil {
        static addAllProps(sourceObj: any, targetObj: any): any;
        static cloneOwnProps(sourceObj: any): any;
        static copyNonNullFieldsOnly(obj: any, newObj: any, filterFn?: (prop) => boolean): any;
        static formatRecAttr(o: any): string;
        static newInstance(type: any): any;
    }
}
/**
 * Created by rburson on 4/3/15.
 */
declare module catavolt.util {
    class StringUtil {
        static splitSimpleKeyValuePair(pairString: string): Array<string>;
    }
}
/**
 * Created by rburson on 3/6/15.
 */
declare module catavolt.util {
    enum LogLevel {
        ERROR = 0,
        WARN = 1,
        INFO = 2,
        DEBUG = 3,
    }
    class Log {
        static debug: (message, method?: string, clz?: string) => void;
        static error: (message, method?: string, clz?: string) => void;
        static info: (message, method?: string, clz?: string) => void;
        static warn: (message, method?: string, clz?: string) => void;
        static init: void;
        static logLevel(level: LogLevel): void;
        private static log(logger, message, method?, clz?);
        static formatRecString(o: any): string;
    }
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.util {
    interface StringDictionary {
        [index: string]: any;
    }
    interface Dictionary<T> {
        [index: string]: T;
    }
}
/**
 * Created by rburson on 3/16/15.
 */
declare module catavolt.util {
    interface UserException {
        iconName: string;
        message: string;
        name: string;
        stackTrace: string;
        title: string;
    }
}
/**
 * Created by rburson on 3/6/15.
 */
import ArrayUtil = catavolt.util.ArrayUtil;
import Base64 = catavolt.util.Base64;
import Dictionary = catavolt.util.Dictionary;
import Log = catavolt.util.Log;
import LogLevel = catavolt.util.LogLevel;
import ObjUtil = catavolt.util.ObjUtil;
import StringDictionary = catavolt.util.StringDictionary;
import StringUtil = catavolt.util.StringUtil;
import UserException = catavolt.util.UserException;
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.fp {
    interface TryClosure<A> {
        (): Try<A>;
    }
    interface TryFn<A, B> {
        (value: A): Try<B>;
    }
    interface CompletionListener<A> {
        (t: Try<A>): void;
    }
    interface FailureListener {
        (failure: any): void;
    }
    interface FutureFn<A, B> {
        (value: A): Future<B>;
    }
    interface MapFn<A, B> {
        (value: A): B;
    }
    interface SuccessListener<A> {
        (success: A): void;
    }
}
/**
 * Created by rburson on 3/5/15.
 */
declare module catavolt.fp {
    class Try<A> {
        static flatten<A>(tryList: Array<Try<A>>): Try<Array<A>>;
        private static isListOfTry(list);
        bind<B>(f: TryFn<A, B>): Try<B>;
        failure: any;
        isFailure: boolean;
        isSuccess: boolean;
        map<B>(f: MapFn<A, B>): Try<B>;
        success: A;
    }
}
/**
 * Created by rburson on 3/5/15.
 */
declare module catavolt.fp {
    class Failure<A> extends Try<A> {
        private _error;
        constructor(_error: any);
        failure: any;
        isFailure: boolean;
    }
}
/**
 * Created by rburson on 3/5/15.
 */
declare module catavolt.fp {
    class Future<A> {
        private _label;
        /** --------------------- PUBLIC STATIC ------------------------------*/
        static createCompletedFuture<A>(label: string, result: Try<A>): Future<A>;
        static createSuccessfulFuture<A>(label: string, value: A): Future<A>;
        static createFailedFuture<A>(label: string, error: any): Future<A>;
        static createFuture<A>(label: string): Future<A>;
        static sequence<A>(seqOfFutures: Array<Future<A>>): Future<Array<Try<A>>>;
        private _completionListeners;
        private _result;
        /** --------------------- CONSTRUCTORS ------------------------------*/
        constructor(_label: any);
        /** --------------------- PUBLIC ------------------------------*/
        bind<B>(f: FutureFn<A, B>): Future<B>;
        failure: any;
        isComplete: boolean;
        isCompleteWithFailure: boolean;
        isCompleteWithSuccess: boolean;
        map<B>(f: MapFn<A, B>): Future<B>;
        onComplete(listener: CompletionListener<A>): void;
        onFailure(listener: FailureListener): void;
        onSuccess(listener: SuccessListener<A>): void;
        result: Try<A>;
        success: A;
        /** --------------------- MODULE ------------------------------*/
        complete(t: Try<A>): Future<A>;
    }
}
/**
 * Created by rburson on 3/5/15.
 */
declare module catavolt.fp {
    class Success<A> extends Try<A> {
        private _value;
        constructor(_value: A);
        isSuccess: boolean;
        success: A;
    }
}
/**
 * Created by rburson on 3/6/15.
 */
declare module catavolt.fp {
    class Promise<A> {
        private _future;
        constructor(label: string);
        /** --------------------- PUBLIC ------------------------------*/
        isComplete(): boolean;
        complete(t: Try<A>): Promise<A>;
        failure(error: any): void;
        future: Future<A>;
        success(value: A): void;
    }
}
/**
 * Created by rburson on 3/16/15.
 */
declare module catavolt.fp {
    class Either<A, B> {
        private _left;
        private _right;
        static left<A, B>(left: A): Either<A, B>;
        static right<A, B>(right: B): Either<A, B>;
        isLeft: boolean;
        isRight: boolean;
        left: A;
        right: B;
    }
}
/**
 * Created by rburson on 3/6/15.
 */
import CompletionListener = catavolt.fp.CompletionListener;
import Either = catavolt.fp.Either;
import Failure = catavolt.fp.Failure;
import FailureListener = catavolt.fp.FailureListener;
import Future = catavolt.fp.Future;
import FutureFn = catavolt.fp.FutureFn;
import MapFn = catavolt.fp.MapFn;
import Promise = catavolt.fp.Promise;
import Success = catavolt.fp.Success;
import SuccessListener = catavolt.fp.SuccessListener;
import Try = catavolt.fp.Try;
import TryClosure = catavolt.fp.TryClosure;
import TryFn = catavolt.fp.TryFn;
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.ws {
    interface SystemContext {
        urlString: string;
    }
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.ws {
    interface SessionContext {
        currentDivision: string;
        isRemoteSession: boolean;
        isLocalSession: boolean;
        serverVersion: string;
        sessionHandle: string;
        systemContext: SystemContext;
        userName: string;
    }
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.ws {
    interface Client {
        jsonGet(targetUrl: string, timeoutMillis?: number): Future<StringDictionary>;
        jsonPost(targetUrl: string, jsonObj?: StringDictionary, timeoutMillis?: number): Future<StringDictionary>;
        jsonCall(targetUrl: string, jsonObj?: StringDictionary, method?: string, timeoutMillis?: number): Future<StringDictionary>;
    }
    class XMLHttpClient implements Client {
        jsonGet(targetUrl: string, timeoutMillis?: number): Future<StringDictionary>;
        jsonPost(targetUrl: string, jsonObj?: StringDictionary, timeoutMillis?: number): Future<StringDictionary>;
        jsonCall(targetUrl: string, jsonObj?: StringDictionary, method?: string, timeoutMillis?: number): Future<StringDictionary>;
    }
    interface Request {
    }
    class Call implements Request {
        private static _lastCallId;
        private _callId;
        private _cancelled;
        private _loggingOption;
        private _method;
        private _params;
        private _performed;
        private _promise;
        private _responseHeaders;
        private _service;
        private _sessionContext;
        private _systemContext;
        private _client;
        timeoutMillis: number;
        static nextCallId(): number;
        static createCall(service: string, method: string, params: StringDictionary, sessionContext: SessionContext): Call;
        static createCallWithoutSession(service: string, method: string, params: StringDictionary, systemContext: SystemContext): Call;
        constructor(service: string, method: string, params: StringDictionary, systemContext: SystemContext, sessionContext: SessionContext);
        cancel(): void;
        perform(): Future<StringDictionary>;
    }
    class Get implements Request {
        private _performed;
        private _promise;
        private _url;
        private _client;
        timeoutMillis: number;
        static fromUrl(url: string): Get;
        constructor(url: string);
        cancel(): void;
        perform(): Future<StringDictionary>;
        private complete(t);
    }
}
/**
 * Created by rburson on 3/6/15.
 */
import SystemContext = catavolt.ws.SystemContext;
import SessionContext = catavolt.ws.SessionContext;
import Request = catavolt.ws.Request;
import Call = catavolt.ws.Call;
import Get = catavolt.ws.Get;
/**
 * Created by rburson on 4/28/15.
 */
declare module catavolt.dialog {
    enum PaneMode {
        READ = 0,
        WRITE = 1,
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class MenuDef {
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
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class CellValueDef {
        private _style;
        static fromWS(otype: string, jsonObj: any): Try<CellValueDef>;
        constructor(_style: string);
        isInlineMediaStyle: boolean;
        style: string;
    }
}
/**
 * Created by rburson on 4/16/15.
 */
declare module catavolt.dialog {
    class AttributeCellValueDef extends CellValueDef {
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
}
/**
 * Created by rburson on 4/16/15.
 */
declare module catavolt.dialog {
    class ForcedLineCellValueDef extends CellValueDef {
        constructor();
    }
}
/**
 * Created by rburson on 4/16/15.
 */
declare module catavolt.dialog {
    class LabelCellValueDef extends CellValueDef {
        private _value;
        constructor(_value: string, style: string);
        value: string;
    }
}
/**
 * Created by rburson on 4/16/15.
 */
declare module catavolt.dialog {
    class TabCellValueDef extends CellValueDef {
        constructor();
    }
}
/**
 * Created by rburson on 4/16/15.
 */
declare module catavolt.dialog {
    class SubstitutionCellValueDef extends CellValueDef {
        private _value;
        constructor(_value: string, style: string);
        value: string;
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class CellDef {
        private _values;
        constructor(_values: Array<CellValueDef>);
        values: Array<CellValueDef>;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    interface EntityRec {
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
    module EntityRec.Util {
        function newEntityRec(objectId: string, props: Array<Prop>, annos?: Array<DataAnno>): EntityRec;
        function union(l1: Array<Prop>, l2: Array<Prop>): Array<Prop>;
        function fromWSEditorRecord(otype: string, jsonObj: any): Try<EntityRec>;
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class EntityRecDef {
        private _propDefs;
        constructor(_propDefs: Array<PropDef>);
        propCount: number;
        propDefAtName(name: string): PropDef;
        propDefs: Array<PropDef>;
        propertyDefs: Array<PropDef>;
        propNames: Array<string>;
    }
}
/**
 * Created by rburson on 4/4/15.
 */
declare module catavolt.dialog {
    class BinaryRef {
        private _settings;
        constructor(_settings: StringDictionary);
        static fromWSValue(encodedValue: string, settings: StringDictionary): Try<BinaryRef>;
        settings: StringDictionary;
    }
    class InlineBinaryRef extends BinaryRef {
        private _inlineData;
        constructor(_inlineData: string, settings: StringDictionary);
        inlineData: string;
    }
}
/**
 * Created by rburson on 4/5/15.
 */
declare module catavolt.dialog {
    class CodeRef {
        private _code;
        private _description;
        static fromFormattedValue(value: string): CodeRef;
        constructor(_code: string, _description: string);
        code: string;
        description: string;
        toString(): string;
    }
}
/**
 * Created by rburson on 4/5/15.
 */
declare module catavolt.dialog {
    class ObjectRef {
        private _objectId;
        private _description;
        static fromFormattedValue(value: string): ObjectRef;
        constructor(_objectId: string, _description: string);
        description: string;
        objectId: string;
        toString(): string;
    }
}
/**
 * Created by rburson on 4/5/15.
 */
declare module catavolt.dialog {
    class GeoFix {
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
}
/**
 * Created by rburson on 4/5/15.
 */
declare module catavolt {
    class GeoLocation {
        private _latitude;
        private _longitude;
        static fromFormattedValue(value: string): GeoLocation;
        constructor(_latitude: number, _longitude: number);
        latitude: number;
        longitude: number;
        toString(): string;
    }
}
/**
 * Created by rburson on 4/2/15.
 */
declare module catavolt.dialog {
    class DataAnno {
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
}
/**
 * Created by rburson on 4/2/15.
 */
declare module catavolt.dialog {
    class Prop {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class PropDef {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class SortPropDef {
        private _name;
        private _direction;
        constructor(_name: string, _direction: string);
        direction: string;
        name: string;
    }
}
/**
 * Created by rburson on 4/27/15.
 */
declare module catavolt.dialog {
    class PropFormatter {
        static formatForRead(prop: any, propDef: PropDef): string;
        static formatForWrite(prop: any, propDef: PropDef): string;
        static parse(value: string, propDef: PropDef): any;
        static toString(o: any): string;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class GraphDataPointDef {
        private _name;
        private _type;
        private _plotType;
        private _legendkey;
        constructor(_name: string, _type: string, _plotType: string, _legendkey: string);
    }
}
/**
 * Created by rburson on 4/13/15.
 */
declare module catavolt.dialog {
    class EntityRecImpl implements EntityRec {
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
}
/**
 * Created by rburson on 4/27/15.
 */
declare module catavolt.dialog {
    class EntityBuffer implements EntityRec {
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
}
/**
 * Created by rburson on 4/24/15.
 */
declare module catavolt.dialog {
    class NullEntityRec implements EntityRec {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class ColumnDef {
        private _name;
        private _heading;
        private _propertyDef;
        constructor(_name: string, _heading: string, _propertyDef: PropDef);
        heading: string;
        isInlineMediaStyle: boolean;
        name: string;
        propertyDef: PropDef;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class XPaneDef {
        static fromWS(otype: string, jsonObj: any): Try<XPaneDef>;
        constructor();
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class XBarcodeScanDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class XCalendarDef extends XPaneDef {
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
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class XDetailsDef extends XPaneDef {
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
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class XFormDef extends XPaneDef {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XGeoFixDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XGeoLocationDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        constructor(paneId: string, name: string, title: string);
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XGraphDef extends XPaneDef {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XImagePickerDef extends XPaneDef {
        paneId: string;
        name: string;
        title: string;
        URLProperty: string;
        defaultActionId: string;
        constructor(paneId: string, name: string, title: string, URLProperty: string, defaultActionId: string);
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XListDef extends XPaneDef {
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
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XMapDef extends XPaneDef {
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
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class XChangePaneModeResult {
        editorRecordDef: EntityRecDef;
        dialogProperties: StringDictionary;
        constructor(editorRecordDef: EntityRecDef, dialogProperties: StringDictionary);
        entityRecDef: EntityRecDef;
        dialogProps: StringDictionary;
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class XFormModel {
        form: XFormModelComp;
        header: XFormModelComp;
        children: Array<XFormModelComp>;
        placement: string;
        refreshTimer: number;
        sizeToWindow: boolean;
        constructor(form: XFormModelComp, header: XFormModelComp, children: Array<XFormModelComp>, placement: string, refreshTimer: number, sizeToWindow: boolean);
        static fromWS(otype: string, jsonObj: any): Try<XFormModel>;
    }
}
/**
 * Created by rburson on 3/31/15.
 */
declare module catavolt.dialog {
    class XFormModelComp {
        paneId: string;
        redirection: DialogRedirection;
        label: string;
        title: string;
        constructor(paneId: string, redirection: DialogRedirection, label: string, title: string);
    }
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    class XGetSessionListPropertyResult {
        private _list;
        private _dialogProps;
        constructor(_list: Array<string>, _dialogProps: StringDictionary);
        dialogProps: StringDictionary;
        values: Array<string>;
        valuesAsDictionary(): StringDictionary;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XGetActiveColumnDefsResult {
        columnsStyle: string;
        columns: Array<ColumnDef>;
        constructor(columnsStyle: string, columns: Array<ColumnDef>);
        columnDefs: Array<ColumnDef>;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XGetAvailableValuesResult {
        list: Array<any>;
        static fromWS(otype: string, jsonObj: any): Try<XGetAvailableValuesResult>;
        constructor(list: Array<any>);
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    interface XOpenDialogModelResult {
        entityRecDef: EntityRecDef;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XOpenEditorModelResult implements XOpenDialogModelResult {
        editorRecordDef: EntityRecDef;
        formModel: XFormModel;
        constructor(editorRecordDef: EntityRecDef, formModel: XFormModel);
        entityRecDef: EntityRecDef;
        formPaneId: string;
        formRedirection: DialogRedirection;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XOpenQueryModelResult implements XOpenDialogModelResult {
        entityRecDef: EntityRecDef;
        sortPropertyDef: Array<SortPropDef>;
        defaultActionId: string;
        static fromWS(otype: string, jsonObj: any): Try<XOpenQueryModelResult>;
        constructor(entityRecDef: EntityRecDef, sortPropertyDef: Array<SortPropDef>, defaultActionId: string);
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class XPaneDefRef {
        name: string;
        paneId: string;
        title: string;
        type: string;
        constructor(name: string, paneId: string, title: string, type: string);
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XPropertyChangeResult {
        availableValueChanges: Array<string>;
        propertyName: string;
        sideEffects: XReadResult;
        editorRecordDef: EntityRecDef;
        constructor(availableValueChanges: Array<string>, propertyName: string, sideEffects: XReadResult, editorRecordDef: EntityRecDef);
        sideEffectsDef: EntityRecDef;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XQueryResult {
        entityRecs: Array<EntityRec>;
        entityRecDef: EntityRecDef;
        hasMore: boolean;
        sortPropDefs: Array<SortPropDef>;
        defaultActionId: string;
        dialogProps: StringDictionary;
        constructor(entityRecs: Array<EntityRec>, entityRecDef: EntityRecDef, hasMore: boolean, sortPropDefs: Array<SortPropDef>, defaultActionId: string, dialogProps: StringDictionary);
        static fromWS(otype: string, jsonObj: any): Try<XQueryResult>;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XReadPropertyResult {
        constructor();
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XReadResult {
        private _editorRecord;
        private _editorRecordDef;
        private _dialogProperties;
        constructor(_editorRecord: EntityRec, _editorRecordDef: EntityRecDef, _dialogProperties: StringDictionary);
        entityRec: EntityRec;
        entityRecDef: EntityRecDef;
        dialogProps: StringDictionary;
    }
}
/**
 * Created by rburson on 4/1/15.
 */
declare module catavolt.dialog {
    class XWriteResult {
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
}
/**
 * Created by rburson on 3/16/15.
 */
declare module catavolt.dialog {
    interface VoidResult {
    }
}
/**
 * Created by rburson on 3/16/15.
 */
declare module catavolt.dialog {
    interface DialogException extends UserException {
    }
}
/**
 * Created by rburson on 3/10/15.
 */
declare module catavolt.dialog {
    class Redirection {
        static fromWS(otype: string, jsonObj: any): Try<Redirection>;
        fromDialogProperties: StringDictionary;
    }
}
/**
 * Created by rburson on 3/27/15.
 */
declare module catavolt.dialog {
    class DialogHandle {
        handleValue: number;
        sessionHandle: string;
        constructor(handleValue: number, sessionHandle: string);
    }
}
/**
 * Created by rburson on 3/26/15.
 */
declare module catavolt.dialog {
    class DialogRedirection extends Redirection {
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
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    class NullRedirection extends Redirection {
        fromDialogProperties: StringDictionary;
        constructor(fromDialogProperties: StringDictionary);
    }
}
/**
 * Created by rburson on 3/27/15.
 */
declare module catavolt.dialog {
    class WebRedirection extends Redirection implements NavRequest {
        private _webURL;
        private _open;
        private _dialogProperties;
        private _fromDialogProperties;
        constructor(_webURL: string, _open: boolean, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
        fromDialogProperties: StringDictionary;
    }
}
/**
 * Created by rburson on 3/27/15.
 */
declare module catavolt.dialog {
    class WorkbenchRedirection extends Redirection {
        private _workbenchId;
        private _dialogProperties;
        private _fromDialogProperties;
        constructor(_workbenchId: string, _dialogProperties: StringDictionary, _fromDialogProperties: StringDictionary);
        workbenchId: string;
        dialogProperties: StringDictionary;
        fromDialogProperties: StringDictionary;
    }
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.dialog {
    class DialogTriple {
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
}
/**
 * Created by rburson on 3/27/15.
 */
declare module catavolt.dialog {
    interface ActionSource {
        fromActionSource: ActionSource;
        virtualPathSuffix: Array<string>;
    }
}
/**
 * Created by rburson on 3/27/15.
 */
declare module catavolt.dialog {
    class ContextAction implements ActionSource {
        actionId: string;
        objectId: string;
        fromActionSource: ActionSource;
        constructor(actionId: string, objectId: string, fromActionSource: ActionSource);
        virtualPathSuffix: Array<string>;
    }
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    interface NavRequest {
    }
    module NavRequest.Util {
        function fromRedirection(redirection: Redirection, actionSource: ActionSource, sessionContext: SessionContext): Future<NavRequest>;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class NullNavRequest implements NavRequest {
        fromDialogProperties: StringDictionary;
        constructor();
    }
}
/**
 * Created by rburson on 3/12/15.
 */
declare module catavolt.dialog {
    interface ServiceEndpoint {
        serverAssignment: string;
        tenantId: string;
        responseType: string;
        soiVersion: string;
    }
}
/**
 * Created by rburson on 3/13/15.
 */
declare module catavolt.dialog {
    class AppContext {
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
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.dialog {
    class SessionContextImpl implements SessionContext {
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
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.dialog {
    class SystemContextImpl implements SystemContext {
        private _urlString;
        constructor(_urlString: string);
        urlString: string;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    interface Binary {
    }
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    class Workbench implements NavRequest {
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
}
/**
 * Created by rburson on 3/13/15.
 */
declare module catavolt.dialog {
    class AppWinDef {
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
}
/**
 * Created by rburson on 3/9/15.
 */
declare module catavolt.dialog {
    class SessionService {
        private static SERVICE_NAME;
        private static SERVICE_PATH;
        static createSession(tenantId: string, userId: string, password: string, clientType: string, systemContext: SystemContext): Future<SessionContext>;
        static deleteSession(sessionContext: SessionContext): Future<VoidResult>;
        static getSessionListProperty(propertyName: string, sessionContext: SessionContext): Future<XGetSessionListPropertyResult>;
        static setSessionListProperty(propertyName: string, listProperty: Array<string>, sessionContext: SessionContext): Future<VoidResult>;
    }
}
/**
 * Created by rburson on 3/12/15.
 */
declare module catavolt.dialog {
    class GatewayService {
        static getServiceEndpoint(tenantId: string, serviceName: string, gatewayHost: string): Future<ServiceEndpoint>;
    }
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    class WorkbenchLaunchAction implements ActionSource {
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
}
/**
 * Created by rburson on 3/17/15.
 */
declare module catavolt.dialog {
    class WorkbenchService {
        private static SERVICE_NAME;
        private static SERVICE_PATH;
        static getAppWinDef(sessionContext: SessionContext): Future<AppWinDef>;
        static getWorkbench(sessionContext: SessionContext, workbenchId: string): Future<Workbench>;
        static performLaunchAction(actionId: string, workbenchId: string, sessionContext: SessionContext): Future<Redirection>;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class PaneDef {
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
}
/**
 * Created by rburson on 4/21/15.
 */
declare module catavolt.dialog {
    class DetailsDef extends PaneDef {
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
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class FormDef extends PaneDef {
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
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class ListDef extends PaneDef {
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
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class MapDef extends PaneDef {
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
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class GraphDef extends PaneDef {
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
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class GeoFixDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class GeoLocationDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class BarcodeScanDef extends PaneDef {
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary);
    }
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class CalendarDef extends PaneDef {
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
}
/**
 * Created by rburson on 4/22/15.
 */
declare module catavolt.dialog {
    class ImagePickerDef extends PaneDef {
        private _URLPropName;
        private _defaultActionId;
        constructor(paneId: string, name: string, label: string, title: string, menuDefs: Array<MenuDef>, entityRecDef: EntityRecDef, dialogRedirection: DialogRedirection, settings: StringDictionary, _URLPropName: string, _defaultActionId: string);
        defaultActionId: string;
        URLPropName: string;
    }
}
/**
 * Created by rburson on 4/14/15.
 */
declare module catavolt.dialog {
    class DialogService {
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
        static writeEditorModel(dialogHandle: DialogHandle, entityRec: EntityRec, sessionContext: SessionContext): Future<Either<Redirection, XWriteResult>>;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class PaneContext {
        private static ANNO_NAME_KEY;
        private static PROP_NAME_KEY;
        entityRecDef: EntityRecDef;
        private _binaryCache;
        private _lastRefreshTime;
        private _parentContext;
        private _paneRef;
        static resolveSettingsFromNavRequest(initialSettings: StringDictionary, navRequest: NavRequest): StringDictionary;
        constructor(paneRef: number);
        actionSource: ActionSource;
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
    }
}
/**
 * Created by rburson on 4/27/15.
 */
declare module catavolt.dialog {
    class EditorContext extends PaneContext {
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
}
/**
 * Created by rburson on 4/30/15.
 */
declare module catavolt.dialog {
    class QueryResult {
        entityRecs: Array<EntityRec>;
        hasMore: boolean;
        constructor(entityRecs: Array<EntityRec>, hasMore: boolean);
    }
}
/**
 * Created by rburson on 4/30/15.
 */
declare module catavolt.dialog {
    class HasMoreQueryMarker extends NullEntityRec {
        static singleton: HasMoreQueryMarker;
    }
    class IsEmptyQueryMarker extends NullEntityRec {
        static singleton: IsEmptyQueryMarker;
    }
    enum QueryMarkerOption {
        None = 0,
        IsEmpty = 1,
        HasMore = 2,
    }
    class QueryScroller {
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
}
/**
 * Created by rburson on 4/27/15.
 */
declare module catavolt.dialog {
    enum QueryDirection {
        FORWARD = 0,
        BACKWARD = 1,
    }
    class QueryContext extends PaneContext {
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
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class FormContext extends PaneContext {
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
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class ListContext extends QueryContext {
        constructor(paneRef: number, offlineRecs?: Array<EntityRec>, settings?: StringDictionary);
        columnHeadings: Array<string>;
        listDef: ListDef;
        rowValues(entityRec: EntityRec): Array<any>;
        style: string;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class DetailsContext extends EditorContext {
        constructor(paneRef: number);
        detailsDef: DetailsDef;
        printMarkupURL: string;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class MapContext extends QueryContext {
        constructor(paneRef: number);
        mapDef: MapDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class GraphContext extends QueryContext {
        constructor(paneRef: number);
        graphDef: GraphDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class CalendarContext extends QueryContext {
        constructor(paneRef: number);
        calendarDef: CalendarDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class ImagePickerContext extends QueryContext {
        constructor(paneRef: number);
        imagePickerDef: ImagePickerDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class BarcodeScanContext extends EditorContext {
        constructor(paneRef: number);
        barcodeScanDef: BarcodeScanDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class GeoFixContext extends EditorContext {
        constructor(paneRef: number);
        geoFixDef: GeoFixDef;
    }
}
/**
 * Created by rburson on 5/4/15.
 */
declare module catavolt.dialog {
    class GeoLocationContext extends EditorContext {
        constructor(paneRef: number);
        geoLocationDef: GeoLocationDef;
    }
}
/**
 * Created by rburson on 3/30/15.
 */
declare module catavolt.dialog {
    class FormContextBuilder {
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
}
/**
 * Created by rburson on 3/23/15.
 */
declare module catavolt.dialog {
    class OType {
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
/**
 * Created by rburson on 3/6/15.
 */
import ActionSource = catavolt.dialog.ActionSource;
import AppContext = catavolt.dialog.AppContext;
import AppWinDef = catavolt.dialog.AppWinDef;
import AttributeCellValueDef = catavolt.dialog.AttributeCellValueDef;
import BarcodeScanContext = catavolt.dialog.BarcodeScanContext;
import BarcodeScanDef = catavolt.dialog.BarcodeScanDef;
import BinaryRef = catavolt.dialog.BinaryRef;
import CalendarContext = catavolt.dialog.CalendarContext;
import CalendarDef = catavolt.dialog.CalendarDef;
import CellDef = catavolt.dialog.CellDef;
import CellValueDef = catavolt.dialog.CellValueDef;
import CodeRef = catavolt.dialog.CodeRef;
import ColumnDef = catavolt.dialog.ColumnDef;
import ContextAction = catavolt.dialog.ContextAction;
import DataAnno = catavolt.dialog.DataAnno;
import DetailsContext = catavolt.dialog.DetailsContext;
import DialogRedirection = catavolt.dialog.DialogRedirection;
import DialogService = catavolt.dialog.DialogService;
import DetailsDef = catavolt.dialog.DetailsDef;
import EditorContext = catavolt.dialog.EditorContext;
import EntityRec = catavolt.dialog.EntityRec;
import EntityRecDef = catavolt.dialog.EntityRecDef;
import ForcedLineCellValueDef = catavolt.dialog.ForcedLineCellValueDef;
import FormContext = catavolt.dialog.FormContext;
import FormContextBuilder = catavolt.dialog.FormContextBuilder;
import FormDef = catavolt.dialog.FormDef;
import GeoFix = catavolt.dialog.GeoFix;
import GeoFixDef = catavolt.dialog.GeoFixDef;
import GeoFixContext = catavolt.dialog.GeoFixContext;
import GeoLocationContext = catavolt.dialog.GeoLocationContext;
import GeoLocationDef = catavolt.dialog.GeoLocationDef;
import GraphContext = catavolt.dialog.GraphContext;
import GraphDataPointDef = catavolt.dialog.GraphDataPointDef;
import GraphDef = catavolt.dialog.GraphDef;
import ImagePickerContext = catavolt.dialog.ImagePickerContext;
import ImagePickerDef = catavolt.dialog.ImagePickerDef;
import LabelCellValueDef = catavolt.dialog.LabelCellValueDef;
import ListContext = catavolt.dialog.ListContext;
import ListDef = catavolt.dialog.ListDef;
import MapContext = catavolt.dialog.MapContext;
import MapDef = catavolt.dialog.MapDef;
import MenuDef = catavolt.dialog.MenuDef;
import NavRequest = catavolt.dialog.NavRequest;
import NullRedirection = catavolt.dialog.NullRedirection;
import ObjectRef = catavolt.dialog.ObjectRef;
import PaneContext = catavolt.dialog.PaneContext;
import PaneDef = catavolt.dialog.PaneDef;
import PaneMode = catavolt.dialog.PaneMode;
import Prop = catavolt.dialog.Prop;
import PropDef = catavolt.dialog.PropDef;
import PropFormatter = catavolt.dialog.PropFormatter;
import QueryResult = catavolt.dialog.QueryResult;
import QueryScroller = catavolt.dialog.QueryScroller;
import QueryContext = catavolt.dialog.QueryContext;
import Redirection = catavolt.dialog.Redirection;
import ServiceEndpoint = catavolt.dialog.ServiceEndpoint;
import SortPropDef = catavolt.dialog.SortPropDef;
import SubstitutionCellValueDef = catavolt.dialog.SubstitutionCellValueDef;
import TabCellValueDef = catavolt.dialog.TabCellValueDef;
import VoidResult = catavolt.dialog.VoidResult;
import WebRedirection = catavolt.dialog.WebRedirection;
import Workbench = catavolt.dialog.Workbench;
import WorkbenchLaunchAction = catavolt.dialog.WorkbenchLaunchAction;
import WorkbenchRedirection = catavolt.dialog.WorkbenchRedirection;
