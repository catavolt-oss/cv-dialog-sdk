/**
 * Created by rburson on 4/2/15.
 */
import { StringUtil } from "../util/StringUtil";
import { ArrayUtil } from "../util/ArrayUtil";
import { Success } from "../fp/Success";
import { Failure } from "../fp/Failure";
import { DialogTriple } from "./DialogTriple";
import { Prop } from "./Prop";
import { OType } from "./OType";
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
