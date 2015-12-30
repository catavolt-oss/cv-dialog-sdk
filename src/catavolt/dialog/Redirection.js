/**
 * Created by rburson on 3/10/15.
 */
var OType_1 = require("./OType");
var Redirection = (function () {
    function Redirection() {
    }
    Redirection.fromWS = function (otype, jsonObj) {
        if (jsonObj && jsonObj['webURL']) {
            return OType_1.OType.deserializeObject(jsonObj, 'WSWebRedirection', OType_1.OType.factoryFn);
        }
        else if (jsonObj && jsonObj['workbenchId']) {
            return OType_1.OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', OType_1.OType.factoryFn);
        }
        else {
            return OType_1.OType.deserializeObject(jsonObj, 'WSDialogRedirection', OType_1.OType.factoryFn);
        }
    };
    return Redirection;
})();
exports.Redirection = Redirection;
