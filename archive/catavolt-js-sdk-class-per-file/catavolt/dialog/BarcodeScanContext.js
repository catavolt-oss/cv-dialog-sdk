/**
 * Created by rburson on 5/4/15.
 */
import { EditorContext } from "./EditorContext";
export class BarcodeScanContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get barcodeScanDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=BarcodeScanContext.js.map