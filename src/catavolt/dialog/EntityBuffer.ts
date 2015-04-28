/**
 * Created by rburson on 4/27/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class EntityBuffer implements EntityRec {

        static createEntityBuffer(objectId:string, before:Array<Prop>, after:Array<Prop>):EntityBuffer {
            return new EntityBuffer(EntityRec.Util.newEntityRec(objectId, before), EntityRec.Util.newEntityRec(objectId, after));
        }

        constructor(private _before:EntityRec, private _after?:EntityRec) {
            if(!_before) throw new Error('_before is null in EntityBuffer');
            if(!_after) this._after = _before;
        }

        get after():EntityRec {
            return this._after;
        }

        get annos():Array<DataAnno> {return this._after.annos;}

        annosAtName(propName:string):Array<DataAnno>{
            return this._after.annosAtName(propName);
        }

        afterEffects(afterAnother?:EntityRec):EntityRec {
           if(afterAnother) {
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
            return this._after.foregroundColor(propName);
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

        get objectId():string { return this._after.objectId; }

        get overrideText():string  {
            return this._after.overrideText;
        }

        overrideTextFor(propName:string):string  {
            return this._after.overrideTextFor(propName);
        }

        propAtIndex(index:number):Prop {
            return this.props[index];
        }

        propAtName(propName:string):Prop {
            return this._after.propAtName(propName);
        }

        get propCount():number {
            return this._after.propCount;
        }

        get propNames():Array<string> {
            return this._after.propNames;
        }

        get props():Array<Prop> { return this._after.props; }

        get propValues():Array<any> {
            return this._after.propValues;
        }

        setValue(name:string, value) {
            this.props.some((prop:Prop)=>{
                if(prop.name === name) {
                    prop.value = value;
                    return true;
                }
                return false;
            });
        }

        get tipText():string {
            return this._after.tipText;
        }

        tipTextFor(propName:string):string {
            return this._after.tipTextFor(propName);
        }

        toEntityRec():EntityRec {
            return EntityRec.Util.newEntityRec(this.objectId, this.props);
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
}