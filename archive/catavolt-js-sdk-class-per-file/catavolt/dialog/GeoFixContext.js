/**
 * Created by rburson on 5/4/15.
 */
import { EditorContext } from "./EditorContext";
export class GeoFixContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get geoFixDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=GeoFixContext.js.map