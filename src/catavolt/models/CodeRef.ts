export class CodeRef {
    constructor(readonly code: string, readonly description: string, readonly type: string) {}

    public toString(): string {
        return this.code + ':' + this.description;
    }
}
