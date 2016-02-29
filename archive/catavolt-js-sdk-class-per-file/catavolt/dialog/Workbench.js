/**
 * Created by rburson on 3/17/15.
 */
import { ArrayUtil } from "../util/ArrayUtil";
export class Workbench {
    constructor(_id, _name, _alias, _actions) {
        this._id = _id;
        this._name = _name;
        this._alias = _alias;
        this._actions = _actions;
    }
    get alias() {
        return this._alias;
    }
    getLaunchActionById(launchActionId) {
        var result = null;
        this.workbenchLaunchActions.some(function (launchAction) {
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
    get workbenchLaunchActions() {
        return ArrayUtil.copy(this._actions);
    }
}
