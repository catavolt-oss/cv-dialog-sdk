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

    }
}