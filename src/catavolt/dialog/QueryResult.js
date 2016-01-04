/**
 * Created by rburson on 4/30/15.
 */
///<reference path="../references.ts"/>
/* @TODO */
var catavolt;
(function (catavolt) {
    var dialog;
    (function (dialog) {
        var QueryResult = (function () {
            function QueryResult(entityRecs, hasMore) {
                this.entityRecs = entityRecs;
                this.hasMore = hasMore;
            }
            return QueryResult;
        })();
        dialog.QueryResult = QueryResult;
    })(dialog = catavolt.dialog || (catavolt.dialog = {}));
})(catavolt || (catavolt = {}));
