/**
 * Created by rburson on 4/1/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XListDef extends XPaneDef {
    constructor(paneId, name, title, style, initialColumns, columnsStyle, overrideGML) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.style = style;
        this.initialColumns = initialColumns;
        this.columnsStyle = columnsStyle;
        this.overrideGML = overrideGML;
    }
    get graphicalMarkup() {
        return this.overrideGML;
    }
    set graphicalMarkup(graphicalMarkup) {
        this.overrideGML = graphicalMarkup;
    }
}
//# sourceMappingURL=XListDef.js.map