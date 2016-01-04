/**
 * Created by rburson on 5/4/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class GraphContext extends QueryContext{

        constructor(paneRef:number) {
            super(paneRef);
        }

        get graphDef():GraphDef {
            return <GraphDef>this.paneDef;
        }

    }
}