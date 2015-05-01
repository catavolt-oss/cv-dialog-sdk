/**
 * Created by rburson on 4/30/15.
 */

///<reference path="../references.ts"/>

/* @TODO */
module catavolt.dialog {

    export class HasMoreQueryMarker extends NullEntityRec {
        static singleton = new HasMoreQueryMarker();
    }

    export class IsEmptyQueryMarker extends NullEntityRec {
        static singleton = new IsEmptyQueryMarker();
    }

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

        get buffer():Array<EntityRec> {
            return this._buffer;
        }

        get bufferWithMarkers():Array<EntityRec> {
            var result = ArrayUtil.copy(this._buffer);
            if (this.isComplete) {
                if (this._markerOptions.indexOf(QueryMarkerOption.IsEmpty) > -1 ) {
                    if (this.isEmpty){
                       result.push(IsEmptyQueryMarker.singleton);
                    }
                }
            } else if (this._markerOptions.indexOf(QueryMarkerOption.HasMore) > -1) {
                if(result.length === 0) {
                    result.push(HasMoreQueryMarker.singleton);
                } else {
                    if(this._hasMoreBackward) {
                       result.unshift(HasMoreQueryMarker.singleton)
                    }
                    if(this._hasMoreForward) {
                        result.push(HasMoreQueryMarker.singleton);
                    }
                }
            }
            return result;
        }

        get context():QueryContext {
            return this._context;
        }

        get firstObjectId():string {
            return this._firstObjectId;
        }

        get hasMoreBackward():boolean {
            return this._hasMoreBackward;
        }

        get hasMoreForward():boolean {
            return this._hasMoreForward;
        }

        get isComplete():boolean {
            return !this._hasMoreBackward && !this._hasMoreForward;
        }

        get isCompleteAndEmpty():boolean {
            return this.isComplete && this._buffer.length === 0;
        }

        get isEmpty():boolean {
            return this._buffer.length === 0;
        }

        pageBackward():Future<Array<EntityRec>> {
            if (!this._hasMoreBackward) {
                return Future.createSuccessfulFuture('QueryScroller::pageBackward',[]);
            }
            if(!this._prevPageFr || this._prevPageFr.isComplete) {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                this._prevPageFr = this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
            } else {
                this._prevPageFr = this._prevPageFr.bind((queryResult:QueryResult)=>{
                    var fromObjectId = this._buffer.length === 0 ? null : this._buffer[0].objectId;
                    return this._context.query(this._pageSize, QueryDirection.BACKWARD, fromObjectId);
                });
            }

            var beforeSize: number = this._buffer.length;

            return this._prevPageFr.map((queryResult:QueryResult)=>{
                var afterSize = beforeSize;
                this._hasMoreBackward = queryResult.hasMore;
                if(queryResult.entityRecs.length > 0) {
                    var newBuffer:Array<EntityRec> = [];
                    for(var i = queryResult.entityRecs.length - 1; i > -1; i--) {
                        newBuffer.push(queryResult.entityRecs[i]);
                    }
                    this._buffer.forEach((entityRec:EntityRec)=>{ newBuffer.push(entityRec)});
                    this._buffer = newBuffer;
                    afterSize = this._buffer.length;
                }
                return queryResult.entityRecs;
            });

        }

        pageForward():Future<Array<EntityRec>> {

            if (!this._hasMoreForward) {
                return Future.createSuccessfulFuture('QueryScroller::pageForward',[]);
            }
            if(!this._nextPageFr || this._nextPageFr.isComplete) {
                var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                this._nextPageFr = this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
            } else {
                this._nextPageFr = this._nextPageFr.bind((queryResult:QueryResult)=>{
                    var fromObjectId = this._buffer.length === 0 ? null : this._buffer[this._buffer.length - 1].objectId;
                    return this._context.query(this._pageSize, QueryDirection.FORWARD, fromObjectId);
                });
            }

            var beforeSize: number = this._buffer.length;

            return this._nextPageFr.map((queryResult:QueryResult)=>{
                var afterSize = beforeSize;
                this._hasMoreForward = queryResult.hasMore;
                if(queryResult.entityRecs.length > 0) {
                    var newBuffer:Array<EntityRec> = [];
                    this._buffer.forEach((entityRec:EntityRec)=>{ newBuffer.push(entityRec)});
                    queryResult.entityRecs.forEach((entityRec:EntityRec)=> { newBuffer.push(entityRec); });
                    this._buffer = newBuffer;
                    afterSize = this._buffer.length;
                }
                return queryResult.entityRecs;
            });
        }

        get pageSize():number {
            return this._pageSize;
        }

        refresh():Future<Array<EntityRec>> {
            this.clear();
            return this.pageForward().map((entityRecList:Array<EntityRec>)=>{
                this.context.lastRefreshTime = new Date();
                return entityRecList;
            });
        }

        trimFirst(n:number) {
            var newBuffer = [];
            for(var i = n; i < this._buffer.length; i++) {
                newBuffer.push(this._buffer[i]);
            }
            this._buffer = newBuffer;
            this._hasMoreBackward = true;
            if (this._buffer.length === 0) this._hasMoreForward = true;
        }

        trimLast(n:number) {
            var newBuffer = [];
            for(var i = 0; i < this._buffer.length - n; i++) {
                newBuffer.push(this._buffer[i]);
            }
            this._buffer = newBuffer;
            this._hasMoreForward = true;
            if (this._buffer.length === 0) this._hasMoreBackward = true;
        }

        private clear() {
            this._hasMoreBackward = !!this._firstObjectId;
            this._hasMoreForward = true;
            this._buffer = [];
        }

    }
}