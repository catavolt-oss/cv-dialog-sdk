/**
 * Created by rburson on 5/4/15.
 */

import {QueryContext} from "./QueryContext";
import {MapDef} from "./MapDef";

export class MapContext extends QueryContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get mapDef():MapDef {
        return <MapDef>this.paneDef;
    }

}
