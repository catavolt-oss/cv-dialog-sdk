/**
 * Created by rburson on 3/17/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class WorkbenchLaunchAction implements ActionSource{

        constructor(public id:string,
                    public workbenchId:string,
                    public name:string,
                    public alias:string,
                    public iconBase:string){}

        get actionId():string {
            return this.id;
        }

        get fromActionSource():ActionSource {
            return null;
        }

        get virtualPathSuffix():Array<string> {
            return [this.workbenchId, this.id];
        }

    }
}
