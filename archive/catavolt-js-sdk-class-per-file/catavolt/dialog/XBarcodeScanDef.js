/**
 * Created by rburson on 3/31/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XBarcodeScanDef extends XPaneDef {
    constructor(paneId, name, title) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
    }
}
