/**
 * Created by rburson on 10/19/17.
 */

import {
    StringDictionary, Log, ObjUtil, StringUtil, ArrayUtil, DateValue, DateTimeValue, TimeValue,
    Dictionary, DataUrl
} from './util'
import moment = require("moment");
import {Catavolt} from "./dialog";
/*
 ************************** Dialog Models ****************************
 * These models correspond to those in the WebAPI schema specification
 * *******************************************************************
 */



/** ************** Base classes have to be defined first i.e. Order matters ********************/

export abstract class BinaryRef {

    constructor(private _settings:StringDictionary) {
    }

    //@TODO
    /*
     static fromWSValue(encodedValue:string, settings:StringDictionary):Try<BinaryRef> {

     if (encodedValue && encodedValue.length > 0) {
     return new Success(new InlineBinaryRef(encodedValue, settings));
     } else {
     return new Success(new ObjectBinaryRef(settings));
     }

     }
     */
    get settings():StringDictionary {
        return this._settings;
    }

}


export abstract class CellValue {

    static STYLE_HEADING1 = "textHeading1";
    static STYLE_HEADING2 = "textHeading2";
    static STYLE_HEADING3 = "textHeading3";
    static STYLE_HEADING4 = "textHeading4";
    static STYLE_INLINE_MEDIA = "inlineMedia";
    static STYLE_INLINE_MEDIA2 = "Image/Video";

    readonly type:string;

    constructor(readonly style:string) {}

    get isHeading1Style():boolean {
        return this.style && (this.style === CellValue.STYLE_HEADING1);
    }

    get isHeading2Style():boolean {
        return this.style && (this.style === CellValue.STYLE_HEADING2);
    }

    get isHeading3Style():boolean {
        return this.style && (this.style === CellValue.STYLE_HEADING3);
    }

    get isHeading4Style():boolean {
        return this.style && (this.style === CellValue.STYLE_HEADING4);
    }

    get isInlineMediaStyle():boolean {
        return this.style && (this.style === CellValue.STYLE_INLINE_MEDIA || this.style === CellValue.STYLE_INLINE_MEDIA2);
    }

}

/**
 * A View represents a Catavolt 'Pane' definition.  A Pane can be thought of as a 'panel' or UI component
 * that is responsible for displaying a data record or records. The Pane describes 'how' and 'where' the data will be
 * displayed, as well as surrounding 'meta' data (i.e. the Pane title, the Pane's menus).  The Pane itself does not contain
 * the record or records to be displayed, but may be combined with a {@link Record}(s) to display the data.
 */
export abstract class View {

    /* From View */
    readonly alias:string;
    readonly id:string;
    readonly name:string;
    readonly menu:Menu;
    readonly title:string;
    readonly type: ViewType;

    /* @TODO Leftover from PaneDef */
    /*
    readonly label:string;
    readonly viewDescs:Array<ViewDesc>;
    readonly recordDef:RecordDef;
    readonly dialogRedirection:DialogRedirection;
    readonly settings:StringDictionary;
    */

    /**
     * Find the title for this Pane
     * @returns {string}
     */
    findTitle():string {
        var result:string = this.title ? this.title.trim() : '';
        result = result === 'null' ? '' : result;
        if (result === '') {
            //@TODO put this back when label is resolved
            //result = this.label ? this.label.trim() : '';
            //result = result === 'null' ? '' : result;
        }
        return result;
    }

    /**
     * Find a menu def on this View with the given actionId
     * @param actionId
     * @returns {Menu}
     */
    findMenuAt(actionId:string):Menu {
        var result:Menu = null;
        if (this.menu) {
            this.menu.children.some((md:Menu)=> {
                result = md.findAtActionId(actionId);
                return result != null;
            });
        }
        return result;
    }


}

/** ************************** Subclasses *******************************************************/

export interface ActionParameters {

    readonly pendingWrites?:Record;
    readonly targets?:Array<string>;
    readonly type:string;

}

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
export class AttributeCellValue extends CellValue {

    constructor(readonly propertyName: string,
                readonly entryMethod: AttributeCellValueEntryMethod,
                readonly hint: string,
                readonly tooltip: string,
                readonly mask: string,
                readonly autoFillCapable: boolean,
                readonly actions: Array<Menu>,
                style:string) {

        super(style);

    }

    get isComboBoxEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'COMBO_BOX';
    }

    get isDropDownEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'DROP_DOWN';
    }

    get isIconEntryMethod():boolean {
        return this.entryMethod && this.entryMethod === 'ICON_CHOOSER';
    }

    get isTextFieldEntryMethod():boolean {
        return !this.entryMethod || this.entryMethod === 'TEXT_FIELD';
    }

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export class BarcodeScan extends View {
}


/**
 * ************* Binary Support ********************
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


export class Attachment {

    constructor(public name:string, public attachmentData:any) {};

}



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

export interface Cell {
    values:Array<CellValue>;
}

export interface Column {

    readonly propertyName:string;
    readonly heading:string;

}

export class CodeRef {

    constructor(readonly code:string, readonly description:string, readonly type:string) {
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



export class ReferringObject {

    readonly type:string;
    readonly actionId:string;

    isDialogReferrer():boolean {
        return this.type === TypeNames.ReferringDialogTypeName;
    }

    isWorkbenchReferrer():boolean {
        return this.type === TypeNames.ReferringWorkbenchTypeName;
    }

}

export class ReferringDialog extends ReferringObject{

    readonly dialogId:string;
    readonly dialogMode:DialogMode;

}

export class ReferringWorkbench extends ReferringObject{

    readonly workbenchId:string;

}


export interface DialogMessage {

    /**
     * A short language-independent identifier
     */
    readonly code:string;

    readonly messageType: DialogMessageType;
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
     * If the case of a host programming error, this property contains a stack trace of the host programming language.
     */
    readonly stackTrace: string;

    readonly type:string;

}
export interface DialogRedirection extends Redirection {

    readonly dialogDescription:string;
    readonly dialogId:string;

}

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

export interface Annotation {
    readonly name:string;
    readonly value:string;
    readonly type:string;
}

export class DataAnnotation implements Annotation{

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

    static backgroundColor(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isBackgroundColor;
        });
        return result ? result.backgroundColor : null;
    }

    static foregroundColor(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isForegroundColor;
        });
        return result ? result.foregroundColor : null;
    }

    static imageName(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isImageName;
        });
        return result ? result.value : null;
    }

    static imagePlacement(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isImagePlacement;
        });
        return result ? result.value : null;
    }

    static isBoldText(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isBoldText
        });
    }

    static isItalicText(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isItalicText
        });
    }

    static isPlacementCenter(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isPlacementCenter
        });
    }

    static isPlacementLeft(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isPlacementLeft
        });
    }

    static isPlacementRight(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isPlacementRight
        });
    }

    static isPlacementStretchUnder(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isPlacementStretchUnder
        });
    }

    static isPlacementUnder(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isPlacementUnder
        });
    }

    static isUnderlineText(annotations:Array<DataAnnotation>):boolean {
        return annotations.some((anno)=> {
            return anno.isUnderlineText
        });
    }

    static overrideText(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isOverrideText;
        });
        return result ? result.value : null;
    }

    static tipText(annotations:Array<DataAnnotation>):string {
        var result:DataAnnotation = ArrayUtil.find(annotations, (anno)=> {
            return anno.isTipText;
        });
        return result ? result.value : null;
    }


    constructor(readonly name:string, readonly value:string, readonly type:string) {
    }

    get backgroundColor():string {
        return this.isBackgroundColor ? this.value : null;
    }

    get foregroundColor():string {
        return this.isForegroundColor ? this.value : null;
    }

    equals(dataAnno:Annotation):boolean {
        return this.name === dataAnno.name;
    }

    get isBackgroundColor():boolean {
        return this.name === DataAnnotation.BACKGROUND_COLOR;
    }

    get isBoldText():boolean {
        return this.name === DataAnnotation.BOLD_TEXT && this.value === DataAnnotation.TRUE_VALUE;
    }

    get isForegroundColor():boolean {
        return this.name === DataAnnotation.FOREGROUND_COLOR;
    }

    get isImageName():boolean {
        return this.name === DataAnnotation.IMAGE_NAME;
    }

    get isImagePlacement():boolean {
        return this.name === DataAnnotation.IMAGE_PLACEMENT;
    }

    get isItalicText():boolean {
        return this.name === DataAnnotation.ITALIC_TEXT && this.value === DataAnnotation.TRUE_VALUE;
    }

    get isOverrideText():boolean {
        return this.name === DataAnnotation.OVERRIDE_TEXT;
    }

    get isPlacementCenter():boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_CENTER;
    }

    get isPlacementLeft():boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_LEFT;
    }

    get isPlacementRight():boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_RIGHT;
    }

    get isPlacementStretchUnder():boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_STRETCH_UNDER;
    }

    get isPlacementUnder():boolean {
        return this.isImagePlacement && this.value === DataAnnotation.PLACEMENT_UNDER;
    }

    get isTipText():boolean {
        return this.name === DataAnnotation.TIP_TEXT;
    }

    get isUnderlineText():boolean {
        return this.name === DataAnnotation.UNDERLINE && this.value === DataAnnotation.TRUE_VALUE;
    }

    toJSON():Annotation {
        return {name: this.name, value: this.value, type: this.type};
    }

}


/**
 * Utility for working with Records
 */
export class RecordUtil {

    static newRecord(id:string, properties:Array<Property>, annotations:Array<DataAnnotation>, type:string):Record {
        return annotations ? new RecordImpl(id, ArrayUtil.copy(properties), ArrayUtil.copy(annotations), type) :
            new RecordImpl(id, ArrayUtil.copy(properties), null, type);
    }

    static isRecord(o:any):boolean {

       return (o instanceof RecordImpl)
           || (o instanceof RecordBuffer)
           || (o instanceof NullRecord);
    }

    /*
     static union(l1:Array<Property>, l2:Array<Property>):Array<Property> {
     var result:Array<Property> = ArrayUtil.copy(l1);
     l2.forEach((p2:Property)=> {
     if (!l1.some((p1:Property, i)=> {
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
     }*/
}

/**
 * An {@link Record} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An Record Represents a 'Record' or set of {@link Prop} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class RecordBuffer implements Record {

    static createRecordBuffer(id:string, before:Array<Property>, after:Array<Property>, annotations:Array<DataAnnotation>, type:string):RecordBuffer {
        return new RecordBuffer(RecordUtil.newRecord(id, before, annotations, type), RecordUtil.newRecord(id, after, annotations, type));
    }

    constructor(private _before:Record, private _after?:Record) {
        if (!_before) throw new Error('_before is null in RecordBuffer');
        if (!_after) this._after = _before;
    }

    get after():Record {
        return this._after;
    }

    get annotations():Array<DataAnnotation> {
        return this._after.annotations;
    }

    annotationsAtName(propName:string):Array<DataAnnotation> {
        return this._after.annotationsAtName(propName);
    }

    afterEffects(afterAnother?:Record):Record {
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

    get before():Record {
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

    get id():string {
        return this._after.id;
    }

    get overrideText():string {
        return this._after.overrideText;
    }

    overrideTextFor(propName:string):string {
        return this._after.overrideTextFor(propName);
    }

    propAtIndex(index:number):Property {
        return this.properties[index];
    }

    propAtName(propName:string):Property {
        return this._after.propAtName(propName);
    }

    get propCount():number {
        return this._after.propCount;
    }

    get propNames():Array<string> {
        return this._after.propNames;
    }

    get properties():Array<Property> {
        return this._after.properties;
    }

    get propValues():Array<any> {
        return this._after.propValues;
    }

    get type():string {
        return this._after.type;
    }

    setValue(name:string, value) {
        const newProps = [];
        let found = false;
        this.properties.forEach((prop:Property)=> {
            if (prop.name === name) {
                newProps.push(new Property(name, value, prop.propertyType, prop.format, prop.annotations));
                found = true;
            } else {
                newProps.push(prop);
            }
        });
        if (!found) {
            newProps.push(new Property(name, value));
        }
        this._after = RecordUtil.newRecord(this.id, newProps, this.annotations, this.type);
    }

    get tipText():string {
        return this._after.tipText;
    }

    tipTextFor(propName:string):string {
        return this._after.tipTextFor(propName);
    }

    toRecord():Record {
        return RecordUtil.newRecord(this.id, this.properties, this.annotations, this.type);
    }

    toJSON() {
       return this.afterEffects().toJSON();
    }

    valueAtName(propName:string):any {
        return this._after.valueAtName(propName);
    }

}
/**
 * *********************************
 */
/**
 * The implementation of {@link Record}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class RecordImpl implements Record {

    constructor(readonly id:string, readonly properties:Array<Property> = [], readonly annotations:Array<DataAnnotation> = [], readonly type:string) {
    }

    annotationsAtName(propName:string):Array<DataAnnotation> {
        var p = this.propAtName(propName);
        return p ? p.annotations : [];
    }

    afterEffects(after:Record):Record {
        var effects = [];
        after.properties.forEach((afterProp)=> {
            var beforeProp = this.propAtName(afterProp.name);
            if (!afterProp.equals(beforeProp)) {
                effects.push(afterProp);
            }
        });
        return new RecordImpl(after.id, effects, after.annotations, after.type);
    }

    get backgroundColor():string {
        return DataAnnotation.backgroundColor(this.annotations);
    }

    backgroundColorFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.backgroundColor ? p.backgroundColor : this.backgroundColor;
    }

    get foregroundColor():string {
        return DataAnnotation.foregroundColor(this.annotations);
    }

    foregroundColorFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.foregroundColor ? p.foregroundColor : this.foregroundColor;
    }

    get imageName():string {
        return DataAnnotation.imageName(this.annotations);
    }

    imageNameFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.imageName ? p.imageName : this.imageName;
    }

    get imagePlacement():string {
        return DataAnnotation.imagePlacement(this.annotations);
    }

    imagePlacementFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.imagePlacement ? p.imagePlacement : this.imagePlacement;
    }

    get isBoldText():boolean {
        return DataAnnotation.isBoldText(this.annotations);
    }

    isBoldTextFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isBoldText ? p.isBoldText : this.isBoldText;
    }

    get isItalicText():boolean {
        return DataAnnotation.isItalicText(this.annotations);
    }

    isItalicTextFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isItalicText ? p.isItalicText : this.isItalicText;

    }

    get isPlacementCenter():boolean {
        return DataAnnotation.isPlacementCenter(this.annotations);
    }

    isPlacementCenterFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementCenter ? p.isPlacementCenter : this.isPlacementCenter;
    }

    get isPlacementLeft():boolean {
        return DataAnnotation.isPlacementLeft(this.annotations);
    }

    isPlacementLeftFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementLeft ? p.isPlacementLeft : this.isPlacementLeft;

    }

    get isPlacementRight():boolean {
        return DataAnnotation.isPlacementRight(this.annotations);
    }

    isPlacementRightFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementRight ? p.isPlacementRight : this.isPlacementRight;
    }

    get isPlacementStretchUnder():boolean {
        return DataAnnotation.isPlacementStretchUnder(this.annotations);
    }

    isPlacementStretchUnderFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementStretchUnder ? p.isPlacementStretchUnder : this.isPlacementStretchUnder;
    }

    get isPlacementUnder():boolean {
        return DataAnnotation.isPlacementUnder(this.annotations);
    }

    isPlacementUnderFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isPlacementUnder ? p.isPlacementUnder : this.isPlacementUnder;
    }

    get isUnderline():boolean {
        return DataAnnotation.isUnderlineText(this.annotations);
    }

    isUnderlineFor(propName:string):boolean {
        var p = this.propAtName(propName);
        return p && p.isUnderline ? p.isUnderline : this.isUnderline;

    }

    get overrideText():string {
        return DataAnnotation.overrideText(this.annotations);
    }

    overrideTextFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.overrideText ? p.overrideText : this.overrideText;

    }

    propAtIndex(index:number):Property {
        return this.properties[index];
    }

    propAtName(propName:string):Property {
        var prop:Property = null;
        this.properties.some((p)=> {
            if (p.name === propName) {
                prop = p;
                return true;
            }
            return false;
        });
        return prop;
    }

    get propCount():number {
        return this.properties.length;
    }

    get propNames():Array<string> {
        return this.properties.map((p)=> {
            return p.name;
        });
    }

    get propValues():Array<any> {
        return this.properties.map((p)=> {
            return p.value;
        });
    }

    get tipText():string {
        return DataAnnotation.tipText(this.annotations);
    }

    tipTextFor(propName:string):string {
        var p = this.propAtName(propName);
        return p && p.tipText ? p.tipText : this.tipText;

    }

    toJSON() {
        return {
            id: this.id,
            properties: this.properties,
            type: TypeNames.RecordTypeName
        };
    }

    toRecord():Record {
        return this;
    }

    valueAtName(propName:string):any {
        var value = null;
        this.properties.some((p)=> {
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

export class ErrorMessage extends View {

    readonly exception:DialogException;
}


export interface Filter {

    readonly not: boolean;
    readonly operand1: any;
    readonly operator: FilterOperator;
    readonly operand2: any;

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export class ForcedLineCellValue extends CellValue {

    constructor(style?:string) {
       super(style);
    }

 }

/**
 * A composition of View objects that, together, comprise a UI form.
 */
export class Form extends View {

    readonly borderStyle: string;
    readonly formStyle: string;
    readonly formLayout: string;

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
        return (this.formLayout && this.formLayout === 'FOUR_BOX_SQUARE') ||
            (this.formLayout && this.formLayout === 'H(2,2)');
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
        return this.formLayout && this.formLayout.indexOf('H(2,V') > -1;
    }

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export class GpsReading extends View {
}

export class GpsReadingProperty{

    constructor(readonly accuracy:number, readonly latitude:number,
                readonly longitude:number,readonly source:string, readonly type:string){}

}


/**
 * A purely declarative type. This object has no additional properties.
 */
export class MapLocation extends View {
}

export class MapLocationProperty{

    constructor(readonly latitude:number, readonly longitude:number, readonly type:string){};

}



/**
 * A view describing how to display a collection of data as a line graph, pie chart, bar chart, etc.
 */
export class Graph extends View {


    static GRAPH_TYPE_CARTESIAN = "GRAPH_TYPE_BAR";
    static GRAPH_TYPE_PIE = "GRAPH_TYPE_PIE";
    static PLOT_TYPE_BAR = "BAR";
    static PLOT_TYPE_BUBBLE = "BUBBLE";
    static PLOT_TYPE_LINE = "LINE";
    static PLOT_TYPE_SCATTER = "SCATTER";
    static PLOT_TYPE_STACKED = "STACKED";

    readonly graphType: string;
    readonly displayQuadrantLines:boolean;
    readonly identityDataPoint: GraphDataPoint;
    readonly groupingDataPoint: GraphDataPoint;
    readonly dataPoints: Array<GraphDataPoint>;
    readonly filterDataPoints: Array<GraphDataPoint>;
    readonly sampleModel:string;
    readonly xAxisLabel:string;
    readonly xAxisRangeFrom:number;
    readonly xAxisRangeTo:number;
    readonly yAxisLabel:string;
    readonly yAxisRangeFrom:number;
    readonly yAxisRangeTo:number;

}

export interface GraphDataPoint {

    readonly propertyName: string;
    readonly legendKey: string;
    readonly plotType: string;
    readonly type: string;
    readonly bubbleRadiusName:string,
    readonly bubbleRadiusType:string,
    readonly seriesColor:string,
    readonly xAxisName:string,
    readonly xAxisType:string

}

export class ImagePicker extends View {
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

/**
 * A text description typically preceeding a UI component as a prompt
 */
export class LabelCellValue extends CellValue {

    constructor(style, readonly value:string) {
        super(style);
    }

}

export interface Login {

    readonly userId:string;
    readonly password:string;
    readonly clientType:ClientType;
    readonly deviceProperties:StringDictionary;
    readonly type:string;

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

    get columnHeadings():Array<string> {
        return this.columns.map((c:Column)=> {
            return c.heading;
        });
    }

    rowValues(record:Record):Array<any> {
        return this.columns.map((c:Column)=> {
            return record.valueAtName(c.propertyName);
        });
    }

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

export class Menu {

    readonly children: Array<Menu> = [];
    /**
     * A special value understood by the UI, such as 'refresh'
     */
    readonly actionId:string;
    readonly directive: string;
    readonly iconUrl: string;
    readonly id:string;
    readonly label: string;
    readonly visible:boolean;
    /**
     * The menu is allowed (active) for these modes
     */
    readonly modes: Array<string>;
    readonly type: string;

    static findSubMenu(md:Menu, matcher:(menu:Menu)=>boolean):Menu {
        if (matcher(md)) return md;
        if (md.children) {
            for (let i = 0; i < md.children.length; i++) {
                let result = Menu.findSubMenu(md.children[i], matcher);
                if (result) return result;
            }
        }
        return null;
    }

    findAtActionId(actionId:string):Menu {
        if (this.actionId === actionId) return this;
        var result = null;
        if (this.children) {
            this.children.some((md:Menu)=> {
                result = md.findAtActionId(actionId);
                return result != null;
            });
        }
        return result;
    }

    findContextMenu():Menu {
        return Menu.findSubMenu(this, (md:Menu) => {
            return md.id === 'CONTEXT_MENU';
        });
    }
    get isPresaveDirective():boolean {
        return this.directive && this.directive === 'PRESAVE';
    }

    get isRead():boolean {
        return this.modes && this.modes.indexOf('R') > -1;
    }

    get isSeparator():boolean {
        return this.type && this.type === 'separator';
    }

    get isWrite():boolean {
        return this.modes && this.modes.indexOf('W') > -1;
    }



}

/**
 * An empty or uninitialized {@link Record}.
 * Represents a 'Record' or set of {@link Prop} (names and values).
 * An Record may also have {@link Annotation}s (style annotations) that apply to the whole 'record'
 */
export class NullRecord implements Record {

    static singleton:NullRecord = new NullRecord();

    constructor() {
    }

    get annotations():Array<DataAnnotation> {
        return [];
    }

    annotationsAtName(propName:string):Array<DataAnnotation> {
        return [];
    }

    afterEffects(after:Record):Record {
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

    get id():string {
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

    propAtIndex(index:number):Property {
        return null;
    }

    propAtName(propName:string):Property {
        return null;
    }

    get propCount():number {
        return 0;
    }

    get propNames():Array<string> {
        return [];
    }

    get properties():Array<Property> {
        return [];
    }

    get propValues():Array<any> {
        return [];
    }

    get tipText():string {
        return null;
    }

    get type():string {
        return null;
    }

    tipTextFor(propName:string):string {
        return null;
    }

    toRecord():Record {
        return this;
    }

    toJSON() {
        return {
            id: this.id,
            properties: this.properties,
            type: TypeNames.RecordTypeName
        };
    }

    valueAtName(propName:string):any {
        return null;
    }

}

export interface NullRedirection extends Redirection {
}

export class ObjectBinaryRef extends BinaryRef {

    constructor(settings:StringDictionary) {
        super(settings);
    }

}



export class ObjectRef {

    constructor(readonly objectId:string, readonly description:string, readonly type:string) {
    }

    toString():string {
        return this.objectId + ":" + this.description;
    }

}

export class PrintMarkup extends View {

    readonly cancelButtonText:string;
    readonly commitButtonText:string;
    readonly editable:boolean;
    readonly focusPropName:string;
    readonly printMarkupXML:string;
    readonly rows:Array<Array<Cell>>;

    private _orderedCellValue:Dictionary<AttributeCellValue> = null;

    get orderedCellValues():StringDictionary {
        if (!this._orderedCellValue) {
            this._orderedCellValue = {};
            this.rows.forEach((cellRow:Array<Cell>, index)=> {
                cellRow.forEach((cell:Cell) => {
                    cell.values.forEach((cellValue:CellValue) => {
                        if (cellValue instanceof AttributeCellValue) {
                            let attributeCellValue = cellValue as AttributeCellValue;
                            this._orderedCellValue[attributeCellValue.propertyName] = attributeCellValue;
                        }
                    });
                });
            });
        };
        return this._orderedCellValue;
    }

}


/**
 * Represents a 'value' or field in a row or record. See {@link Record}
 * A Prop has a corresponding {@link PropDef} that describes the property.
 * Like an {@link Record}, a Prop may also have {@link Annotation}s (style annotations),
 * but these apply to the property only
 */
export class Property {

    /**
     * Produce an unique string that can be used for comparison purposes
     * Props considered 'equal' should produce the same identity string
     *
     * @param o
     * @param propDef
     * @returns {any}
     */
    static identity(o:any, propDef:PropertyDef):string {
        if (typeof o === 'number') {
            return String(o);
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                return String(o.getTime());
            } else if (o instanceof DateValue) {
                return String((o as DateValue).dateObj.getTime());
            } else if (o instanceof DateTimeValue) {
                return String ((o as DateTimeValue).dateObj.getTime());
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else if (o instanceof CodeRef) {
                return (o as CodeRef).code;
            } else if (o instanceof ObjectRef) {
                return (o as ObjectRef).objectId;
            } else if (o instanceof GpsReading) {
                return o.toString();
            } else if (o instanceof MapLocation) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }

    static fromJSON(jsonObject:StringDictionary):Property {
       return new Property(
           jsonObject.name,
           Property.parseValue(jsonObject.value, jsonObject.format),
           jsonObject.propertyType,
           jsonObject.format,
           jsonObject.annotations
       );
    }

    /**
     *
     * @private
     * @param _name
     * @param _value
     * @param _annotations
     */
    constructor(readonly name:string, readonly value:any, readonly propertyType?:string, readonly format?:string,
                readonly annotations:Array<DataAnnotation> = []) {
    }

    equals(prop:Property):boolean {
        return this.name === prop.name && this.value === prop.value;
    }

    get backgroundColor():string {
        return DataAnnotation.backgroundColor(this.annotations);
    }

    get foregroundColor():string {
        return DataAnnotation.foregroundColor(this.annotations);
    }

    get imageName():string {
        return DataAnnotation.imageName(this.annotations);
    }

    get imagePlacement():string {
        return DataAnnotation.imagePlacement(this.annotations);
    }

    get isBoldText():boolean {
        return DataAnnotation.isBoldText(this.annotations);
    }

    get isItalicText():boolean {
        return DataAnnotation.isItalicText(this.annotations);
    }

    get isPlacementCenter():boolean {
        return DataAnnotation.isPlacementCenter(this.annotations);
    }

    get isPlacementLeft():boolean {
        return DataAnnotation.isPlacementLeft(this.annotations);
    }

    get isPlacementRight():boolean {
        return DataAnnotation.isPlacementRight(this.annotations);
    }

    get isPlacementStretchUnder():boolean {
        return DataAnnotation.isPlacementStretchUnder(this.annotations);
    }

    get isPlacementUnder():boolean {
        return DataAnnotation.isPlacementUnder(this.annotations);
    }

    get isUnderline():boolean {
        return DataAnnotation.isUnderlineText(this.annotations);
    }

    get overrideText():string {
        return DataAnnotation.overrideText(this.annotations);
    }

    get tipText():string {
        return DataAnnotation.tipText(this.annotations);
    }

    get valueForWrite() {
        const o = this.value;
        if (typeof o === 'number') {
            return String(o);
        } else if (typeof o === 'object') {
            if (o instanceof Date) {
                //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return o.toISOString().slice(0, -1);
            } else if (o instanceof DateTimeValue) {
                //remove the 'Z' from the end of the ISO string for now, until the server supports timezones...
                return o.dateObj.toISOString().slice(0, -1);
            } else if (o instanceof DateValue) {
                //remove all Time information from the end of the ISO string from the 'T' to the end...
                const isoString = o.dateObj.toISOString();
                return isoString.slice(0, isoString.indexOf('T'));
            } else if (o instanceof TimeValue) {
                return o.toString();
            } else {
                //for any other type of value, return the object itself
                //this could include string, Array, CodeRef, ObjectRef, GpsReadingProperty, MapLocationProperty, InlineBinaryRef
                return o;
            }
        } else {
            return o;
        }
    }

    toJSON() {
        const jsonObject = {
            name: this.name,
            value: this.valueForWrite,
            type: TypeNames.PropertyTypeName
        }
        if(this.propertyType) jsonObject['propertyType'] = this.propertyType;
        if(this.format) jsonObject['format'] =  this.format;

        return jsonObject;
    }

    private static parseValue(value:any, format:string):any {

        if(typeof value === 'string' && format) {
            if (['integer', 'decimal', 'int32', 'int64', 'float', 'double'].some(v => format === v)) {
                return Number(value);
            } else if(format === 'date'){
                //parse as ISO - no offset specified by server right now, so we assume local time
                return moment(value, 'YYYY-M-D').toDate();
            } else if(format === 'date-time'){
                //parse as ISO - no offset specified by server right now, so we assume local time
                //strip invalid suffix (sometimes) provided by server
                const i = value.indexOf('T0:');
                return moment((i > -1) ? value.substring(0, i) : value).toDate();
            } else if(format === 'time'){
                TimeValue.fromString(value);
            } else {
                return value;
            }
        } else {
            return value;
        }
    }
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

    constructor(/**
                 * The canCauseSideEffects meta property indicates that writing to this property can cause LOCAL side effects
                 * (on the same business object). For example, changing a 'zipCode' property case cause the 'state' property to change. If a user interface changes a property that can cause side effects, it should refresh the associated business view.
                 */
                readonly canCauseSideEffects: boolean,

                readonly contentType: string,
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
                /**
                 * The name of a business-data value
                 */
                readonly propertyName: string,
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
                readonly writeAllowed: boolean,
                readonly writeEnabled: boolean) {
    }

    get isBarcodeType(): boolean {
        return this.semanticType === 'BARCODE';
    }

    get isBinaryType(): boolean {
        return this.isLargeBinaryType || this.isSignatureType;
    }

    get isBooleanType(): boolean {
        return this.propertyType === 'boolean';
    }

    get isCodeRefType(): boolean {
        return this.propertyType === TypeNames.CodeRefTypeName;
    }

    get isDateType(): boolean {
        return this.format === 'date';
    }

    get isDateTimeType(): boolean {
        return this.format === 'date-time';
    }

    get isDecimalType(): boolean {
        return this.format === 'decimal';
    }

    get isDoubleType(): boolean {
        return this.format === 'double';
    }

    get isEmailType(): boolean {
        return this.semanticType === 'EMAIL';
    }

    get isFileAttachment(): boolean {
        return this.semanticType === 'FILE_UPLOAD';
    }

    get isFloatType(): boolean {
        return this.format === 'float';
    }

    get isGpsReadingType(): boolean {
        return this.propertyType === TypeNames.GpsReadingPropertyTypeName;
    }

    get isMapLocationType(): boolean {
        return this.propertyType === TypeNames.MapLocationPropertyTypeName;
    }

    get isHTMLType(): boolean {
        return this.semanticType === 'DATA_HTML';
    }

    //@TODO
    get isInlineMediaStyle():boolean {
            return (this.semanticType === CellValue.STYLE_INLINE_MEDIA || this.semanticType === CellValue.STYLE_INLINE_MEDIA2);
    }

    get isListType(): boolean {
        return this.propertyType === 'array';
    }

    get isIntType(): boolean {
        return ['integer', 'int32', 'int64'].some(v=>this.propertyType === v);
    }

    get isLargeBinaryType(): boolean {
        return this.semanticType === 'LARGE_BINARY';
    }

    get isLongType(): boolean {
        return this.format === 'int64';
    }

    get isMoneyType(): boolean {
        return this.semanticType === 'MONEY';
    }

    get isNumericType(): boolean {
        return this.isDecimalType || this.isIntType || this.isDoubleType || this.isLongType || this.isFloatType;
    }

    get isObjRefType(): boolean {
        return this.propertyType === TypeNames.ObjectRefTypeName;
    }

    get isPasswordType(): boolean {
        return this.format === 'password' || this.semanticType === 'PASSWORD';
    }

    get isPercentType(): boolean {
        return this.semanticType === 'PERCENT';
    }

    get isSignatureType(): boolean {
        return this.semanticType === 'USER_SIGNATURE';
    }

    get isStringType(): boolean {
        return this.propertyType === 'string';
    }

    get isTelephoneType(): boolean {
        return this.semanticType === 'TELEPHONE';
    }

    get isTextBlock(): boolean {
        return this.semanticType === 'TEXT_BLOCK';
    }

    get isTimeType(): boolean {
        return this.format === 'time';
    }

    get isUnformattedNumericType(): boolean {
        return this.semanticType === 'UNFORMATTED';
    }

    get isURLType(): boolean {
        return this.semanticType === 'URL';
    }
}


/**
 * ************* Property Formatting ********************
 */

/**
 * Helper for transforming values to and from formats suitable for reading and writing to the server
 * (i.e. object to string and string to object)
 */
class PrivatePropFormats {
    static decimalFormat: string[] = ["0,0", "0,0.0", "0,0.00", "0,0.000", "0,0.0000", "0,0.00000", "0,0.000000", "0,0.0000000", "0,0.00000000", "0,0.000000000", "0,0.0000000000"];
    static decimalFormatGeneric:string = "0,0.[0000000000000000000000000]";
    static moneyFormat: string[] = ["$0,0", "$0,0.0", "$0,0.00", "$0,0.000", "$0,0.0000", "$0,0.00000", "$0,0.000000", "$0,0.0000000", "$0,0.00000000", "$0,0.000000000", "$0,0.0000000000"];
    static moneyFormatGeneric:string = "$0,0.[0000000000000000000000000]";
    static percentFormat: string[] = ["0,0%", "0,0%", "0,0%", "0,0.0%", "0,0.00%", "0,0.000%", "0,0.0000%", "0,0.00000%", "0,0.000000%", "0,0.0000000%", "0,0.00000000%"];
    static percentFormatGeneric:string = "0,0.[0000000000000000000000000]%";
    static wholeFormat:string = "0,0";
}

export class PropFormatter {
    // For numeral format options, see: http://numeraljs.com/

    // Default format for money at varying decimal lengths.
    static decimalFormat: string[] = PrivatePropFormats.decimalFormat.slice(0);
    static decimalFormatGeneric: string = PrivatePropFormats.decimalFormatGeneric;
    static moneyFormat: string[] = PrivatePropFormats.moneyFormat.slice(0);
    static moneyFormatGeneric: string = PrivatePropFormats.moneyFormatGeneric;
    static percentFormat: string[] = PrivatePropFormats.percentFormat.slice(0);
    static percentFormatGeneric: string = PrivatePropFormats.decimalFormatGeneric;
    static wholeFormat: string = PrivatePropFormats.wholeFormat;

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForRead(prop: Property, propDef: PropertyDef): string {
        if (prop === null || prop === undefined) {
            return '';
        } else {
            return PropFormatter.formatValueForRead(prop.value, propDef);
        }
    }

    static formatValueForRead(value: any, propDef: PropertyDef) {
        let lang: string = null;
        // The locale from the browser is not reliable.  The Extender server pulls the browser's locale from the
        // agent string at logon time.  Use that with a fallback approach to find the best fit locale.
        // var localeTest = window.navigator.userLanguage || window.navigator.language;
        if (Catavolt.singleton.browserLocaleJson) {
            let browserLocale = JSON.parse(Catavolt.singleton.browserLocaleJson);  // country/language/varient
            if (browserLocale.country) {
                let key = browserLocale.language + "-" + browserLocale.country.toLowerCase();
                if (moment().lang(key)) {
                    lang = key;
                }
            }
            if (!lang) {
                let x = moment().lang(browserLocale.language);
                if (moment().lang(browserLocale.language)) {
                    lang = browserLocale.language;
                }
            }
            if (!lang) {
                lang = "en";
            }
        }
        // let test = (moment as any).locales();
        if (value === null || value === undefined) {
            return '';
        } else if ((propDef && propDef.isCodeRefType) || value instanceof CodeRef) {
            return (value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || value instanceof ObjectRef) {
            return (value as ObjectRef).description;
        } else if ((propDef && propDef.isDateTimeType)) {
            if (!lang) {
                return (value as Date).toString();
            } else {
                return moment(value as Date).locale(lang).format("lll");
                // return moment(value as Date).format("lll");
            }
        } else if ((propDef && propDef.isDateType) || value instanceof Date) {
            if (!lang) {
                return (value as Date).toLocaleDateString();
            } else {
                return moment(value as Date).locale(lang).format("L");
                // return moment(value as Date).format("L");
            }
        } else if ((propDef && propDef.isTimeType) || value instanceof TimeValue) {
            if (!lang) {
                return moment(value as TimeValue).format("LT");
            } else {
                return moment(value as TimeValue).locale(lang).format("LT");
                // return moment(value as TimeValue).format("LT");
            }
        } else if ((propDef && propDef.isPasswordType)) {
            return (value as string).replace(/./g, "*");
        } else if ((propDef && propDef.isListType) || Array.isArray(value)) {
            return value.reduce((prev, current) => {
                return ((prev ? prev + ', ' : '') + PropFormatter.formatValueForRead(current, null));
            }, '');
        } else {
            return PropFormatter.toString(value, propDef);
        }
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param prop
     * @param propDef
     * @returns {string}
     */
    static formatForWrite(prop: Property, propDef: PropertyDef): string {
        if (prop === null || prop === undefined
            || prop.value === null || prop.value === undefined) {
            return null;
        } else if ((propDef && propDef.isCodeRefType) || prop.value instanceof CodeRef) {
            return (prop.value as CodeRef).description;
        } else if ((propDef && propDef.isObjRefType) || prop.value instanceof ObjectRef) {
            return (prop.value as ObjectRef).description;
        } else {
            return PropFormatter.toStringWrite(prop.value, propDef);
        }
    }

    /**
     * Attempt to construct (or preserve) the appropriate data type given primitive (or already constructed) value.
     * @param value
     * @param propDef
     * @returns {any}
     */
    static parse(value: any, propDef: PropertyDef) {

        var propValue: any = value;
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
            if (value instanceof DateValue) {
                propValue = value;
            } else if (typeof value === 'object') {
                propValue = new DateValue(value);
            } else {
                //parse as local time
                propValue = new DateValue(moment(value).toDate());
            }
        } else if (propDef.isDateTimeType) {
            //this could be a DateTimeValue, a Date, or a string
            if (value instanceof DateTimeValue) {
                propValue = value;
            } else if (typeof value === 'object') {
                propValue = new DateTimeValue(value);
            } else {
                //parse as local time
                propValue = new DateTimeValue(moment(value).toDate());
            }
        } else if (propDef.isTimeType) {
            propValue = value instanceof TimeValue ? value : TimeValue.fromString(value);
        }
        return propValue;
    }

    static resetFormats(): void {
        PropFormatter.decimalFormat = PrivatePropFormats.decimalFormat.slice(0);
        PropFormatter.decimalFormatGeneric = PrivatePropFormats.decimalFormatGeneric;
        PropFormatter.moneyFormat = PrivatePropFormats.moneyFormat.slice(0);
        PropFormatter.moneyFormatGeneric = PrivatePropFormats.moneyFormatGeneric;
        PropFormatter.percentFormat = PrivatePropFormats.percentFormat.slice(0);
        PropFormatter.percentFormatGeneric = PrivatePropFormats.decimalFormatGeneric;
        PropFormatter.wholeFormat = PrivatePropFormats.wholeFormat;
    }

    static toString(o: any, propDef: PropertyDef): string {
        return PropFormatter.toStringRead(o, propDef);
    }

    /**
     * Render this value as a string
     * @param o
     * @param propDef
     * @returns {any}
     */
    static toStringRead(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number') {
            if (propDef && propDef.semanticType !== "DATA_UNFORMATTED_NUMBER") {
                if (propDef.isMoneyType) {
                    let f = propDef.displayScale < this.moneyFormat.length ? this.moneyFormat[propDef.displayScale] : this.moneyFormatGeneric;
                    // If there is a currency symbol, remove it noting it's position pre/post
                    // Necesary because numeral will replace $ with the symbol based on the locale of the browser.
                    // This may be desired down the road, but for now, the server provides the symbol to use.
                    let atStart: boolean = f.length > 0 && f[0] === '$';
                    let atEnd: boolean = f.length > 0 && f[f.length - 1] === '$';
                    if (Catavolt.singleton.currencySymbol) {
                        f = f.replace("$", "");               // Format this as a number, and slam in Extender currency symbol
                        var formatted = numeral(o).format(f);
                        if (atStart) formatted = Catavolt.singleton.currencySymbol + formatted;
                        if (atEnd) formatted = formatted + Catavolt.singleton.currencySymbol;
                    } else {
                        formatted = numeral(o).format(f);  // Should substitute browsers locale currency symbol
                    }
                    return formatted;
                } else if (propDef.isPercentType) {
                    let f = propDef.displayScale < this.percentFormat.length ? this.percentFormat[propDef.displayScale] : this.percentFormatGeneric;
                    return numeral(o).format(f);  // numeral accomplishs * 100, relevant if we use some other symbol
                } else if (propDef.isIntType || propDef.isLongType) {
                    return numeral(o).format(this.wholeFormat);
                } else if (propDef.isDecimalType || propDef.isDoubleType) {
                    let f = propDef.displayScale < this.decimalFormat.length ? this.decimalFormat[propDef.displayScale] : this.decimalFormatGeneric;
                    return numeral(o).format(f);
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
            } else if (o instanceof GpsReadingProperty) {
                return o.toString();
            } else if (o instanceof MapLocationProperty) {
                return o.toString();
            } else {
                return String(o);
            }
        } else {
            return String(o);
        }
    }

    static toStringWrite(o: any, propDef: PropertyDef): string {
        if (typeof o === 'number' && propDef) {
            let s = numeral(100);
            if (propDef.isMoneyType) {
                return o.toFixed(2);
            } else if (propDef.isIntType || propDef.isLongType) {
                return o.toFixed(0);
            } else if (propDef.isDecimalType || propDef.isDoubleType) {
                return o.toFixed(Math.max(2, (o.toString().split('.')[1] || []).length));
            }
        } else {
            return PropFormatter.toStringRead(o, propDef);
        }
    }
}

export interface QueryParameters {

    fetchDirection:QueryDirection;
    fetchMaxRecords:number;
    fromBusinessId?:string;
    type:string;

}

export interface Record {

    readonly annotations?:Array<DataAnnotation>;
    readonly id: string;
    properties:Array<Property>;
    type:string;

    annotationsAtName(propName:string):Array<DataAnnotation>;

    afterEffects(after:Record):Record;

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

    overrideText:string;
    overrideTextFor(propName:string):string;

    propAtIndex(index:number):Property;

    propAtName(propName:string):Property;

    propCount:number;

    propNames:Array<string>;

    propValues:Array<any>;

    tipText:string;
    tipTextFor(propName:string):string;

    toJSON();

    valueAtName(propName:string):any;


}

/**
 * In the same way that a {@link PropertyDef} describes a {@link Property}, a RecordDef describes an {@link Record}.
 * It is composed of {@link PropertyDef}s while the {@link Record} is composed of {@link Property}s.
 * In other words it describes the structure or makeup of a row or record, but does not contain the data values themselves.
 * The corresponding {@link Record} contains the actual values.
 */
export class RecordDef {

    readonly propertyDefs:Array<PropertyDef>;

    get propCount():number {
        return this.propertyDefs.length;
    }

    propDefAtName(name:string):PropertyDef {
        var propDef:PropertyDef = null;
        this.propertyDefs.some((p)=> {
            if (p.propertyName === name) {
                propDef = p;
                return true;
            }
            return false;
        });
        return propDef;
    }

    get propNames():Array<string> {
        return this.propertyDefs.map((p)=> {
            return p.propertyName;
        });
    }
}

export interface RecordSet{

    defaultActionId:string;
    hasMore:boolean;
    records:Array<Record>;

}

export interface Redirection {

    readonly id:string;
    readonly referringObject:ReferringObject;
    readonly sessionId: string;
    readonly tenantId: string;
    readonly type:RedirectionType;

}

export class RedirectionUtil {

    static isRedirection(o:any):boolean {

        return [ TypeNames.DialogRedirectionTypeName,
            TypeNames.NullRedirectionTypeName,
            TypeNames.WebRedirectionTypeName,
            TypeNames.WorkbenchRedirectionTypeName
        ].some(n => n === o['type']);
    }

    static isDialogRedirection(o:any):boolean {
        return o['type'] === TypeNames.DialogRedirectionTypeName;
    }

    static isNullRedirection(o:any):boolean {
        return o['type'] === TypeNames.NullRedirectionTypeName;
    }

    static isWebRedirection(o:any):boolean {
        return o['type'] === TypeNames.WebRedirectionTypeName;
    }

    static isWorkbenchRedirection(o:any):boolean {
        return o['type'] === TypeNames.WorkbenchRedirectionTypeName;
    }

}

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

    readonly type:string;

    readonly userId:string;

}

export interface Sort {

    readonly propertyName: string;
    readonly direction: SortDirection;

}

export class Stream extends View {

    readonly topic: string;
    readonly bufferSize: number;
    readonly view: View;

}

/**
 * A text template containing substitution parameters that is instantiated at presentation time and filled with business values.
 */
export class SubstitutionCellValue extends CellValue {

    constructor(style, readonly value:string) {
        super(style);
    }

}

/**
 * A purely declarative type. This object has no additional properties.
 */
export class TabCellValue extends CellValue {

    constructor(style) {
        super(style);
    }

}


export interface Tenant {

    readonly id:string;
    readonly description:string;

}

export class UserMessage {

    constructor(public message:string,
                public messageType:string,
                public explanation:string,
                public propertyNames:Array<string>) {
    }
}



export class ViewDescriptor {

    constructor(readonly id:string, readonly name:string, readonly title:string){}

}

export interface Workbench {

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
    readonly actionId?:string;
    readonly alias:string;
    readonly id:string;
    readonly iconBase:string;
    readonly name:string;
    readonly workbenchId:string;

}

export interface NullRedirection extends Redirection {
}

export interface WebRedirection extends Redirection {

    readonly url:string;

}

export interface WorkbenchRedirection extends Redirection {

    readonly workbenchId:string;

}


/*
    ***************************************************************************
    Begin Dialog classes implementation
    ***************************************************************************
 */

/**
 * Top-level class, representing a Catavolt 'Dialog' definition.
 * All Dialogs have a composite {@link View} definition along with a single record
 * or a list of records.  See {@Record}
 */
export abstract class Dialog {

    //statics
    static BINARY_CHUNK_SIZE = 256 * 1024; //size in  byes for 'read' operation
    private static CHAR_CHUNK_SIZE = 128 * 1000; //size in chars for encoded 'write' operation

    //private/protected
    private _binaryCache:{ [index:string]:Array<Binary> } = {};
    private _lastRefreshTime:Date = new Date(0);
    private _catavolt:Catavolt;
    protected _parentDialog;

    readonly availableViews:Array<ViewDescriptor>;
    readonly businessClassName:string;
    readonly children: Array<Dialog> = [];
    readonly description:string;
    readonly dialogClassName:string;
    dialogMode:DialogMode;
    readonly header:View;
    readonly id:string;
    readonly recordDef: RecordDef;
    readonly referringObject:ReferringObject;
    readonly selectedViewId:string;
    readonly sessionId:string;
    readonly tenantId: string;
    readonly type:DialogType;
    readonly view: View;
    readonly viewMode: ViewMode;

    /* public methods */

    get catavolt():Catavolt {
        return this._catavolt;
    }

    /**
     * Load a Binary property from a record
     * @param propName
     * @param record
     * @returns {any}
     */
    binaryAt(propName:string, record:Record):Promise<Binary> {

        const prop: Property = record.propAtName(propName)
        if (prop) {
            if (prop.value instanceof InlineBinaryRef) {
                const binRef = prop.value as InlineBinaryRef;
                return Promise.resolve(new EncodedBinary(binRef.inlineData, binRef.settings['mime-type']));
            } else if (prop.value instanceof ObjectBinaryRef) {
                const binRef = prop.value as ObjectBinaryRef;
                if (binRef.settings['webURL']) {
                    return Promise.resolve(new UrlBinary(binRef.settings['webURL']));
                } else {
                    return this.readBinary(propName, record);
                }
            } else if (typeof prop.value === 'string') {
                return Promise.resolve(new UrlBinary(prop.value));
            } else if (prop.value instanceof EncodedBinary) {
                return Promise.resolve(prop.value);

            } else {
                return Promise.reject('No binary found at ' + propName);
            }
        } else {
            return Promise.reject('No binary found at ' + propName);
        }
    }

    destroy(){
        //@TODO
        //destroy this dialog
    }

    /**
     * Return the error associated with this dialog, if any
     * @returns {any}
     */
    get error():DialogException {
        if(this.hasError) {
            return (this.view as ErrorMessage).exception;
        } else {
            return null;
        }
    }


    /**
     * Find a menu def on this dialog with the given actionId
     * @param actionId
     * @returns {Menu}
     */
    findMenuAt(actionId:string) {
        return this.view.findMenuAt(actionId);
    }

    /**
     * Get a string representation of this property suitable for 'reading'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForRead(prop:Property, propName:string):string {
        return PropFormatter.formatForRead(prop, this.propDefAtName(propName));
    }

    /**
     * Get a string representation of this property suitable for 'writing'
     * @param propValue
     * @param propName
     * @returns {string}
     */
    formatForWrite(prop:Property, propName:string):string {
        return PropFormatter.formatForWrite(prop, this.propDefAtName(propName));
    }

    /**
     * Returns whether or not this dialog loaded properly
     * @returns {boolean}
     */
    get hasError():boolean {
        return this.view instanceof ErrorMessage;
    }

    /**
     * Returns whether or not this Form is destroyed
     * @returns {boolean}
     */
    get isDestroyed():boolean {
        return this.dialogMode === DialogModeEnum.DESTROYED || this.isAnyChildDestroyed;
    }

    /**
     * Returns whether or not the data in this dialog is out of date
     * @returns {boolean}
     */
    get isRefreshNeeded():boolean {
        return this._lastRefreshTime.getTime() < this.catavolt.dataLastChangedTime.getTime();
    }

    /**
     * Get the last time this dialog's data was refreshed
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
     * Get the all {@link Menu}'s associated with this dialog
     * @returns {Array<Menu>}
     */
    get menu():Menu {
        return this.view.menu;
    }

    openView(targetViewDescriptor:ViewDescriptor): Promise<Dialog>{

        return this.catavolt.dialogApi.changeView(this.tenantId, this.sessionId, this.id, targetViewDescriptor.id)
            .then((dialog:Dialog)=>{
                //any new dialog needs to be initialized with the Catavolt object
                dialog.initialize(this.catavolt);
                this.updateSettingsWithNewDialogProperties(dialog.referringObject);
                return dialog;
            });

    };


    /**
     * Get the title of this dialog
     * @returns {string}
     */
    get paneTitle():string {
        let title = this.view.findTitle();
        if (!title) title = this.description;
        return title;
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
    propDefAtName(propName:string):PropertyDef {
        return this.recordDef.propDefAtName(propName);
    }


    /**
     * Read all the Binary values in this {@link Record}
     * @param record
     * @returns {Future<Array<Try<Binary>>>}
     */
    readBinaries(record:Record):Promise<Array<Binary>> {
        return Promise.all(
            this.recordDef.propertyDefs.filter((propDef: PropertyDef) => {
                return propDef.isBinaryType
            }).map((propDef: PropertyDef) => {
                return this.readBinary(propDef.propertyName, record);
            })
        );
    }

    get parentDialog():Dialog {
        return this._parentDialog;
    }

    /**
     * Get the all {@link ViewDescriptor}'s associated with this Form
     * @returns {Array<ViewDescriptor>}
     */
    get viewDescs():Array<ViewDescriptor> {
        return this.availableViews;
    }

    /* @TODO */
    writeAttachment(attachment:Attachment):Promise<void> {
        /*
       return DialogService.addAttachment(this.dialogRedirection.dialogHandle, attachment, this.session);
       */
        return Promise.resolve(null);
    }

    writeAttachments(record:Record):Promise<Array<void>> {

        return Promise.all(
            record.properties.filter((prop: Property) => {
                return prop.value instanceof Attachment;
            }).map((prop: Property) => {
                const attachment: Attachment = prop.value as Attachment;
                return this.writeAttachment(attachment);
            })
        );

    }


    /**
     * Write all Binary values in this {@link Record} back to the server
     * @param record
     * @returns {Future<Array<Try<XWritePropertyResult>>>}
     */
    /* @TODO */
    writeBinaries(record:Record):Promise<Array<void>> {
        /*return Promise.all(
            record.properties.filter((prop: Property) => {
                return this.propDefAtName(prop.name).isBinaryType;
            }).map((prop: Property) => {
                let writePromise:Promise<XWritePropertyResult> = Promise.resolve({} as XWritePropertyResult);
                if (prop.value) {
                    let ptr: number = 0;
                    const encBin: EncodedBinary = prop.value as EncodedBinary;
                    const data = encBin.data;
                    while (ptr < data.length) {
                        const boundPtr = (ptr: number) => {
                            writePromise = writePromise.then((prevResult) => {
                                const encSegment: string = (ptr + Dialog.CHAR_CHUNK_SIZE) <= data.length ? data.substr(ptr, Dialog.CHAR_CHUNK_SIZE) : data.substring(ptr);
                                return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, encSegment, ptr != 0, this.session);
                            });
                        }
                        boundPtr(ptr);
                        ptr += Dialog.CHAR_CHUNK_SIZE;
                    }
                } else {
                    // This is a delete
                    writePromise = writePromise.then((prevResult) => {
                        return DialogService.writeProperty(this.paneDef.dialogRedirection.dialogHandle, prop.name, null, false, this.sessionContext);
                    });
                }
                return writePromise;
            })
        );*/

        return Promise.resolve(null);
    }

    initialize(catavolt:Catavolt) {
        this._catavolt = catavolt;
        if(this.children) {
            this.children.forEach((child: Dialog) => {
                child._parentDialog = this;
                child.initialize(catavolt);
            });
        }
    }

    /**
     * Perform this action associated with the given Menu on this dialog.
     * The targets array is expected to be an array of object ids.
     * @param {Menu} menu
     * @param {ActionParameters} actionParams
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    protected invokeMenuAction(menu:Menu, actionParams:ActionParameters):Promise<{actionId:string} | Redirection> {

        return this.catavolt.dialogApi.performAction(this.catavolt.session.tenantId, this.catavolt.session.id,
            this.id, menu.actionId, actionParams).then((result:{actionId:string} | Redirection)=>{

            if(RedirectionUtil.isRedirection(result)) {

                //@TODO - update relevant referring dialog settings on 'this' dialog
                this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);

                //@TODO -use 'isLocalRefreshNeeded' instead of this - needs to be added to the Dialog API
                if((result as Redirection).referringObject && (result as Redirection).referringObject['dialogProperties']){
                    const dialogProps = (result as Redirection).referringObject['dialogProperties'];
                    if((dialogProps['localRefresh'] && dialogProps['localRefresh'] === 'true' ||
                            dialogProps['globalRefresh'] && dialogProps['globalRefresh'] === 'true')) {
                        this.catavolt.dataLastChangedTime = new Date();
                    }
                    //@TODO - also, this check should go away - we will rely on 'isLocalRefreshNeeded' exclusively
                } else if(RedirectionUtil.isNullRedirection(result)) {
                    this.catavolt.dataLastChangedTime = new Date();
                }
            } else {
                this.catavolt.dataLastChangedTime = new Date();
            }
            return result;
        });
    }

    //@TODO
    protected readBinary(propName:string, record:Record):Promise<Binary> {

        /*
        let seq: number = 0;
        let encodedResult: string = '';
        let inProgress: string = '';
        let f: (XReadPropertyResult) => Promise<Binary> = (result: XReadPropertyResult) => {
            if (result.hasMore) {
                inProgress += atob(result.data);  // If data is in multiple loads, it must be decoded/built/encoded
                return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
                    propName, ++seq, Dialog.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            } else {
                if (inProgress) {
                    inProgress += atob(result.data);
                    encodedResult = btoa(inProgress);
                } else {
                    encodedResult = result.data;
                }
                return Promise.resolve<Binary>(new EncodedBinary(encodedResult));
            }
        }
        return DialogService.readEditorProperty(this.paneDef.dialogRedirection.dialogHandle,
            propName, seq, Dialog.BINARY_CHUNK_SIZE, this.sessionContext).bind(f);
            */
        return Promise.resolve(null);
    };


    protected updateSettingsWithNewDialogProperties(referringObject:ReferringObject) {

        if(referringObject) {
            if (referringObject.isDialogReferrer()) {
                //@TODO - remove the uppercase conversion once all DialogModes come back from server as uppercase
                this.dialogMode = (referringObject as ReferringDialog).dialogMode.toUpperCase() as DialogMode;
            }
        }

    }

    /**
     * @private
     * @returns {boolean}
     */
    private get isAnyChildDestroyed():boolean {
        return this.children && this.children.some((dialog:Dialog)=> {
            return dialog.isDestroyed;
        });
    }

}

/**
 * PanContext Subtype that represents an 'Editor Dialog'.
 * An 'Editor' represents and is backed by a single Record and Record definition.
 * See {@link Record} and {@link RecordDef}.
 */
export class EditorDialog extends Dialog {

    private _buffer:RecordBuffer;
    private _isFirstReadComplete:boolean;

    readonly businessId: string;

    /**
     * Get the current buffered record
     * @returns {RecordBuffer}
     */
    get buffer():RecordBuffer {
        if (!this._buffer) {
            this._buffer = new RecordBuffer(NullRecord.singleton);
        }
        return this._buffer;
    }

    changeViewMode(viewMode:ViewMode):Promise<EditorDialog> {

        return this.catavolt.dialogApi.changeMode(this.tenantId, this.sessionId, this.id, viewMode)
            .then((dialog:EditorDialog)=>{
                //any new dialog needs to be initialized with the Catavolt object
                dialog.initialize(this.catavolt);
                this.updateSettingsWithNewDialogProperties(dialog.referringObject);
                return dialog;
            });
    }

    /**
     * Get the associated entity record
     * @returns {Record}
     */
    get record():Record {
        return this._buffer.toRecord();
    }

    /**
     * Get the current version of the entity record, with any pending changes present
     * @returns {Record}
     */
    get recordNow():Record {
        return this.record;
    }

    /**
     * Get the possible values for a 'constrained value' property
     * @param propName
     * @returns {Future<Array<any>>}
     */
    //@TODO
    getAvailableValues(propName:string):Promise<Array<Object>> {
        /*
         return DialogService.getAvailableValues(this.paneDef.dialogHandle, propName,
         this.buffer.afterEffects(), this.sessionContext).map((valuesResult:XGetAvailableValuesResult)=> {
         return valuesResult.list;
         });
         */
        return Promise.resolve(null);

    }

    /**
     * Returns whether or not this cell definition contains a binary value
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isBinary(cellValue:AttributeCellValue):boolean {
        var propDef = this.propDefAtName(cellValue.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && cellValue.isInlineMediaStyle));
    }

    /**
     * Returns whether or not the buffers contain valid data via a successful read operation.
     * @returns {boolean}
     */
    get isFirstReadComplete():boolean {
        return this._isFirstReadComplete;
    }

    /**
     * Returns whether or not this Editor is in 'read' mode
     * @returns {boolean}
     */
    get isReadMode():boolean {
        return this.viewMode === ViewModeEnum.READ;
    }

    /**
     * Returns whether or not this property is read-only
     * @param propName
     * @returns {boolean}
     */
    isReadModeFor(propName:string):boolean {
        if (!this.isReadMode) {
            var propDef = this.propDefAtName(propName);
            return !propDef || !propDef.writeAllowed || !propDef.writeEnabled;
        }
        return true;
    }

    /**
     * Returns whether or not this cell definition contains a binary value that should be treated as a signature control
     * @param cellValueDef
     * @returns {PropDef|boolean}
     */
    isSignature(cellValueDef:AttributeCellValue):boolean {
        var propDef = this.propDefAtName(cellValueDef.propertyName);
        return this.isBinary(cellValueDef) && propDef.isSignatureType;
    }

    /**
     * Returns whether or not this property is 'writable'
     * @returns {boolean}
     */
    get isWriteMode():boolean {
        return this.viewMode === ViewModeEnum.WRITE;
    }

    /**
     * Perform the action associated with the given Menu on this EditorDialog
     * Given that the Editor could possibly be destroyed as a result of this action,
     * any provided pending writes will be saved if present.
     * @param {Menu} menu
     * @param {Record} pendingWrites
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    performMenuAction(menu:Menu, pendingWrites:Record):Promise<{actionId:string} | Redirection> {

        return this.invokeMenuAction(menu, {pendingWrites:pendingWrites, type:TypeNames.ActionParametersTypeName}).then(result=>{
            return result;
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
    //@TODO
    processSideEffects(propertyName:string, value:any):Promise<void> {

        /*
         var sideEffectsFr:Future<Record> = DialogService.processSideEffects(this.paneDef.dialogHandle,
         this.sessionContext, propertyName, value, this.buffer.afterEffects()).map((changeResult:XPropertyChangeResult)=> {
         return changeResult.sideEffects ? changeResult.sideEffects.record : new NullRecord();
         });

         return sideEffectsFr.map((sideEffectsRec:Record)=> {
         var originalProps = this.buffer.before.props;
         var userEffects = this.buffer.afterEffects().props;
         var sideEffects = sideEffectsRec.props;
         sideEffects = sideEffects.filter((prop:Prop)=> {
         return prop.name !== propertyName;
         });
         this._buffer = RecordBuffer.createRecordBuffer(this.buffer.objectId,
         RecordUtil.union(originalProps, sideEffects),
         RecordUtil.union(originalProps, RecordUtil.union(userEffects, sideEffects)));
         return null;
         });
         */
        return Promise.resolve(null);
    }

    /**
     * Read (load) the {@link Record} assocated with this Editor
     * The record must be read at least once to initialize the Context
     * @returns {Future<Record>}
     */
    read():Promise<Record> {

        return this.catavolt.dialogApi.getRecord(this.tenantId, this.sessionId, this.id)
            .then((record:Record)=>{
                this._isFirstReadComplete = true;
                this.initBuffer(record);
                this.lastRefreshTime = new Date();
                return record;
            });
    }


    /**
     * Set the value of a property in this {@link Record}.
     * Values may be already constructed target types (CodeRef, TimeValue, Date, etc.)
     * or primitives, in which case the values will be parsed and objects constructed as necessary.
     * @param name
     * @param value
     * @returns {any}
     */
    setPropValue(name:string, value:any):any {
        const propDef:PropertyDef = this.propDefAtName(name);
        let parsedValue:any = null;
        if (propDef) {
            parsedValue = (value !== null && value !== undefined) ? this.parseValue(value, propDef.propertyName) : null;
            this.buffer.setValue(propDef.propertyName, parsedValue);
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
        if (dataUrl) {
            const urlObj: DataUrl = new DataUrl(dataUrl);
            this.setBinaryPropWithEncodedData(name, urlObj.data, urlObj.mimeType);
        } else {
            this.setPropValue(name, null);  // Property is being deleted/cleared
        }
    }

    /**
     * Set a binary property with base64 encoded data
     * @param name
     * @param encodedData
     * @param mimeType
     */
    setBinaryPropWithEncodedData(name:string, encodedData:string, mimeType:string) {
        const propDef:PropertyDef = this.propDefAtName(name);
        if (propDef) {
            const value = new EncodedBinary(encodedData, mimeType);
            this.buffer.setValue(propDef.propertyName, value);
        }
    }

    /**
     * Write this record (i.e. {@link Record}} back to the server
     * @returns {Promise<Record | Redirection>}
     */
    write():Promise<Record | Redirection> {

        let deltaRec: Record = this.buffer.afterEffects();

        /* Write the 'special' props first */
        return this.writeBinaries(deltaRec).then((binResult:Array<void>) => {
            return this.writeAttachments(deltaRec).then((atResult:Array<void>) => {
                /* Remove special property types before writing the actual record */
                deltaRec = this.removeSpecialProps(deltaRec);
                return this.catavolt.dialogApi.putRecord(this.tenantId, this.sessionId, this.id, deltaRec)
                    .then((result:Record | Redirection)=>{
                        const now = new Date();
                        this.catavolt.dataLastChangedTime = now;
                        this.lastRefreshTime = now;
                        if(RedirectionUtil.isRedirection(result)) {
                            this.updateSettingsWithNewDialogProperties((result as Redirection).referringObject);
                        } else {
                            this.initBuffer(result as Record);
                        }
                        return result as Record | Redirection;
                });
            });
        });

    }

    //Module level methods

    //Private methods

    /*
        @TODO
        Consider clone and deep copy here, to avoid potential ui side-effects
     */
    private removeSpecialProps(record:Record):Record {
        record.properties = record.properties.filter((prop:Property)=>{
            /* Remove the Binary(s) as they have been written seperately */
            return !this.propDefAtName(prop.name).isBinaryType;
        }).map((prop:Property)=>{
            /*
             Remove the Attachment(s) (as they have been written seperately) but replace
             the property value with the file name of the attachment prior to writing
             */
            if(prop.value instanceof Attachment) {
                const attachment = prop.value as Attachment;
                return new Property(prop.name, attachment.name, prop.propertyType, prop.format, prop.annotations);
            } else {
                return prop;
            }
        });
        return record;
    }

    private initBuffer(record:Record) {
        this._buffer = record ? new RecordBuffer(record) : new RecordBuffer(NullRecord.singleton);
    }

}


/**
 * Dialog Subtype that represents a 'Query Dialog'.
 * A 'Query' represents and is backed by a list of Records and a single Record definition.
 * See {@link Record} and {@link RecordDef}.
 */
export class QueryDialog extends Dialog {

    private _scroller: QueryScroller;
    private _defaultActionId: string;

    positionalQueryAbility:PositionalQueryAbilityType;
    supportsColumnStatistics:boolean;
    supportsPositionalQueries:boolean;

    /**
     * Returns whether or not a column is of a binary type
     * @param columnDef
     * @returns {PropDef|boolean}
     */
    isBinary(column: Column): boolean {
        var propDef = this.propDefAtName(column.propertyName);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && propDef.isInlineMediaStyle));
    }

    get defaultActionId(): string {
        return this._defaultActionId;
    }

    /**
     * Perform this action associated with the given Menu on this dialog.
     * The targets array is expected to be an array of object ids.
     * @param {Menu} menu
     * @param {Array<string>} targets
     * @returns {Promise<{actionId: string} | Redirection>}
     */
    performMenuAction(menu: Menu, targets: Array<string>): Promise<{ actionId: string } | Redirection> {

        return this.invokeMenuAction(menu, {
            targets: targets,
            type: TypeNames.ActionParametersTypeName
        }).then(result => {
            return result;
        });

    }

    /**
     * Perform a query
     * Note: {@link QueryScroller} is the preferred way to perform a query.
     * see {@link QueryContext.newScroller} and {@link QueryContext.setScroller}
     * @param maxRows
     * @param direction
     * @param fromObjectId
     * @returns {Future<RecordSet>}
     */
    query(maxRows: number, direction: QueryDirection, fromObjectId: string): Promise<RecordSet> {

        const queryParams: QueryParameters = fromObjectId ?
            {
                fetchDirection: direction,
                fetchMaxRecords: maxRows,
                fromBusinessId: fromObjectId,
                type: TypeNames.QueryParametersTypeName
            } :
            {fetchDirection: direction, fetchMaxRecords: maxRows, type: TypeNames.QueryParametersTypeName};

        return this.catavolt.dialogApi.getRecords(this.catavolt.session.tenantId, this.catavolt.session.id, this.id, queryParams)
            .then((recordSet: RecordSet) => {
                this.lastRefreshTime = new Date();
                this._defaultActionId = recordSet.defaultActionId;
                return recordSet;
            });

    }

    /**
     * Clear the QueryScroller's buffer and perform this query
     * @returns {Future<Array<Record>>}
     */
    refresh(): Promise<Array<Record>> {
        return this._scroller.refresh();
    }

    /**
     * Get the associated QueryScroller
     * @returns {QueryScroller}
     */
    get scroller(): QueryScroller {
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
    setScroller(pageSize: number, firstObjectId: string, markerOptions: Array<QueryMarkerOption>) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    }

    /**
     * Creates a new QueryScroller with default buffer size of 50
     * @returns {QueryScroller}
     */
    newScroller(): QueryScroller {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    }

    //protected

}

/**
 * *********************************
 */


export class HasMoreQueryMarker extends NullRecord {
    static singleton = new HasMoreQueryMarker();
}

export class IsEmptyQueryMarker extends NullRecord {
    static singleton = new IsEmptyQueryMarker();
}

export enum QueryMarkerOption {
    None, IsEmpty, HasMore
}

export class QueryScroller {

    private _buffer:Array<Record>;
    private _hasMoreBackward:boolean;
    private _hasMoreForward:boolean;
    private _nextPagePromise:Promise<RecordSet>;
    private _prevPagePromise:Promise<RecordSet>;
    private _firstResultOid:string;

    constructor(private _dialog:QueryDialog,
                private _pageSize:number,
                private _firstObjectId:string,
                private _markerOptions:Array<QueryMarkerOption> = []) {

        this.clear();

    }

    get buffer():Array<Record> {
        return this._buffer;
    }

    get bufferWithMarkers():Array<Record> {
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

    get dialog():QueryDialog {
        return this._dialog;
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

    pageBackward():Promise<Array<Record>> {

        if (!this._hasMoreBackward) {
            return Promise.resolve([]);
        }

        if (this._prevPagePromise) {
            this._prevPagePromise = this._prevPagePromise.then((recordSet: RecordSet) => {
                const fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].id;
                return this._dialog.query(this._pageSize, QueryDirectionEnum.BACKWARD, fromObjectId);
            });
        } else {
            const fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].id;
            this._prevPagePromise = this._dialog.query(this._pageSize, QueryDirectionEnum.BACKWARD, fromObjectId);
        }

        const beforeSize: number = this._buffer.length;

        return this._prevPagePromise.then((queryResult: RecordSet) => {
            let afterSize = beforeSize;
            this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.records.length > 0) {
                const newBuffer: Array<Record> = [];
                for (let i = queryResult.records.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.records[i]);
                }
                this._buffer.forEach((record: Record) => {
                    newBuffer.push(record)
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.records;
        });

    }

    pageForward():Promise<Array<Record>> {

        if (!this._hasMoreForward) {
            return Promise.resolve([]);
        }

        if(this._nextPagePromise) {
            this._nextPagePromise = this._nextPagePromise.then((recordSet:RecordSet)=>{
                const fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].id;
                return this._dialog.query(this._pageSize, QueryDirectionEnum.FORWARD, fromObjectId);
            });
        } else {
            const fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].id;
            this._nextPagePromise = this._dialog.query(this._pageSize, QueryDirectionEnum.FORWARD, fromObjectId);
        }

        const beforeSize: number = this._buffer.length;

        return this._nextPagePromise.then((queryResult: RecordSet) => {
            let afterSize = beforeSize;
            this._hasMoreForward = queryResult.hasMore;
            if (queryResult.records.length > 0) {
                const newBuffer: Array<Record> = [];
                this._buffer.forEach((record: Record) => {
                    newBuffer.push(record)
                });
                queryResult.records.forEach((record: Record) => {
                    newBuffer.push(record);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.records;
        });

    }

    get pageSize():number {
        return this._pageSize;
    }

    refresh():Promise<Array<Record>> {
        this.clear();
        return this.pageForward().then((recordList: Array<Record>) => {
            if (recordList.length > 0) {
                this._firstResultOid = recordList[0].id;
            }
            return recordList;
        });
    }

    trimFirst(n:number) {
        const newBuffer = [];
        for (let i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
    }

    trimLast(n:number) {
        var newBuffer = [];
        for (let i = 0; i < this._buffer.length - n; i++) {
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

export class ErrorDialog extends Dialog {
}

/*
    ***************************************************************************
    End Dialog classes implementation
    ***************************************************************************
 */



/* Types */

export type AttributeCellValueEntryMethod = "COMBO_BOX" | "DROP_DOWN" | "TEXT_FIELD" | "ICON_CHOOSER";

export type ClientType = 'DESKTOP' | 'MOBILE';

export type DialogMessageType = "CONFIRM" | "ERROR" | "INFO" | "WARN";

/* DialogMode */
export enum DialogModeEnum { COPY = 'COPY' , CREATE = 'CREATE', READ = 'READ', UPDATE = 'UPDATE', DESTROYED = 'DESTROYED', DELETE = 'DELETE', LIST = 'LIST'}
export type DialogMode = DialogModeEnum.COPY | DialogModeEnum.CREATE | DialogModeEnum.READ | DialogModeEnum.UPDATE
    | DialogModeEnum.DESTROYED | DialogModeEnum.DELETE | DialogModeEnum.LIST;

export type DialogType = 'hxgn.api.dialog.EditorDialog' | 'hxgn.api.dialog.QueryDialog'

export type FilterOperator = "AND" | "CONTAINS" | "ENDS_WITH" | "EQUAL_TO" |
    "GREATER_THAN" | "GREATER_THAN_OR_EQUAL_TO" | "LESS_THAN" | "LESS_THAN_OR_EQUAL_TO"
    | "NOT_EQUAL_TO" | "OR" | "STARTS_WITH";

export type PositionalQueryAbilityType = 'FULL' | 'NONE';

export enum QueryDirectionEnum { FORWARD = 'FORWARD', BACKWARD = 'BACKWARD'}
export type QueryDirection = QueryDirectionEnum.FORWARD | QueryDirectionEnum.BACKWARD;

export type RedirectionType =
    'hxgn.api.dialog.DialogRedirection' |
    'hxgn.api.dialog.WebRedirection' |
    'hxgn.api.dialog.WorkbenchRedirection' |
    'hxgn.api.dialog.NullRedirection'

export type SortDirection = "ASC" | "DESC";

export enum ViewModeEnum { READ = 'READ', WRITE = 'WRITE'}
export type ViewMode = ViewModeEnum.READ | ViewModeEnum.WRITE;

export type ViewType ='hxgn.api.dialog.BarcodeScan' | 'hxgn.api.dialog.Calendar' | 'hxgn.api.dialog.Details'
    | 'hxgn.api.dialog.Form' | 'hxgn.api.dialog.GpsReading' | 'hxgn.api.dialog.MapLocation'
    | 'hxgn.api.dialog.Graph' | 'hxgn.api.dialog.List' | 'hxgn.api.dialog.Map' | 'hxgn.api.dialog.Stream';


/* Type descriminators */

export enum TypeNames {

    ActionParametersTypeName = 'hxgn.api.dialog.ActionParameters',
    AppWindowTypeName = 'hxgn.api.dialog.AppWindow',
    CodeRefTypeName = 'hxgn.api.dialog.CodeRef',
    DialogTypeName = 'hxgn.api.dialog.Dialog',
    DialogRedirectionTypeName = 'hxgn.api.dialog.DialogRedirection',
    EditorDialogTypeName = 'hxgn.api.dialog.EditorDialog',
    GpsReadingPropertyTypeName = 'hxgn.api.dialog.GpsReadingProperty',
    LoginTypeName = 'hxgn.api.dialog.Login',
    MapLocationPropertyTypeName = 'hxgn.api.dialog.MapLocationProperty',
    NullRedirectionTypeName = 'hxgn.api.dialog.NullRedirection',
    ObjectRefTypeName = 'hxgn.api.dialog.ObjectRef',
    PropertyTypeName = 'hxgn.api.dialog.Property',
    QueryDialogTypeName = 'hxgn.api.dialog.QueryDialog',
    QueryParametersTypeName = 'hxgn.api.dialog.QueryParameters',
    RecordTypeName = 'hxgn.api.dialog.Record',
    ReferringDialogTypeName = 'hxgn.api.dialog.ReferringDialog',
    ReferringWorkbenchTypeName = 'hxgn.api.dialog.ReferringWorkbench',
    SessionTypeName = 'hxgn.api.dialog.Session',
    WebRedirectionTypeName = 'hxgn.api.dialog.WebRedirection',
    WorkbenchTypeName = 'hxgn.api.dialog.Workbench',
    WorkbenchRedirectionTypeName = 'hxgn.api.dialog.WorkbenchRedirection',
}


export class ModelUtil {

    private static classTypes = {
        'hxgn.api.dialog.Annotation': DataAnnotation,
        'hxgn.api.dialog.AttributeCellValue': AttributeCellValue,
        'hxgn.api.dialog.TabCellValue': TabCellValue,
        'hxgn.api.dialog.BarcodeScan': BarcodeScan,
        'hxgn.api.dialog.Calendar': Calendar,
        'hxgn.api.dialog.CodeRef': CodeRef,
        'hxgn.api.dialog.Details': Details,
        'hxgn.api.dialog.DialogException': DialogException,
        'hxgn.api.dialog.EditorDialog': EditorDialog,
        'hxgn.api.dialog.ForcedLineCellValue': ForcedLineCellValue,
        'hxgn.api.dialog.Form': Form,
        'hxgn.api.dialog.GpsReading': GpsReading,
        'hxgn.api.dialog.GpsReadingProperty': GpsReadingProperty,
        'hxgn.api.dialog.MapLocation': MapLocation,
        'hxgn.api.dialog.MapLocationProperty': MapLocationProperty,
        'hxgn.api.dialog.Graph': Graph,
        'hxgn.api.dialog.InlineBinaryRef': InlineBinaryRef,
        'hxgn.api.dialog.LabelCellValue': LabelCellValue,
        'hxgn.api.dialog.List': List,
        'hxgn.api.dialog.Map': Map,
        'hxgn.api.dialog.Menu': Menu,
        'hxgn.api.dialog.ObjectBinaryRef': ObjectBinaryRef,
        'hxgn.api.dialog.ObjectRef': ObjectRef,
        'hxgn.api.dialog.Property': Property,
        'hxgn.api.dialog.PropertyDef': PropertyDef,
        'hxgn.api.dialog.QueryDialog': QueryDialog,
        'hxgn.api.dialog.Record': RecordImpl,
        'hxgn.api.dialog.RecordDef': RecordDef,
        'hxgn.api.dialog.ReferringDialog': ReferringDialog,
        'hxgn.api.dialog.ReferringWorkbench': ReferringWorkbench,
        'hxgn.api.dialog.Stream': Stream,
        'hxgn.api.dialog.SubstitutionCellValue': SubstitutionCellValue,
        'hxgn.api.dialog.ViewDescriptor': ViewDescriptor
    };

    private static classType(name) {
       return ModelUtil.classTypes[name];
    }

    private static typeInstance(name) {
        const type = ModelUtil.classType(name);
        return type && new type;
    }

    static jsonToModel<A>(obj, n=0):Promise<A> {

        const indent = n*4;

        if (Array.isArray(obj)) {
            //Log.debug(`${' '.repeat(indent)}=> Deserializing Array....`);
            return ModelUtil.deserializeArray(obj);
        } else {
            const objType = obj['type'];
            //Log.debug(`${' '.repeat(indent)}=> Deserializing ${objType}`);
            return new Promise<A>((resolve, reject)=>{
                //if the class has a fromJSON method, use it
                const classType = ModelUtil.classType(objType);
                if(classType && typeof classType.fromJSON === 'function') {
                    resolve(classType.fromJSON(obj));
                } else {
                    let newObj = ModelUtil.typeInstance(objType);
                    if (!newObj) {
                        const message = `ModelUtil::jsonToModel: no type constructor found for ${objType}: assuming interface`
                        //Log.debug(message);
                        newObj = {};  //assume it's an interface
                    }
                    //otherwise, copy field values
                    Promise.all(Object.keys(obj).map(prop => {
                        const value = obj[prop];
                        //Log.debug(`${' '.repeat(indent)}prop: ${prop} is type ${typeof value}`);
                        if (value && typeof value === 'object') {
                            if (Array.isArray(value) || 'type' in value) {
                                return ModelUtil.jsonToModel(value, ++n).then(model => {
                                    ModelUtil.assignProp(prop, model, newObj, objType, indent);
                                });
                            } else {
                                ModelUtil.assignProp(prop, value, newObj, objType, indent);
                                return Promise.resolve();
                            }
                        } else {
                            ModelUtil.assignProp(prop, value, newObj, objType, indent)
                            return Promise.resolve();
                        }
                    })).then(result => {
                        resolve(newObj);
                    }).catch(error => reject(error));
                }
            });
        }
    }

    static modelToJson(obj, filterFn?:(prop)=>boolean):StringDictionary {
        return ObjUtil.copyNonNullFieldsOnly(obj, {}, (prop)=> {
            return prop.charAt(0) !== '_' && (!filterFn || filterFn(prop));
        });
    }

    private static deserializeArray(array:Array<any>):Promise<any> {

       return Promise.all(array.map(value=>{
            if (value && typeof value === 'object') {
                return ModelUtil.jsonToModel(value);
            } else {
                return Promise.resolve(value);
            }
        }));

    }

    private static assignProp(prop, value, target, type, n) {
        try {
            if ('_' + prop in target) {
                target['_' + prop] = value;
                //Log.debug(`${' '.repeat(n)}Assigning private prop _${prop} = ${value}`);
            } else {
                //it may be public prop
                if (prop in target) {
                    //Log.debug(`${' '.repeat(n)}Assigning public prop ${prop} = ${value}`);
                } else {
                    //it's either a readonly prop or defined in an interface
                    //in which case it's will not already exist on the target object
                    //Log.debug(`${' '.repeat(n)}Defining ${prop} on target for ${type}`);
                }
                target[prop] = value;
            }
        } catch (error) {
            Log.error(`ModelUtil::assignProp: Failed to set prop: ${prop} on target: ${error}`);
        }
    }
}

/**
 * *********************************
 */

