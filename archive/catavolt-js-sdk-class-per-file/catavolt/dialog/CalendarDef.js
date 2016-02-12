/**
 * Created by rburson on 4/22/15.
 */
import { PaneDef } from "./PaneDef";
export class CalendarDef extends PaneDef {
    constructor(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
        super(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
        this._descriptionPropName = _descriptionPropName;
        this._initialStyle = _initialStyle;
        this._startDatePropName = _startDatePropName;
        this._startTimePropName = _startTimePropName;
        this._endDatePropName = _endDatePropName;
        this._endTimePropName = _endTimePropName;
        this._occurDatePropName = _occurDatePropName;
        this._occurTimePropName = _occurTimePropName;
        this._defaultActionId = _defaultActionId;
    }
    get descriptionPropName() {
        return this._descriptionPropName;
    }
    get initialStyle() {
        return this._initialStyle;
    }
    get startDatePropName() {
        return this._startDatePropName;
    }
    get startTimePropName() {
        return this._startTimePropName;
    }
    get endDatePropName() {
        return this._endDatePropName;
    }
    get endTimePropName() {
        return this._endTimePropName;
    }
    get occurDatePropName() {
        return this._occurDatePropName;
    }
    get occurTimePropName() {
        return this._occurTimePropName;
    }
    get defaultActionId() {
        return this._defaultActionId;
    }
}
//# sourceMappingURL=CalendarDef.js.map