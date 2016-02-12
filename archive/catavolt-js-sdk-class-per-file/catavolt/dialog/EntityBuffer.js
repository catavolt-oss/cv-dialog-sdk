/**
 * Created by rburson on 4/27/15.
 */
import { EntityRecUtil } from "./EntityRec";
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
    get annos() { return this._after.annos; }
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
    get objectId() { return this._after.objectId; }
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
    get props() { return this._after.props; }
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
//# sourceMappingURL=EntityBuffer.js.map