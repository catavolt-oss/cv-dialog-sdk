/**
 * Created by rburson on 3/27/15.
 */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var DialogHandle = (function () {
            function DialogHandle(handleValue, sessionHandle) {
                this.handleValue = handleValue;
                this.sessionHandle = sessionHandle;
            }
            return DialogHandle;
        })();
        dialog.DialogHandle = DialogHandle;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
