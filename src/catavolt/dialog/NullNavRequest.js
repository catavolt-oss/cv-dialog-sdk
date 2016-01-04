/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var NullNavRequest = (function () {
            function NullNavRequest() {
                this.fromDialogProperties = {};
            }
            return NullNavRequest;
        })();
        dialog.NullNavRequest = NullNavRequest;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
