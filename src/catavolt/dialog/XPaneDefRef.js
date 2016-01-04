/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var XPaneDefRef = (function () {
            function XPaneDefRef(name, paneId, title, type) {
                this.name = name;
                this.paneId = paneId;
                this.title = title;
                this.type = type;
            }
            return XPaneDefRef;
        })();
        dialog.XPaneDefRef = XPaneDefRef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
