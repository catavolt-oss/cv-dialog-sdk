/**
 * Created by rburson on 4/24/15.
 */
import { DataAnno } from "./DataAnno";
import { Prop } from "./Prop";
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
