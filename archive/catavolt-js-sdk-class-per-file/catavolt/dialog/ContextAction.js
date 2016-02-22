/**
 * Created by rburson on 3/27/15.
 */
export class ContextAction {
    constructor(actionId, objectId, fromActionSource) {
        this.actionId = actionId;
        this.objectId = objectId;
        this.fromActionSource = fromActionSource;
    }
    get virtualPathSuffix() {
        return [this.objectId, this.actionId];
    }
}
