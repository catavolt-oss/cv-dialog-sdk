/**
 * Created by rburson on 5/4/15.
 */

import {EditorContext} from "./EditorContext";
import {GeoLocationDef} from "./GeoLocationDef";

export class GeoLocationContext extends EditorContext {

    constructor(paneRef:number) {
        super(paneRef);
    }

    get geoLocationDef():GeoLocationDef {
        return <GeoLocationDef>this.paneDef;
    }

}
