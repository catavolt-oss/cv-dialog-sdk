import {JsonObjectVisitor} from "./JsonObjectVisitor";
import {DialogProxyTools} from "./DialogProxyTools";

/**
 *
 */
export class DialogVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isDialogObject(this._enclosedJsonObject)) {
            throw new Error("Object passed to DialogVisitor is not a Dialog");
        }
    }

    // --- State Management Helpers --- //

    public static propagateTenantIdAndSessionId(dialog: object, tenantId: string, sessionId: string) {
        (new DialogVisitor(dialog)).propagateTenantIdAndSessionId(tenantId, sessionId);
    }

    public static visitId(dialog: object): string {
        return (new DialogVisitor(dialog)).visitId();
    }

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject() {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public propagateTenantIdAndSessionId(tenantId: string, sessionId: string) {
        this.enclosedJsonObject()['tenantId'] = tenantId;
        this.enclosedJsonObject()['sessionId'] = sessionId;
        for (const c of this.enclosedJsonObject()['children']) {
            c['tenantId'] = tenantId;
            c['sessionId'] = sessionId;
        }
    }

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

}
