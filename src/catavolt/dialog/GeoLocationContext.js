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
        var GeoLocationContext = (function (_super) {
            __extends(GeoLocationContext, _super);
            function GeoLocationContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(GeoLocationContext.prototype, "geoLocationDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            return GeoLocationContext;
        })(dialog.EditorContext);
        dialog.GeoLocationContext = GeoLocationContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
