/**
 * Created by rburson on 3/17/15.
 */

module catavolt.dialog {

    export class Workbench implements NavRequest{

        constructor(private _workbenchId:string,
                    private _name:string,
                    private _alias:string,
                    private _workbenchLaunchActions:Array<WorkbenchLaunchAction>) {}

        get alias() { return this._alias; }
        get name() { return this._name; }
        get workbenchId() { return this._workbenchId; }
        get workbenchLaunchActions() { return ArrayUtil.copy(this._workbenchLaunchActions); }

    }
}