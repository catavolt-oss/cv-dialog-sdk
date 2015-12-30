/**
 * Created by rburson on 3/17/15.
 */

import {NavRequest} from "./NavRequest";
import {WorkbenchLaunchAction} from "./WorkbenchLaunchAction";
import {ArrayUtil} from "../util/ArrayUtil";

export class Workbench implements NavRequest {

    constructor(private _id:string,
                private _name:string,
                private _alias:string,
                private _actions:Array<WorkbenchLaunchAction>) {
    }

    get alias() {
        return this._alias;
    }

    getLaunchActionById(launchActionId:string) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction:WorkbenchLaunchAction) {
            if (launchAction.id = launchActionId) {
                result = launchAction;
                return true;
            }
        });
        return result;
    }

    get name() {
        return this._name;
    }

    get workbenchId() {
        return this._id;
    }

    get workbenchLaunchActions():Array<WorkbenchLaunchAction> {
        return ArrayUtil.copy(this._actions);
    }

}
