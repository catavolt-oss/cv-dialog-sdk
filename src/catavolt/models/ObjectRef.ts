import {TypeNames} from "./types";

export class ObjectRef {
    constructor(readonly objectId: string, readonly description: string, readonly type: string = TypeNames.ObjectRefTypeName) {}

    public toString(): string {
        return this.objectId + ':' + this.description;
    }
}
