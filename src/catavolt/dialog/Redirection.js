/**
 * Created by rburson on 3/10/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var Redirection = (function () {
            function Redirection() {
            }
            Redirection.fromWS = function (otype, jsonObj) {
                if (jsonObj && jsonObj['webURL']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWebRedirection', dialog.OType.factoryFn);
                }
                else if (jsonObj && jsonObj['workbenchId']) {
                    return dialog.OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', dialog.OType.factoryFn);
                }
                else {
                    return dialog.OType.deserializeObject(jsonObj, 'WSDialogRedirection', dialog.OType.factoryFn);
                }
            };
            return Redirection;
        })();
        dialog.Redirection = Redirection;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
