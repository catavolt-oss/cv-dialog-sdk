/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class Workbench implements NavRequest{

        static fromWSWorkbench(jsonObject:StringDictionary): Try<Workbench> {
            return DialogTriple.extractValue(jsonObject, 'WSWorkbench',
                ()=>{
                    var laTry:Try<Array<WorkbenchLaunchAction>> =
                        DialogTriple.fromListOfWSDialogObject<WorkbenchLaunchAction>(jsonObject['actions'], 'WSWorkbenchLaunchAction');
                    if(laTry.isFailure) { return new Failure<Workbench>(laTry.failure); }
                    var workbench = new Workbench(jsonObject['id'], jsonObject['name'], jsonObject['alias'], laTry.success);
                    return new Success<Workbench>(workbench);
                }
            );
        }

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