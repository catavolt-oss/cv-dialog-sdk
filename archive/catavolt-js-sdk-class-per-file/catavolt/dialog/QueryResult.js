/**
 * Created by rburson on 4/30/15.
 */
export class QueryResult {
    constructor(entityRecs, hasMore) {
        this.entityRecs = entityRecs;
        this.hasMore = hasMore;
    }
}
