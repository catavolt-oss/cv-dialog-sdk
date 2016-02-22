/**
 * Created by rburson on 3/30/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XFormDef extends XPaneDef {
    constructor(borderStyle, formLayout, formStyle, name, paneId, title, headerDefRef, paneDefRefs) {
        super();
        this.borderStyle = borderStyle;
        this.formLayout = formLayout;
        this.formStyle = formStyle;
        this.name = name;
        this.paneId = paneId;
        this.title = title;
        this.headerDefRef = headerDefRef;
        this.paneDefRefs = paneDefRefs;
    }
}
