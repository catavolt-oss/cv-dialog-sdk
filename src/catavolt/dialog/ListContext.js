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
        var ListContext = (function (_super) {
            __extends(ListContext, _super);
            function ListContext(paneRef, offlineRecs, settings) {
                if (offlineRecs === void 0) { offlineRecs = []; }
                if (settings === void 0) { settings = {}; }
                _super.call(this, paneRef, offlineRecs, settings);
            }
            Object.defineProperty(ListContext.prototype, "columnHeadings", {
                get: function () {
                    return this.listDef.activeColumnDefs.map(function (cd) {
                        return cd.heading;
                    });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ListContext.prototype, "listDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            ListContext.prototype.rowValues = function (entityRec) {
                return this.listDef.activeColumnDefs.map(function (cd) {
                    return entityRec.valueAtName(cd.name);
                });
            };
            Object.defineProperty(ListContext.prototype, "style", {
                get: function () {
                    return this.listDef.style;
                },
                enumerable: true,
                configurable: true
            });
            return ListContext;
        })(dialog.QueryContext);
        dialog.ListContext = ListContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
