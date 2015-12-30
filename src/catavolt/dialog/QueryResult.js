/**
 * Created by rburson on 4/30/15.
 */
var QueryResult = (function () {
    function QueryResult(entityRecs, hasMore) {
        this.entityRecs = entityRecs;
        this.hasMore = hasMore;
    }
    return QueryResult;
})();
exports.QueryResult = QueryResult;
