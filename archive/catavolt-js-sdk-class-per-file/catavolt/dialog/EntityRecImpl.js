/**
 * Created by rburson on 4/13/15.
 */
import { Prop } from "./Prop";
import { DataAnno } from "./DataAnno";
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
