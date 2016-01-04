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
        var DetailsContext = (function (_super) {
            __extends(DetailsContext, _super);
            function DetailsContext(paneRef) {
                _super.call(this, paneRef);
            }
            Object.defineProperty(DetailsContext.prototype, "detailsDef", {
                get: function () {
                    return this.paneDef;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DetailsContext.prototype, "printMarkupURL", {
                get: function () {
                    return this.paneDef.dialogRedirection.dialogProperties['formsURL'];
                },
                enumerable: true,
                configurable: true
            });
            return DetailsContext;
        })(dialog.EditorContext);
        dialog.DetailsContext = DetailsContext;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
