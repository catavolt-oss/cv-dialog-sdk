/**
 * Created by rburson on 5/4/15.
 */
import { QueryContext } from "./QueryContext";
export class ListContext extends QueryContext {
    constructor(paneRef, offlineRecs = [], settings = {}) {
        super(paneRef, offlineRecs, settings);
    }
    get columnHeadings() {
        return this.listDef.activeColumnDefs.map((cd) => {
            return cd.heading;
        });
    }
    get listDef() {
        return this.paneDef;
    }
    rowValues(entityRec) {
        return this.listDef.activeColumnDefs.map((cd) => {
            return entityRec.valueAtName(cd.name);
        });
    }
    get style() {
        return this.listDef.style;
    }
}
