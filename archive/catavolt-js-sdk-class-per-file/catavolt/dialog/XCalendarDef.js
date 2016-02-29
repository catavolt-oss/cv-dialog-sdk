/**
 * Created by rburson on 3/31/15.
 */
import { XPaneDef } from "./XPaneDef";
export class XCalendarDef extends XPaneDef {
    constructor(paneId, name, title, descriptionProperty, initialStyle, startDateProperty, startTimeProperty, endDateProperty, endTimeProperty, occurDateProperty, occurTimeProperty) {
        super();
        this.paneId = paneId;
        this.name = name;
        this.title = title;
        this.descriptionProperty = descriptionProperty;
        this.initialStyle = initialStyle;
        this.startDateProperty = startDateProperty;
        this.startTimeProperty = startTimeProperty;
        this.endDateProperty = endDateProperty;
        this.endTimeProperty = endTimeProperty;
        this.occurDateProperty = occurDateProperty;
        this.occurTimeProperty = occurTimeProperty;
    }
}
