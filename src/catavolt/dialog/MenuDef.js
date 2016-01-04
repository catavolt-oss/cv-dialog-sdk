/**
 * Created by rburson on 3/30/15.
 */
///<reference path="../references.ts"/>
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var MenuDef = (function () {
            function MenuDef(_name, _type, _actionId, _mode, _label, _iconName, _directive, _menuDefs) {
                this._name = _name;
                this._type = _type;
                this._actionId = _actionId;
                this._mode = _mode;
                this._label = _label;
                this._iconName = _iconName;
                this._directive = _directive;
                this._menuDefs = _menuDefs;
            }
            Object.defineProperty(MenuDef.prototype, "actionId", {
                get: function () {
                    return this._actionId;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "directive", {
                get: function () {
                    return this._directive;
                },
                enumerable: true,
                configurable: true
            });
            MenuDef.prototype.findAtId = function (actionId) {
                if (this.actionId === actionId)
                    return this;
                var result = null;
                this.menuDefs.some(function (md) {
                    result = md.findAtId(actionId);
                    return result != null;
                });
                return result;
            };
            Object.defineProperty(MenuDef.prototype, "iconName", {
                get: function () {
                    return this._iconName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isPresaveDirective", {
                get: function () {
                    return this._directive && this._directive === 'PRESAVE';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isRead", {
                get: function () {
                    return this._mode && this._mode.indexOf('R') > -1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isSeparator", {
                get: function () {
                    return this._type && this._type === 'separator';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "isWrite", {
                get: function () {
                    return this._mode && this._mode.indexOf('W') > -1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "label", {
                get: function () {
                    return this._label;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "menuDefs", {
                get: function () {
                    return this._menuDefs;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "mode", {
                get: function () {
                    return this._mode;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MenuDef.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            return MenuDef;
        })();
        dialog.MenuDef = MenuDef;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
