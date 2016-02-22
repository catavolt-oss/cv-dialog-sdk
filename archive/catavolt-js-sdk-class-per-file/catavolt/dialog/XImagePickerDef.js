/**
 * Created by rburson on 4/1/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XImagePickerDef extends XPaneDef {
    constructor(paneId, name, title, URLProperty, defaultActionId) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.URLProperty = URLProperty;
        this.defaultActionId = defaultActionId;
    }
}
