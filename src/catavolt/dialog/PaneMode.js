/**
 * Created by rburson on 4/28/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        (function (PaneMode) {
            PaneMode[PaneMode["READ"] = 0] = "READ";
            PaneMode[PaneMode["WRITE"] = 1] = "WRITE";
        })(dialog.PaneMode || (dialog.PaneMode = {}));
        var PaneMode = dialog.PaneMode;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
