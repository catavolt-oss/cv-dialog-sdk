/**
 * Created by rburson on 3/27/15.
 */
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
exports.ContextAction = ContextAction;
