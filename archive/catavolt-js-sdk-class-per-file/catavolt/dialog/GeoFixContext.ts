/**
 * Created by rburson on 5/4/15.
 */

import {EditorContext} from "./EditorContext";
import {GeoFixDef} from "./GeoFixDef";

export class GeoFixContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get geoFixDef():GeoFixDef {
        return <GeoFixDef>this.paneDef;
    }

}
