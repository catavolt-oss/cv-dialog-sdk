/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class GeoFixDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
    }
}
