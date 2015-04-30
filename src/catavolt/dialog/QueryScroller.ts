/**
 * Created by rburson on 4/30/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export enum QueryMarkerOption {
        None, IsEmpty, HasMore
    }

    export class QueryScroller {

        private _buffer:Array<EntityRec>;
        private _hasMoreBackward:boolean;
        private _hasMoreForward:boolean;
        private _nextPageFr:Future<QueryResult>;
        private _prevPageFr:Future<QueryResult>;

        constructor(private _context:QueryContext,
                    private _pageSize:number,
                    private _firstObjectId:string,
                    private _markerOptions:Array<QueryMarkerOption>=[]) {

            this.clear();

        }

        private clear() {
            this._hasMoreBackward = !!this._firstObjectId;
            this._hasMoreForward = true;
            this._buffer = [];
        }

    }
}