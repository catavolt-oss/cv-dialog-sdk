/**
 * Created by rburson on 5/4/15.
 */
import { EditorContext } from "./EditorContext";
export class DetailsContext extends EditorContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get detailsDef() {
        return this.paneDef;
    }
    get printMarkupURL() {
        return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
    }
}
