/**
 * Created by rburson on 5/4/15.
 */
import { QueryContext } from "./QueryContext";
export class CalendarContext extends QueryContext {
    constructor(paneRef) {
        super(paneRef);
    }
    get calendarDef() {
        return this.paneDef;
    }
}
//# sourceMappingURL=CalendarContext.js.map