/**
 * Created by rburson on 3/31/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class XFormModelComp {

        constructor(public paneId:string,
                    public redirection:DialogRedirection,
                    public label:string,
                    public title:string) {
        }

    }
}