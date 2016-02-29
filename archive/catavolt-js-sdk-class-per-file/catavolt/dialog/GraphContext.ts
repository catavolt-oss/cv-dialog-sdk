/**
 * Created by rburson on 5/4/15.
 */

import {GraphDef} from "./GraphDef";
import {QueryContext} from "./QueryContext";

export class GraphContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get graphDef():GraphDef {
        return <GraphDef>this.paneDef;
    }

}
