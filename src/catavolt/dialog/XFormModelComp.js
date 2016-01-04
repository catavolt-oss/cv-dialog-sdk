/**
 * Created by rburson on 3/31/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XFormModelComp = (function () {
            function XFormModelComp(paneId, redirection, label, title) {
                this.paneId = paneId;
                this.redirection = redirection;
                this.label = label;
                this.title = title;
            }
            return XFormModelComp;
        })();
        dialog.XFormModelComp = XFormModelComp;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
