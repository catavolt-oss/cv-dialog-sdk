/**
 * Created by rburson on 4/27/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PaneContext_1 = require("./PaneContext");
var Future_1 = require("../fp/Future");
var QueryResult_1 = require("./QueryResult");
var QueryScroller_1 = require("./QueryScroller");
var DialogService_1 = require("./DialogService");
var QueryScroller_2 = require("./QueryScroller");
var ContextAction_1 = require("./ContextAction");
var NavRequest_1 = require("./NavRequest");
var QueryState;
(function (QueryState) {
    QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
    QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
})(QueryState || (QueryState = {}));
(function (QueryDirection) {
    QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
    QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
})(exports.QueryDirection || (exports.QueryDirection = {}));
var QueryDirection = exports.QueryDirection;
var QueryContext = (function (_super) {
    __extends(QueryContext, _super);
    function QueryContext(paneRef, _offlineRecs, _settings) {
        if (_offlineRecs === void 0) { _offlineRecs = []; }
        if (_settings === void 0) { _settings = {}; }
        _super.call(this, paneRef);
        this._offlineRecs = _offlineRecs;
        this._settings = _settings;
    }
    Object.defineProperty(QueryContext.prototype, "entityRecDef", {
        get: function () {
            return this.paneDef.entityRecDef;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.isBinary = function (columnDef) {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyed", {
        get: function () {
            return this._queryState === QueryState.DESTROYED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "lastQueryFr", {
        get: function () {
            return this._lastQueryFr;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "offlineRecs", {
        get: function () {
            return this._offlineRecs;
        },
        set: function (offlineRecs) {
            this._offlineRecs = offlineRecs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "paneMode", {
        get: function () {
            return this._settings['paneMode'];
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.performMenuAction = function (menuDef, targets) {
        var _this = this;
        return DialogService_1.DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind(function (redirection) {
            var target = targets.length > 0 ? targets[0] : null;
            var ca = new ContextAction_1.ContextAction(menuDef.actionId, target, _this.actionSource);
            return NavRequest_1.NavRequestUtil.fromRedirection(redirection, ca, _this.sessionContext);
        }).map(function (navRequest) {
            _this._settings = PaneContext_1.PaneContext.resolveSettingsFromNavRequest(_this._settings, navRequest);
            if (_this.isDestroyedSetting) {
                _this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    };
    QueryContext.prototype.query = function (maxRows, direction, fromObjectId) {
        var _this = this;
        return DialogService_1.DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind(function (value) {
            var result = new QueryResult_1.QueryResult(value.entityRecs, value.hasMore);
            if (_this.lastRefreshTime === new Date(0)) {
                _this.lastRefreshTime = new Date();
            }
            return Future_1.Future.createSuccessfulFuture('QueryContext::query', result);
        });
    };
    QueryContext.prototype.refresh = function () {
        return this._scroller.refresh();
    };
    Object.defineProperty(QueryContext.prototype, "scroller", {
        get: function () {
            if (!this._scroller) {
                this._scroller = this.newScroller();
            }
            return this._scroller;
        },
        enumerable: true,
        configurable: true
    });
    QueryContext.prototype.setScroller = function (pageSize, firstObjectId, markerOptions) {
        this._scroller = new QueryScroller_1.QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    };
    //module level methods
    QueryContext.prototype.newScroller = function () {
        return this.setScroller(50, null, [QueryScroller_2.QueryMarkerOption.None]);
    };
    QueryContext.prototype.settings = function () {
        return this._settings;
    };
    Object.defineProperty(QueryContext.prototype, "isDestroyedSetting", {
        get: function () {
            var str = this._settings['destroyed'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isGlobalRefreshSetting", {
        get: function () {
            var str = this._settings['globalRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isLocalRefreshSetting", {
        get: function () {
            var str = this._settings['localRefresh'];
            return str && str.toLowerCase() === 'true';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryContext.prototype, "isRefreshSetting", {
        get: function () {
            return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
        },
        enumerable: true,
        configurable: true
    });
    return QueryContext;
})(PaneContext_1.PaneContext);
exports.QueryContext = QueryContext;
