/**
 * Created by rburson on 3/13/15.
 */
var AppWinDef = (function () {
    function AppWinDef(workbenches, appVendors, windowTitle, windowWidth, windowHeight) {
        this._workbenches = workbenches || [];
        this._applicationVendors = appVendors || [];
        this._windowTitle = windowTitle;
        this._windowWidth = windowWidth;
        this._windowHeight = windowHeight;
    }
    Object.defineProperty(AppWinDef.prototype, "appVendors", {
        get: function () {
            return this._applicationVendors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowHeight", {
        get: function () {
            return this._windowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowTitle", {
        get: function () {
            return this._windowTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "windowWidth", {
        get: function () {
            return this._windowWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppWinDef.prototype, "workbenches", {
        get: function () {
            return this._workbenches;
        },
        enumerable: true,
        configurable: true
    });
    return AppWinDef;
})();
exports.AppWinDef = AppWinDef;
