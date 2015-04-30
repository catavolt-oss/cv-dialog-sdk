/**
 * Created by rburson on 4/27/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    enum QueryState { ACTIVE, DESTROYED }

    export class QueryContext extends PaneContext{

        private _lastQueryFr:Future<QueryResult>;
        private _queryState:QueryState;
        private _scroller:QueryScroller;

        constructor(paneRef:number, private _offlineRecs:Array<EntityRec>, private _settings:StringDictionary={}) {
            super(paneRef);
        }

    }
}