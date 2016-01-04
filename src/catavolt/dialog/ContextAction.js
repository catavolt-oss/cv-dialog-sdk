/**
 * Created by rburson on 3/27/15.
 */
///<reference path="references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var ContextAction = (function () {
            function ContextAction(actionId, objectId, fromActionSource) {
                this.actionId = actionId;
                this.objectId = objectId;
                this.fromActionSource = fromActionSource;
            }
            Object.defineProperty(ContextAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.objectId, this.actionId];
                },
                enumerable: true,
                configurable: true
            });
            return ContextAction;
        })();
        dialog.ContextAction = ContextAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
