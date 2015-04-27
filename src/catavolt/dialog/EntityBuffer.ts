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
            return this._after.
        }

        get imageName():string {
            return this._after.
        }

        imageNameFor(propName:string):string {
            return this._after.
        }

        get imagePlacement():string {
            return this._after.
        }

        imagePlacementFor(propName:string):string {
            return this._after.
        }

        get isBoldText():boolean {
            return this._after.
        }

        isBoldTextFor(propName:string):boolean {
            return this._after.
        }

        isChanged(name:string):boolean {

            return this._after.
        }

        get isItalicText():boolean {
            return this._after.
        }

        isItalicTextFor(propName:string):boolean {
            return this._after.
        }

        get isPlacementCenter():boolean {
            return this._after.
        }

        isPlacementCenterFor(propName:string):boolean {
            return this._after.
        }

        get isPlacementLeft():boolean {
            return this._after.
        }

        isPlacementLeftFor(propName:string):boolean {
            return this._after.
        }

        get isPlacementRight():boolean {
            return this._after.
        }

        isPlacementRightFor(propName:string):boolean {
            return this._after.
        }

        get isPlacementStretchUnder():boolean {
            return this._after.
        }

        isPlacementStretchUnderFor(propName:string):boolean {
            return this._after.
        }

        get isPlacementUnder():boolean {
            return this._after.
        }

        isPlacementUnderFor(propName:string):boolean {
            return this._after.
        }

        get isUnderline():boolean {
            return this._after.
        }

        isUnderlineFor(propName:string):boolean {
            return this._after.
        }

        get objectId():string { }

        get overrideText():string  {
            return this._after.
        }

        overrideTextFor(propName:string):string  {
            return this._after.
        }

        propAtIndex(index:number):Prop {
            return this._after.
        }

        propAtName(propName:string):Prop {
            return this._after.
        }

        get propCount():number {
            return this._after.
        }

        get propNames():Array<string> {
            return this._after.
        }

        get props():Array<Prop> { }

        get propValues():Array<any> {
            return this._after.
        }

        setValue(name:string, value) {
            return this._after.

        }

        get tipText():string {
            return this._after.
        }

        tipTextFor(propName:string):string {
            return this._after.
        }

        toEntityRec():EntityRec {
            return this._after.
        }

        toWSEditorRecord():StringDictionary {
            return this._after.
        }

        toWS():StringDictionary {
            return this._after.
        }

        valueAtName(propName:string):any {
            return this._after.
        }

    }
}