/**
 * Created by rburson on 5/4/15.
 */
import { EditorContext } from "./EditorContext";
export class GeoLocationContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get geoLocationDef() {
        return this.paneDef;
    }
}
