import { TypeNames } from './types';

export class CodeRef {
    constructor(readonly code: string, readonly description: string, readonly type: string = TypeNames.CodeRefTypeName) {}

    public toString(): string {
        return this.code + ':' + this.description;
    }

    public static fromString(codeRef): CodeRef {
        if(!codeRef) { return null; }
        const [code, description] = codeRef.split(':');
        return new CodeRef(code, description);
    }
}
