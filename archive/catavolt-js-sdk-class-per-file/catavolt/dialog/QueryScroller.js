/**
 * Created by rburson on 4/30/15.
 */
import { NullEntityRec } from "./NullEntityRec";
import { Future } from "../fp/Future";
import { ArrayUtil } from "../util/ArrayUtil";
import { QueryDirection } from "./QueryContext";
export class HasMoreQueryMarker extends NullEntityRec {
}
HasMoreQueryMarker.singleton = new HasMoreQueryMarker();
export class IsEmptyQueryMarker extends NullEntityRec {
}
IsEmptyQueryMarker.singleton = new IsEmptyQueryMarker();
export var QueryMarkerOption;
(function (QueryMarkerOption) {
    QueryMarkerOption[QueryMarkerOption["None"] = 0] = "None";
    QueryMarkerOption[QueryMarkerOption["IsEmpty"] = 1] = "IsEmpty";
    QueryMarkerOption[QueryMarkerOption["HasMore"] = 2] = "HasMore";
})(QueryMarkerOption || (QueryMarkerOption = {}));
export class QueryScroller {
    constructor(_context, _pageSize, _firstObjectId, _markerOptions = []) {
        this._context = _context;
        this._pageSize = _pageSize;
        this._firstObjectId = _firstObjectId;
        this._markerOptions = _markerOptions;
        this.clear();
    }
    get buffer() {
        return this._buffer;
    }
    get bufferWithMarkers() {
        var result = ArrayUtil.copy(this._buffer);
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
    }
    get context() {
        return this._context;
    }
    get firstObjectId() {
        return this._firstObjectId;
    }
    get hasMoreBackward() {
        return this._hasMoreBackward;
    }
    get hasMoreForward() {
        return this._hasMoreForward;
    }
    get isComplete() {
        return !this._hasMoreBackward && !this._hasMoreForward;
    }
    get isCompleteAndEmpty() {
        return this.isComplete && this._buffer.length === 0;
    }
    get isEmpty() {
        return this._buffer.length === 0;
    }
    pageBackward() {
        if (!this._hasMoreBackward) {
            return Future.createSuccessfulFuture('QueryScroller::pageBackward', []);
        }
        if (!this._prevPageFr || this._prevPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
            this._prevPageFr = this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
        }
        else {
            this._prevPageFr = this._prevPageFr.bind((queryResult) => {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                return this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._prevPageFr.map((queryResult) => {
            var afterSize = beforeSize;
            this._hasMoreBackward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                for (var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                    newBuffer.push(queryResult.entityRecs[i]);
                }
                this._buffer.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    }
    pageForward() {
        if (!this._hasMoreForward) {
            return Future.createSuccessfulFuture('QueryScroller::pageForward', []);
        }
        if (!this._nextPageFr || this._nextPageFr.isComplete) {
            var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
            this._nextPageFr = this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
        }
        else {
            this._nextPageFr = this._nextPageFr.bind((queryResult) => {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                return this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
            });
        }
        var beforeSize = this._buffer.length;
        return this._nextPageFr.map((queryResult) => {
            var afterSize = beforeSize;
            this._hasMoreForward = queryResult.hasMore;
            if (queryResult.entityRecs.length > 0) {
                var newBuffer = [];
                this._buffer.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                queryResult.entityRecs.forEach((entityRec) => {
                    newBuffer.push(entityRec);
                });
                this._buffer = newBuffer;
                afterSize = this._buffer.length;
            }
            return queryResult.entityRecs;
        });
    }
    get pageSize() {
        return this._pageSize;
    }
    refresh() {
        this.clear();
        return this.pageForward().map((entityRecList) => {
            this.context.lastRefreshTime = new Date();
            return entityRecList;
        });
    }
    trimFirst(n) {
        var newBuffer = [];
        for (var i = n; i < this._buffer.length; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreBackward = true;
        if (this._buffer.length === 0)
            this._hasMoreForward = true;
    }
    trimLast(n) {
        var newBuffer = [];
        for (var i = 0; i < this._buffer.length - n; i++) {
            newBuffer.push(this._buffer[i]);
        }
        this._buffer = newBuffer;
        this._hasMoreForward = true;
        if (this._buffer.length === 0)
            this._hasMoreBackward = true;
    }
    clear() {
        this._hasMoreBackward = !!this._firstObjectId;
        this._hasMoreForward = true;
        this._buffer = [];
    }
}
