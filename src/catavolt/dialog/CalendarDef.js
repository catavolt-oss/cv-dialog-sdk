/**
 * Created by rburson on 4/22/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PaneDef_1 = require("./PaneDef");
var CalendarDef = (function (_super) {
    __extends(CalendarDef, _super);
    function CalendarDef(paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings, _descriptionPropName, _initialStyle, _startDatePropName, _startTimePropName, _endDatePropName, _endTimePropName, _occurDatePropName, _occurTimePropName, _defaultActionId) {
        _super.call(this, paneId, name, label, title, menuDefs, entityRecDef, dialogRedirection, settings);
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
    Object.defineProperty(CalendarDef.prototype, "descriptionPropName", {
        get: function () {
            return this._descriptionPropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "initialStyle", {
        get: function () {
            return this._initialStyle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startDatePropName", {
        get: function () {
            return this._startDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "startTimePropName", {
        get: function () {
            return this._startTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endDatePropName", {
        get: function () {
            return this._endDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "endTimePropName", {
        get: function () {
            return this._endTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurDatePropName", {
        get: function () {
            return this._occurDatePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "occurTimePropName", {
        get: function () {
            return this._occurTimePropName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CalendarDef.prototype, "defaultActionId", {
        get: function () {
            return this._defaultActionId;
        },
        enumerable: true,
        configurable: true
    });
    return CalendarDef;
})(PaneDef_1.PaneDef);
exports.CalendarDef = CalendarDef;
