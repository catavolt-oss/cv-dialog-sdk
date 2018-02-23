export class ObjectRef {

    constructor(readonly objectId: string, readonly description: string, readonly type: string) {
    }

    public toString(): string {
        return this.objectId + ":" + this.description;
    }

}
