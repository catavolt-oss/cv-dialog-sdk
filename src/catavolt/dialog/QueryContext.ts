/**
 * Created by rburson on 4/27/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    enum QueryState { ACTIVE, DESTROYED }

    export enum QueryDirection { FORWARD, BACKWARD }

    export class QueryContext extends PaneContext{

        private _lastQueryFr:Future<QueryResult>;
        private _queryState:QueryState;
        private _scroller:QueryScroller;

        constructor(paneRef:number, private _offlineRecs:Array<EntityRec>, private _settings:StringDictionary={}) {
            super(paneRef);
        }

        get entityRecDef():EntityRecDef {
            return this.paneDef.entityRecDef;
        }

        isBinary(columnDef:ColumnDef):boolean {
            var propDef = this.propDefAtName(columnDef.name);
            return propDef &&  (propDef.isBinaryType || (propDef.isURLType && columnDef.isInlineMediaStyle));
        }

        get isDestroyed():boolean {
            return this._queryState === QueryState.DESTROYED;
        }

        get lastQueryFr():Future<QueryResult> {
            return this._lastQueryFr;
        }

        get offlineRecs():Array<EntityRec> {
            return this._offlineRecs;
        }

        set offlineRecs(offlineRecs:Array<EntityRec>) {
            this._offlineRecs = offlineRecs;
        }

        get paneMode():string {
            return this._settings['paneMode'];
        }

        performMenuAction(menuDef:MenuDef, targets:Array<string>):Future<NavRequest> {
            return DialogService.performQueryAction(this.paneDef.dialogHandle, menuDef.actionId,
                targets, this.sessionContext).bind((redirection:Redirection)=>{
                    var target = targets.length > 0 ? targets[0] : null;
                    var ca:ContextAction = new ContextAction(menuDef.actionId, target, this.actionSource);
                    return NavRequest.Util.fromRedirection(redirection, ca, this.sessionContext);
                }).map((navRequest:NavRequest)=>{
                    this._settings = PaneContext.resolveSettingsFromNavRequest(this._settings, navRequest);
                    if(this.isDestroyedSetting) {
                        this._queryState = QueryState.DESTROYED;
                    }
                    return navRequest;
                });
        }

        query(maxRows:number, direction:QueryDirection, fromObjectId:string):Future<QueryResult> {
            return DialogService.queryQueryModel(this.paneDef.dialogHandle, direction, maxRows,
                fromObjectId, this.sessionContext).bind((value:XQueryResult)=>{
                    var result = new QueryResult(value.entityRecs, value.hasMore);
                    if(this.lastRefreshTime === new Date(0)) {
                        this.lastRefreshTime = new Date();
                    }
                    return Future.createSuccessfulFuture('QueryContext::query', result);
                });
        }

        private get isDestroyedSetting():boolean {
            var str = this._settings['destroyed'];
            return str && str.toLowerCase() === 'true';
        }

        private get isGlobalRefreshSetting():boolean {
            var str = this._settings['globalRefresh'];
            return str && str.toLowerCase() === 'true';
        }

        private get isLocalRefreshSetting():boolean {
            var str = this._settings['localRefresh'];
            return str && str.toLowerCase() === 'true';
        }

        private get isRefreshSetting():boolean {
            return this.isLocalRefreshSetting || this.isGlobalRefreshSetting;
        }

    }
}