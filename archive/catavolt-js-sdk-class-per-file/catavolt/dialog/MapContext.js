/**
 * Created by rburson on 5/4/15.
 */
import { QueryContext } from "./QueryContext";
export class MapContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get mapDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=MapContext.js.map