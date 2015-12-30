/**
 * Created by rburson on 3/27/15.
 */

import {ActionSource} from "./ActionSource";

export class ContextAction implements ActionSource {

    constructor(public actionId:string,
                public objectId:string,
                public fromActionSource:ActionSource) {
    }

    get virtualPathSuffix():Array<string> {
        return [this.objectId, this.actionId];
    }
}
