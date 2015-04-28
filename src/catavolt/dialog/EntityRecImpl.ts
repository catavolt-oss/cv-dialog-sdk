/**
 * Created by rburson on 4/13/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class EntityRecImpl implements EntityRec{

        constructor(public objectId:string, public props:Array<Prop>=[], public annos:Array<DataAnno>=[]) {
        }

        annosAtName(propName:string):Array<DataAnno>{
            var p = this.propAtName(propName);
            return p ? p.annos : [];
        }

        afterEffects(after:EntityRec):EntityRec {
            var effects = [];
            after.props.forEach((afterProp)=>{
                var beforeProp = this.propAtName(afterProp.name);
                if(!afterProp.equals(beforeProp)) {
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

        get overrideText():string  {
            return DataAnno.overrideText(this.annos);
        }

        overrideTextFor(propName:string):string  {
            var p = this.propAtName(propName);
            return p && p.overrideText ? p.overrideText : this.overrideText;

        }

        propAtIndex(index:number):Prop {
            return this.props[index];
        }

        propAtName(propName:string):Prop {
            var prop:Prop = null;
            this.props.some((p)=>{
                if(p.name === propName) {
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
           return this.props.map((p)=>{return p.name;});
        }

        get propValues():Array<any> {
            return this.props.map((p)=>{return p.value;});
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
            var result:StringDictionary = {'WS_OTYPE':'WSEditorRecord'};
            if(this.objectId) result['objectId'] = this.objectId;
            result['names'] = Prop.toWSListOfString(this.propNames);
            result['properties'] = Prop.toWSListOfProperties(this.propValues);
            return result;
        }

        toWS():StringDictionary {
            var result:StringDictionary = {'WS_OTYPE':'WSEntityRec'};
            if(this.objectId) result['objectId'] = this.objectId;
            result['props'] = Prop.toListOfWSProp(this.props);
            if(this.annos) result['annos'] = DataAnno.toListOfWSDataAnno(this.annos);
            return result;
        }

        valueAtName(propName:string):any {
            var value = null;
            this.props.some((p)=>{
                if(p.name === propName) {
                    value = p.value;
                    return true;
                }
                return false;
            });
            return value;
        }

    }
}