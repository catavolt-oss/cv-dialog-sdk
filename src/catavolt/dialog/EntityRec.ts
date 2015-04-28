/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>
/*
    @TODO
*/
module catavolt.dialog {

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

        propAtIndex(index:number):Prop;

        propAtName(propName:string):Prop;

        propCount:number;

        propNames:Array<string>;

        propValues:Array<any>;

        props:Array<Prop>;

        tipText:string;
        tipTextFor(propName:string):string;

        toEntityRec():EntityRec;

        toWSEditorRecord():StringDictionary;

        toWS():StringDictionary;

        valueAtName(propName:string):any;
    }

    export module EntityRec.Util {

        export function newEntityRec(objectId:string, props:Array<Prop>, annos?:Array<DataAnno>):EntityRec {
           return annos ? new EntityRecImpl(objectId, props, annos) : new EntityRecImpl(objectId, props);
        }
    }
}
