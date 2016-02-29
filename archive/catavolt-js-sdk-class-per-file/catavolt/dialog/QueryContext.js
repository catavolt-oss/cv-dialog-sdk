/**
 * Created by rburson on 4/27/15.
 */
import { PaneContext } from "./PaneContext";
import { Future } from "../fp/Future";
import { QueryResult } from "./QueryResult";
import { QueryScroller } from "./QueryScroller";
import { DialogService } from "./DialogService";
import { QueryMarkerOption } from "./QueryScroller";
import { ContextAction } from "./ContextAction";
import { NavRequestUtil } from "./NavRequest";
var QueryState;
(function (QueryState) {
    QueryState[QueryState["ACTIVE"] = 0] = "ACTIVE";
    QueryState[QueryState["DESTROYED"] = 1] = "DESTROYED";
})(QueryState || (QueryState = {}));
export var QueryDirection;
(function (QueryDirection) {
    QueryDirection[QueryDirection["FORWARD"] = 0] = "FORWARD";
    QueryDirection[QueryDirection["BACKWARD"] = 1] = "BACKWARD";
})(QueryDirection || (QueryDirection = {}));
export class QueryContext extends PaneContext {
    constructor(paneRef, _offlineRecs = [], _settings = {}) {
        super(paneRef);
        this._offlineRecs = _offlineRecs;
        this._settings = _settings;
    }
    get entityRecDef() {
        return this.paneDef.entityRecDef;
    }
    isBinary(columnDef) {
        var propDef = this.propDefAtName(columnDef.name);
        return propDef && (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
    }
    get isDestroyed() {
        return this._queryState === QueryState.DESTROYED;
    }
    get lastQueryFr() {
        return this._lastQueryFr;
    }
    get offlineRecs() {
        return this._offlineRecs;
    }
    set offlineRecs(offlineRecs) {
        this._offlineRecs = offlineRecs;
    }
    get paneMode() {
        return this._settings['paneMode'];
    }
    performMenuAction(menuDef, targets) {
        return DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId, targets, this.sessionContext).bind((redirection) => {
            var target = targets.length > 0 ? targets[0] : null;
            var ca = new ContextAction(menuDef.actionId, target, this.actionSource);
            return NavRequestUtil.fromRedirection(redirection, ca, this.sessionContext);
        }).map((navRequest) => {
            this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, navRequest);
            if (this.isDestroyedSetting) {
                this._queryState = QueryState.DESTROYED;
            }
            return navRequest;
        });
    }
    query(maxRows, direction, fromObjectId) {
        return DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows, fromObjectId, this.sessionContext).bind((value) => {
            var result = new QueryResult(value.entityRecs, value.hasMore);
            if (this.lastRefreshTime === new Date(0)) {
                this.lastRefreshTime = new Date();
            }
            return Future.createSuccessfulFuture('QueryContext::query', result);
        });
    }
    refresh() {
        return this._scroller.refresh();
    }
    get scroller() {
        if (!this._scroller) {
            this._scroller = this.newScroller();
        }
        return this._scroller;
    }
    setScroller(pageSize, firstObjectId, markerOptions) {
        this._scroller = new QueryScroller(this, pageSize, firstObjectId, markerOptions);
        return this._scroller;
    }
    //module level methods
    newScroller() {
        return this.setScroller(50, null, [QueryMarkerOption.None]);
    }
    settings() {
        return this._settings;
    }
    get isDestroyedSetting() {
        var str = this._settings['destroyed'];
        return str && str.toLowerCase() === 'true';
    }
    get isGlobalRefreshSetting() {
        var str = this._settings['globalRefresh'];
        return str && str.toLowerCase() === 'true';
    }
    get isLocalRefreshSetting() {
        var str = this._settings['localRefresh'];
        return str && str.toLowerCase() === 'true';
    }
    get isRefreshSetting() {
        return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
    }
}
