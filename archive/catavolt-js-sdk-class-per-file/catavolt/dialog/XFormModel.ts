/**
 * Created by rburson on 3/31/15.
 */

import {XFormModelComp} from "./XFormModelComp";
import {Try} from "../fp/Try";
import {DialogTriple} from "./DialogTriple";
import {OType} from "./OType";
import {Failure} from "../fp/Failure";
import {Success} from "../fp/Success";

export class XFormModel {

    constructor(public form:XFormModelComp,
                public header:XFormModelComp,
                public children:Array<XFormModelComp>,
                public placement:string,
                public refreshTimer:number,
                public sizeToWindow:boolean) {
    }

    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    static fromWS(otype:string, jsonObj):Try<XFormModel> {

        return DialogTriple.fromWSDialogObject<XFormModelComp>(jsonObj['form'],
            'WSFormModelComp', OType.factoryFn, true).bind((form:XFormModelComp)=> {
            var header:XFormModelComp = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple.fromWSDialogObject<XFormModelComp>(jsonObj['header'],
                    'WSFormModelComp', OType.factoryFn, true);
                if (headerTry.isFailure) return new Failure<XFormModel>(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple.fromListOfWSDialogObject<XFormModelComp>(jsonObj['children'],
                'WSFormModelComp', OType.factoryFn, true).bind((children:Array<XFormModelComp>)=> {
                return new Success(new XFormModel(form, header, children, jsonObj['placement'],
                    jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });

    }

}
