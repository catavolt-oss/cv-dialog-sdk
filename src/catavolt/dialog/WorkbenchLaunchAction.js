/**
 * Created by rburson on 3/17/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var WorkbenchLaunchAction = (function () {
            function WorkbenchLaunchAction(id, workbenchId, name, alias, iconBase) {
                this.id = id;
                this.workbenchId = workbenchId;
                this.name = name;
                this.alias = alias;
                this.iconBase = iconBase;
            }
            Object.defineProperty(WorkbenchLaunchAction.prototype, "actionId", {
                get: function () {
                    return this.id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "fromActionSource", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WorkbenchLaunchAction.prototype, "virtualPathSuffix", {
                get: function () {
                    return [this.workbenchId, this.id];
                },
                enumerable: true,
                configurable: true
            });
            return WorkbenchLaunchAction;
        })();
        dialog.WorkbenchLaunchAction = WorkbenchLaunchAction;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
