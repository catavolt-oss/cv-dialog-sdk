/**
 * Created by rburson on 3/31/15.
 */
import { DialogTriple } from "./DialogTriple";
import { OType } from "./OType";
import { Failure } from "../fp/Failure";
import { Success } from "../fp/Success";
export class XFormModel {
    constructor(form, header, children, placement, refreshTimer, sizeToWindow) {
        this.form = form;
        this.header = header;
        this.children = children;
        this.placement = placement;
        this.refreshTimer = refreshTimer;
        this.sizeToWindow = sizeToWindow;
    }
    /*
     This custom fromWS method is necessary because the XFormModelComps, must be
     built with the 'ignoreRedirection' flag set to true
     */
    static fromWS(otype, jsonObj) {
        return DialogTriple.fromWSDialogObject(jsonObj['form'], 'WSFormModelComp', OType.factoryFn, true).bind((form) => {
            var header = null;
            if (jsonObj['header']) {
                var headerTry = DialogTriple.fromWSDialogObject(jsonObj['header'], 'WSFormModelComp', OType.factoryFn, true);
                if (headerTry.isFailure)
                    return new Failure(headerTry.isFailure);
                header = headerTry.success;
            }
            return DialogTriple.fromListOfWSDialogObject(jsonObj['children'], 'WSFormModelComp', OType.factoryFn, true).bind((children) => {
                return new Success(new XFormModel(form, header, children, jsonObj['placement'], jsonObj['refreshTimer'], jsonObj['sizeToWindow']));
            });
        });
    }
}
//# sourceMappingURL=XFormModel.js.map