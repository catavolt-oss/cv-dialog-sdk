/**
 * Created by rburson on 10/19/17.
 */

import {StringDictionary, Log, ObjUtil, StringUtil, ArrayUtil, DateValue, DateTimeValue, TimeValue} from './util'
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

    constructor(readonly style:string) {}

    get isInlineMediaStyle():boolean {
        return this.style && (this.style === PropertyDef.STYLE_INLINE_MEDIA || this.style === PropertyDef.STYLE_INLINE_MEDIA2);
    }

}

/**
 * A View represents a Catavolt 'Pane' definition.  A Pane can be thought of as a 'panel' or UI component
 * that is responsible for displaying a data record or records. The Pane describes 'how' and 'where' the data will be
 * displayed, as well as surrounding 'meta' data (i.e. the Pane title, the Pane's menus).  The Pane itself does not contain
 * the record or records to be displayed, but may be combined with a {@link EntityRecord}(s) to display the data.
 */
export abstract class View {

    /* From View */
    readonly id:string;
    readonly name:string;
    readonly menu:Menu;
    readonly title:string;
    readonly type: ViewType;

    /* @TODO Leftover from PaneDef */
    /*
    readonly label:string;
    readonly viewDescs:Array<ViewDesc>;
    readonly entityRecDef:RecordDef;
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
     * @returns {MenuDef}
     */
    findMenuAt(actionId:string):Menu {
        var result:Menu = null;
        if (this.menu) {
            this.menu.children.some((md:Menu)=> {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    }


}

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


export interface Dialog {

    readonly businessClassName:string;
    readonly children: Array<Dialog>;
    readonly dialogClassName:string;
    readonly dialogMode:DialogMode;
    readonly dialogType:string;
    readonly id:string;
    readonly recordDef: RecordDef;
    readonly referringAction:ReferringAction;
    readonly sessionId:string;
    readonly tenantId: string;
    readonly view: View;
    readonly  viewMode: ViewMode;

}

export interface ReferringAction {

    readonly action:Menu;
    readonly referringId:string;
    readonly referringType:string;

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
     * If the case of a host programming error, this property contains a stack trace of the host programming language.
     */
    readonly stackTrace: string;

}
export interface DialogRedirection extends Redirection {

    readonly dialogId:string;
    readonly dialogType:DialogType;
    readonly dialogMode:DialogMode;
    readonly dialogClassName:string;
    readonly businessClassName:string;
    readonly businessId:string;
    readonly viewMode:ViewMode;

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

    /*
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
     */

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

    /*
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
     */

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

export interface EditorDialog extends Dialog {

    readonly businessId: string;

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

    propAtIndex(index:number):Property;

    propAtName(propName:string):Property;

    propCount:number;

    propNames:Array<string>;

    propValues:Array<any>;

    props:Array<Property>;

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

    static newEntityRec(objectId:string, props:Array<Property>, annos?:Array<DataAnno>):EntityRec {
        return annos ? new EntityRecImpl(objectId, ArrayUtil.copy(props), ArrayUtil.copy(annos)) : new EntityRecImpl(objectId, ArrayUtil.copy(props));
    }

    static isEntityRec(o:any):boolean {

       return (o instanceof EntityRecImpl)
           || (o instanceof EntityBuffer)
           || (o instanceof NullEntityRec);
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
 * An {@link EntityRec} that manages two copies internally, a before and after, for 'undo' and comparison purposes.
 * An EntityRec Represents a 'Record' or set of {@link Prop} (names and values).
 * An EntityRec may also have {@link DataAnno}s (style annotations) that apply to the whole 'record'
 */
export class EntityBuffer implements EntityRec {

    static createEntityBuffer(objectId:string, before:Array<Property>, after:Array<Property>):EntityBuffer {
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

    propAtIndex(index:number):Property {
        return this.props[index];
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

    get props():Array<Property> {
        return this._after.props;
    }

    get propValues():Array<any> {
        return this._after.propValues;
    }

    setValue(name:string, value) {
        const newProps = [];
        let found = false;
        this.props.forEach((prop:Property)=> {
            if (prop.name === name) {
                newProps.push(new Property(name, value));
                found = true;
            } else {
                newProps.push(prop);
            }
        });
        if (!found) {
            newProps.push(new Property(name, value));
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

    constructor(public objectId:string, public props:Array<Property> = [], public annos:Array<DataAnno> = []) {
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

    propAtIndex(index:number):Property {
        return this.props[index];
    }

    propAtName(propName:string):Property {
        var prop:Property = null;
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
        result['names'] = Property.toWSListOfString(this.propNames);
        result['properties'] = Property.toWSListOfProperties(this.propValues);
        return result;
    }

    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEntityRec'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = Property.toListOfWSProp(this.props);
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
export interface ForcedLineCellValue extends CellValue {
}

/**
 * A composition of View objects that, together, comprise a UI form.
 */
export class Form extends View {

    readonly borderStyle: string;
    readonly formStyle: string;
    readonly formLayout: string;
    readonly headerDef:Details;

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
    //@TODO leftover from ListDef
    readonly defaultActionId:string;

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

    static findSubMenu(md:Menu, matcher:(menuDef:Menu)=>boolean):Menu {
        if (matcher(md)) return md;
        if (md.children) {
            for (let i = 0; i < md.children.length; i++) {
                let result = Menu.findSubMenu(md.children[i], matcher);
                if (result) return result;
            }
        }
        return null;
    }

    findAtId(actionId:string):Menu {
        if (this.id === actionId) return this;
        var result = null;
        if (this.children) {
            this.children.some((md:Menu)=> {
                result = md.findAtId(actionId);
                return result != null;
            });
        }
        return result;
    }

    findContextMenuDef():Menu {
        return Menu.findSubMenu(this, (md:Menu) => {
            return md.name === 'CONTEXT_MENU';
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

export interface NavRequest {}

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

    get props():Array<Property> {
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
        result['names'] = Property.toWSListOfString(this.propNames);
        result['properties'] = Property.toWSListOfProperties(this.propValues);
        return result;
    }

    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSEntityRec'};
        if (this.objectId) result['objectId'] = this.objectId;
        result['props'] = Property.toListOfWSProp(this.props);
        if (this.annos) result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        return result;
    }

    valueAtName(propName:string):any {
        return null;
    }

}

export class NullNavRequest implements NavRequest {

    referringDialogProperties:StringDictionary;

    constructor() {
        this.referringDialogProperties = {};
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

export class PrintMarkup extends View {
}


/**
 * Represents a 'value' or field in a row or record. See {@link EntityRec}
 * A Prop has a corresponding {@link PropDef} that describes the property.
 * Like an {@link EntityRec}, a Prop may also have {@link DataAnno}s (style annotations),
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

    /**
     * @private
     * @param values
     * @returns {Success}
     */
    /*
    static fromListOfWSValue(values:Array<any>):Try<Array<any>> {
        var props = [];
        values.forEach((v)=> {
            var propTry = Prop.fromWSValue(v);
            if (propTry.isFailure) return new Failure(propTry.failure);
            props.push(propTry.success);
        });
        return new Success(props);
    }
    */

    /**
     * @private
     * @param name
     * @param value
     * @returns {any}
     */
    /*
    static fromWSNameAndWSValue(name:string, value:any):Try<Prop> {
        var propTry:Try<any> = Prop.fromWSValue(value);
        if (propTry.isFailure) {
            return new Failure<Prop>(propTry.failure);
        }
        return new Success<Prop>(new Prop(name, propTry.success));
    }
    */

    /**
     * @private
     * @param names
     * @param values
     * @returns {any}
     */
    /*
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
    */

    /**
     * @private
     * @param value
     * @returns {any}
     */
    /*
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
                    const codeRef:CodeRef = value;
                    if(codeRef.code && codeRef.description) {
                        propValue = new CodeRef(codeRef.code, codeRef.description);
                    } else {
                        propValue = CodeRef.fromFormattedValue(strVal);
                    }
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
    */

    /**
     * @private
     * @param otype
     * @param jsonObj
     * @returns {any}
     */
    /*
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
    */

    /**
     * @private
     * @param o
     * @returns {any}
     */

    /* TODO */

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
                const codeRef:CodeRef = o;
                return {'WS_PTYPE': 'CodeRef', 'value': codeRef.toString(), 'description': codeRef.description, 'code': codeRef.code};
            } else if (o instanceof ObjectRef) {
                const objectRef:ObjectRef = o;
                return {'WS_PTYPE': 'ObjectRef', 'value': objectRef.toString(), 'description': objectRef.description, 'objectId': objectRef.objectId};
            } else if (o instanceof GeoFix) {
                return {'WS_PTYPE': 'GeoFix', 'value': o.toString()};
            } else if (o instanceof GeoLocation) {
                return {'WS_PTYPE': 'GeoLocation', 'value': o.toString()};
            } else if (o instanceof InlineBinaryRef) {
                return {'WS_PTYPE': 'BinaryRef', 'value': o.toString(), properties: (o as BinaryRef).settings}
            } else if (Array.isArray(o)) {
                return Property.toWSListOfProperties(o);
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
    /* TODO */
    static toWSListOfProperties(list:Array<any>):StringDictionary {
        var result:StringDictionary = {'WS_LTYPE': 'Object'};
        var values = [];
        list.forEach((o)=> {
            values.push(Property.toWSProperty(o))
        });
        result['values'] = values;
        return result;
    }

    /**
     * @private
     * @param list
     * @returns {{WS_LTYPE: string, values: Array<string>}}
     */
    /* TODO */
    static toWSListOfString(list:Array<string>):StringDictionary {
        return {'WS_LTYPE': 'String', 'values': list};
    }

    /**
     *
     * @private
     * @param props
     * @returns {StringDictionary}
     */
    /* TODO */
    static toListOfWSProp(props:Array<Property>):StringDictionary {
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
    constructor(readonly name:string, readonly value:any, readonly annos:Array<DataAnno> = []) {
    }

    equals(prop:Property):boolean {
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

    get overrideText():string {
        return DataAnno.overrideText(this.annos);
    }

    get tipText():string {
        return DataAnno.tipText(this.annos);
    }

    /**
     * @private
     * @returns {StringDictionary}
     */
    toWS():StringDictionary {
        var result:StringDictionary = {'WS_OTYPE': 'WSProp', 'name': this.name, 'value': Property.toWSProperty(this.value)};
        if (this.annos) {
            result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
        }
        return result;
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
                /**
                 * The name of a business-data value
                 */
                readonly propertyName: string,
                /**
                 * Scale of a decimal type
                 */
                readonly scale: number,

                readonly style: string,
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

    get isInlineMediaStyle():boolean {
        return this.style &&
            (this.style === PropertyDef.STYLE_INLINE_MEDIA || this.style === PropertyDef.STYLE_INLINE_MEDIA2);
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
}

export interface Record {

    readonly id: string;
    readonly properties: any;

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

export interface Redirection {

    readonly dialogProperties: StringDictionary;
    readonly type:RedirectionType;
    readonly referringDialogProperties: StringDictionary;
    readonly sessionId: string;
    readonly tenantId: string;

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

export interface SessionId {

    readonly sessionId: string;
}

export interface Sessions extends Array<Session> {
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

export class UserMessage {

    constructor(public message:string,
                public messageType:string,
                public explanation:string,
                public propertyNames:Array<string>) {
    }
}



export class ViewDesc {

    constructor(public name:string, public description:string, public viewId:string){}

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

export interface WebRedirection extends Redirection, NavRequest {

    readonly url:string;

}

export interface WorkbenchRedirection extends Redirection, NavRequest {

    readonly workbenchId:string;

}




/* Types */

export type AttributeCellValueEntryMethod = "COMBO_BOX" | "DROP_DOWN" | "TEXT_FIELD" | "ICON_CHOOSER";

export type ClientType = 'DESKTOP' | 'MOBILE';

export type DialogMessageType = "CONFIRM" | "ERROR" | "INFO" | "WARN";

/* DialogMode */
export enum DialogModeEnum { COPY = 'COPY' , CREATE = 'CREATE', READ = 'READ', UPDATE = 'UPDATE', DELETE = 'DELETE' }
export type DialogMode = DialogModeEnum.COPY | DialogModeEnum.CREATE | DialogModeEnum.READ | DialogModeEnum.UPDATE | DialogModeEnum.DELETE;

export type DialogType = 'hxgn.api.dialog.EditorDialog' | 'hxgn.api.dialog.QueryDialog'

export type FilterOperator = "AND" | "CONTAINS" | "ENDS_WITH" | "EQUAL_TO" |
    "GREATER_THAN" | "GREATER_THAN_OR_EQUAL_TO" | "LESS_THAN" | "LESS_THAN_OR_EQUAL_TO"
    | "NOT_EQUAL_TO" | "OR" | "STARTS_WITH";

export enum QueryDirection { FORWARD, BACKWARD }

export type RedirectionType =
    'hxgn.api.dialog.DialogRedirection' |
    'hxgn.api.dialog.WebRedirection' |
    'hxgn.api.dialog.WorkbenchRedirection' |
    'hxgn.api.dialog.NullRedirection'

export type SortDirection = "ASC" | "DESC";

export enum ViewModeEnum { READ = 'READ', WRITE = 'WRITE'}
export type ViewMode = ViewModeEnum.READ | ViewModeEnum.WRITE;

export type ViewType ='hxgn.api.dialog.BarcodeScan' | 'hxgn.api.dialog.Calendar' | 'hxgn.api.dialog.Details'
    | 'hxgn.api.dialog.Form' | 'hxgn.api.dialog.GeoFix' | 'hxgn.api.dialog.GeoLocation'
    | 'hxgn.api.dialog.Graph' | 'hxgn.api.dialog.List' | 'hxgn.api.dialog.Map' | 'hxgn.api.dialog.Stream';


/* Type descriminators */

export enum TypeNames {

    DialogRedirectionTypeName = 'hxgn.api.dialog.DialogRedirection',
    NullRedirectionTypeName = 'hxgn.api.dialog.NullRedirection',
    WebRedirectionTypeName = 'hxgn.api.dialog.WebRedirection',
    WorkbenchRedirectionTypeName = 'hxgn.api.dialog.WorkbenchRedirection',
    SessionTypeName = 'hxgn.api.dialog.Session'
}


export class ModelUtil {

    private static classTypes = {
        'hxgn.api.dialog.BarcodeScan': BarcodeScan,
        'hxgn.api.dialog.Calendar': Calendar,
        'hxgn.api.dialog.Details': Details,
        'hxgn.api.dialog.Form': Form,
        'hxgn.api.dialog.GeoFix': GeoFix,
        'hxgn.api.dialog.GeoLocation': GeoLocation,
        'hxgn.api.dialog.Graph': Graph,
        'hxgn.api.dialog.List': List,
        'hxgn.api.dialog.Map': Map,
        'hxgn.api.dialog.Stream': Stream,
        'hxgn.api.dialog.CodeRef': CodeRef,
        'hxgn.api.dialog.Menu': Menu,
        'hxgn.api.dialog.ObjectRef': ObjectRef,
        'hxgn.api.dialog.Property': Property,
        'hxgn.api.dialog.PropertyDef': PropertyDef,
        'hxgn.api.dialog.RecordDef': RecordDef,
        'hxgn.api.dialog.ViewDesc': ViewDesc,
        'hxgn.api.dialog.InlineBinaryRef': InlineBinaryRef,
        'hxgn.api.dialog.ObjectBinaryRef': ObjectBinaryRef,
        'hxgn.api.dialog.DialogException': DialogException,
        'hxgn.api.dialog.DataAnno': DataAnno
    };

    private static typeFns:{[index:string]:(s:string, a:any)=>Promise<any>} = {
    }

    private static typeInstance(name) {
        const type = ModelUtil.classTypes[name];
        return type && new type;
    }

    static factoryFn<A>(type:string, jsonObj):Promise<A> {
       const typeFn:(string, any)=>Promise<A> = ModelUtil.typeFns[type];
        if (typeFn) {
            return typeFn(type, jsonObj);
        }
        return null;
    }

    static jsonToModel<A>(obj, factoryFn:(type:string, jsonObj?)=>any=ModelUtil.factoryFn, n=0):Promise<A> {

        const indent = n*4;

        if (Array.isArray(obj)) {
            Log.debug(`${' '.repeat(indent)}=> Deserializing Array....`);
            return ModelUtil.deserializeArray(obj);
        } else {
            const objType = obj['type'];
            Log.debug(`${' '.repeat(indent)}=> Deserializing ${objType}`);
            const funcPr:Promise<A> = factoryFn(objType, obj); //this returns null if there is no custom function
            if (funcPr) {
                return funcPr.catch(error=> {
                    const message = `ModelUtil::jsonToModel: factory failed to produce object for : ${objType} : ${ObjUtil.formatRecAttr(error)}`;
                    Log.error(error);
                    throw new Error(message);
                });
            } else {
                return new Promise<A>((resolve, reject)=>{
                    let newObj = ModelUtil.typeInstance(objType);
                    if (!newObj) {
                        const message = `ModelUtil::jsonToModel: no type constructor found for ${objType}: assuming interface`
                        Log.debug(message);
                        newObj = {};  //assume it's an interface
                    }
                    Promise.all(Object.keys(obj).map(prop=>{
                        const value = obj[prop];
                        Log.debug(`${' '.repeat(indent)}prop: ${prop} is type ${typeof value}`);
                        if (value && typeof value === 'object') {
                            if(Array.isArray(value) || 'type' in value) {
                                return ModelUtil.jsonToModel(value, ModelUtil.factoryFn, ++n).then(model=>{
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
                    })).then(result=>{
                       resolve(newObj);
                    }).catch(error=>reject(error));
                });
            }
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
                Log.debug(`${' '.repeat(n)}Assigning private prop _${prop} = ${value}`);
            } else {
                //it may be public prop
                if (prop in target) {
                    Log.debug(`${' '.repeat(n)}Assigning public prop ${prop} = ${value}`);
                } else {
                    //it's either a readonly prop or defined in an interface
                    //in which case it's will not already exist on the target object
                    Log.debug(`${' '.repeat(n)}Defining ${prop} on target for ${type}`);
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

