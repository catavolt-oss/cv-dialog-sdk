import {TypeNames} from "./types";

export class ObjectRef {
    constructor(readonly objectId: string, readonly description: string, readonly type: string = TypeNames.ObjectRefTypeName) {}

    public toString(): string {
        return this.objectId + ':' + this.description;
    }

    public static fromString(objectRef): ObjectRef {
        if(!objectRef) { return null; }
        const [objectId, description] = objectRef.split(':');
        return new ObjectRef(objectId, description);
    }
}
