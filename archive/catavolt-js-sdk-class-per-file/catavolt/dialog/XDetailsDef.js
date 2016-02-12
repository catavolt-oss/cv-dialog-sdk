/**
 * Created by rburson on 3/30/15.
 */
import { XPaneDef } from "./XPaneDef";
/*
 @TODO

 Note! Use this as a test example!
 It has an Array of Array with subitems that also have Array of Array!!
 */
export class XDetailsDef extends XPaneDef {
    constructor(paneId, name, title, cancelButtonText, commitButtonText, editable, focusPropertyName, overrideGML, rows) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.cancelButtonText = cancelButtonText;
        this.commitButtonText = commitButtonText;
        this.editable = editable;
        this.focusPropertyName = focusPropertyName;
        this.overrideGML = overrideGML;
        this.rows = rows;
    }
    get graphicalMarkup() {
        return this.overrideGML;
    }
}
//# sourceMappingURL=XDetailsDef.js.map