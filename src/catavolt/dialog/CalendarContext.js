/**
 * Created by rburson on 5/4/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var CalendarContext = (function (_super) {
            __extends(CalendarContext, _super);
            function CalendarContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(CalendarContext.prototype, "calendarDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return CalendarContext;
        })(dialog.QueryContext);
        dialog.CalendarContext = CalendarContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
