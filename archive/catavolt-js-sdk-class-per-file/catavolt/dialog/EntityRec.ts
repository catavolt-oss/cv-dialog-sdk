/**
 * Created by rburson on 3/30/15.
 */

import {DataAnno} from './DataAnno';
import {Prop} from './Prop';
import {EntityRecImpl} from "./EntityRecImpl";
import {StringDictionary} from "../util/Types";
import {ArrayUtil} from "../util/ArrayUtil";
import {Try} from "../fp/Try";
import {Success} from "../fp/Success";
import {Failure} from "../fp/Failure";

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

export class EntityRecUtil {

    static newEntityRec(objectId:string, props:Array<Prop>, annos?:Array<DataAnno>):EntityRec {
        return annos ? new EntityRecImpl(objectId, props, annos) : new EntityRecImpl(objectId, props);
    }

    static union(l1:Array<Prop>, l2:Array<Prop>):Array<Prop> {
        var result:Array<Prop> = ArrayUtil.copy(l1);
        l2.forEach((p2:Prop)=> {
            if (!l1.some((p1:Prop, i)=> {
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
    }


    //module level functions

    static fromWSEditorRecord(otype:string, jsonObj):Try<EntityRec> {

        var objectId = jsonObj['objectId'];
        var namesJson:StringDictionary = jsonObj['names'];
        if (namesJson['WS_LTYPE'] !== 'String') {
            return new Failure<EntityRec>('fromWSEditorRecord: Expected WS_LTYPE of String but found ' + namesJson['WS_LTYPE']);
        }
        var namesRaw:Array<string> = namesJson['values'];
        var propsJson = jsonObj['properties'];
        if (propsJson['WS_LTYPE'] !== 'Object') {
            return new Failure<EntityRec>('fromWSEditorRecord: Expected WS_LTYPE of Object but found ' + propsJson['WS_LTYPE']);
        }
        var propsRaw:Array<any> = propsJson['values'];

        var propsTry = Prop.fromWSNamesAndValues(namesRaw, propsRaw);
        if (propsTry.isFailure) return new Failure<EntityRec>(propsTry.failure);

        var props:Array<Prop> = propsTry.success;
        if (jsonObj['propertyAnnotations']) {
            var propAnnosObj = jsonObj['propertyAnnotations'];
            var annotatedPropsTry:Try<Array<Prop>> = DataAnno.annotatePropsUsingWSDataAnnotation(props, propAnnosObj);
            if (annotatedPropsTry.isFailure) return new Failure<EntityRec>(annotatedPropsTry.failure);
        }
        var recAnnos:Array<DataAnno> = null;
        if (jsonObj['recordAnnotation']) {
            var recAnnosTry:Try<Array<DataAnno>> = DataAnno.fromWS('WSDataAnnotation', jsonObj['recordAnnotation']);
            if (recAnnosTry.isFailure) return new Failure<EntityRec>(recAnnosTry.failure);
            recAnnos = recAnnosTry.success;
        }
        return new Success(new EntityRecImpl(objectId, props, recAnnos));
    }
}
