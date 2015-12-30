/**
 * Created by rburson on 4/30/15.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NullEntityRec_1 = require("./NullEntityRec");
var Future_1 = require("../fp/Future");
var ArrayUtil_1 = require("../util/ArrayUtil");
var QueryContext_1 = require("./QueryContext");
var HasMoreQueryMarker = (function (_super) {
    __extends(HasMoreQueryMarker, _super);
    function HasMoreQueryMarker() {
        _super.apply(this, arguments);
    }
    HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
    return HasMoreQueryMarker;
})(NullEntityRec_1.NullEntityRec);
exports.HasMoreQueryMarker = HasMoreQueryMarker;
var IsEmptyQueryMarker = (function (_super) {
    __extends(IsEmptyQueryMarker, _super);
    function IsEmptyQueryMarker() {
        _super.apply(this, arguments);
    }
    IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
    return IsEmptyQueryMarker;
})(NullEntityRec_1.NullEntityRec);
exports.IsEmptyQueryMarker = IsEmptyQueryMarker;
(function (QueryMarkerOption) {
    QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
    QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
    QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
})(exports.QueryMarkerOption || (exports.QueryMarkerOption = {}));
var QueryMarkerOption = exports.QueryMarkerOption;
var QueryScroller = (function () {
    function QueryScroller(_context, _pageSize, _firstObjectId, _markerOptions) {
        if (_markerOptions === void 0) { _markerOptions = []; }
        this._context = _context;
        this._pageSize = _pageSize;
        this._firstObjectId = _firstObjectId;
        this._markerOptions = _markerOptions;
        this.clear();
    }
    Object.defineProperty(QueryScroller.prototype, "buffer", {
        get: function () {
            return this._buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "bufferWithMarkers", {
        get: function () {
            var result = ArrayUtil_1.ArrayUtil.copy(this._buffer);
            if (this.isComplete) {
                if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1) {
                    if (this.isEmpty) {
                        result.push(IsEmptyQueryMarker.singleton);
                    }
                }
            }
            else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
                if (result.length === 0) {
                    result.push(HasMoreQueryMarker.singleton);
                }
                else {
                    if (this._hasMoreBackward) {
                        result.unshift(HasMoreQueryMarker.singleton);
                    }
                    if (this._hasMoreForward) {
                        result.push(HasMoreQueryMarker.singleton);
                    }
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "context", {
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "firstObjectId", {
        get: function () {
            return this._firstObjectId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreBackward", {
        get: function () {
            return this._hasMoreBackward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "hasMoreForward", {
        get: function () {
            return this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isComplete", {
        get: function () {
            return !this._hasMoreBackward && !this._hasMoreForward;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isCompleteAndEmpty", {
        get: function () {
            return this.isComplete && this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryScroller.prototype, "isEmpty", {
        get: function () {
            return this._buffer.length === 0;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.pageBackward = function () {
        var _this = this;
        if (!this._hasMoreBackward) {
            return Future_1.Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, QueryContext_1.QueryDirection.BACKWARD, fromObjectId);
        }
        else {
            this._prevPageFr = this._prevPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[0].objectId;
                return _this._context.query(_this._pageSize, QueryContext_1.QueryDirection.BACKWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._prevPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    QueryScroller.prototype.pageForward = function () {
        var _this = this;
        if (!this._hasMoreForward) {
            return Future_1.Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, QueryContext_1.QueryDirection.FORWARD, fromObjectId);
        }
        else {
            this._nextPageFr = this._nextPageFr.bind(function (queryResult) {
                var fromObjectId = _this._buffer.length === 0 ? null : _this._buffer[_this._buffer.length - 1].objectId;
                return _this._context.query(_this._pageSize, QueryContext_1.QueryDirection.FORWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._nextPageFr.map(function (queryResult) {
            var afterSize = beforeSize;
            _this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                _this._buffer.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                queryResult.entityRecs.forEach(function (entityRec) {
                    newBuffer.push(entityRec);
                });
                _this._buffer = newBuffer;
                afterSize = _this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    };
    Object.defineProperty(QueryScroller.prototype, "pageSize", {
        get: function () {
            return this._pageSize;
        },
        enumerable: true,
        configurable: true
    });
    QueryScroller.prototype.refresh = function () {
        var _this = this;
        this.clear();
        return this.pageForward().map(function (entityRecList) {
            _this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    };
    QueryScroller.prototype.trimFirst = function (n) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
        if (this._buffer.length === 0)
            this._hasMoreForward = true;
    };
    QueryScroller.prototype.trimLast = function (n) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
        if (this._buffer.length === 0)
            this._hasMoreBackward = true;
    };
    QueryScroller.prototype.clear = function () {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
    };
    return QueryScroller;
})();
exports.QueryScroller = QueryScroller;
