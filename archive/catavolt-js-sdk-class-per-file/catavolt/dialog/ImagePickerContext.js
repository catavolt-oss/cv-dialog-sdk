/**
 * Created by rburson on 5/4/15.
 */
import { QueryContext } from "./QueryContext";
export class ImagePickerContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get imagePickerDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=ImagePickerContext.js.map