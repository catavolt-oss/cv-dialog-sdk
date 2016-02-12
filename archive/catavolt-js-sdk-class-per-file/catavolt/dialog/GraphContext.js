/**
 * Created by rburson on 5/4/15.
 */
import { QueryContext } from "./QueryContext";
export class GraphContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get graphDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=GraphContext.js.map