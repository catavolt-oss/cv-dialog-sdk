import {Base64} from "../util";
import {DialogProxyTools} from "./DialogProxyTools";
import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class DialogVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('DialogVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
        if (!DialogProxyTools.isDialogModel(this._enclosedJsonObject)) {
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

    /**
     * The record id targeted by the root dialog (usually a Form) will be used to help derive new dialog ids for all.
     */
    public deriveDialogIdsFromDialogNameAndRecordId() {
        let dialogName = this.enclosedJsonObject()['dialogName'];
        if (!dialogName) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        let rootRecordId = null;
        const referringObject = this.visitReferringObject();
        if (DialogProxyTools.isReferringDialogModel(referringObject)) {
            rootRecordId = this.visitRecordId();
            if (rootRecordId) {
                const recordIdEncoded = Base64.encodeUrlSafeString(rootRecordId);
                dialogName = `${dialogName}@${recordIdEncoded}`;
            }
        }
        this.visitAndSetId(dialogName);
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                dialogVisitor.deriveDialogIdsFromDialogName(rootRecordId);
            }
        }
    }

    public propagateTenantIdAndSessionId(tenantId: string, sessionId: string) {
        this.enclosedJsonObject()['tenantId'] = tenantId;
        this.enclosedJsonObject()['sessionId'] = sessionId;
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                dialogVisitor.propagateTenantIdAndSessionId(tenantId, sessionId);
            }
        }
    }

    public visitDialogName(): string {
        return this.enclosedJsonObject().dialogName;
    }

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

    public visitAndSetId(id: string) {
        this.enclosedJsonObject().id = id;
    }

    public visitChildAt(index: number): DialogVisitor {
        return new DialogVisitor(this.enclosedJsonObject().children[index]);
    }

    public visitChildAtName(name: string): DialogVisitor {
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                if (dialogVisitor.visitDialogName() && dialogVisitor.visitDialogName() === name) {
                    return dialogVisitor;
                }
                const childDialogVisitor = dialogVisitor.visitChildAtName(name);
                if (childDialogVisitor) {
                    return childDialogVisitor;
                }
            }
        }
        return null;
    }

    public visitChildAtNameAndSetId(name: string, id: string): boolean {
        const childDialogVisitor = this.visitChildAtName(name);
        if (childDialogVisitor) {
            childDialogVisitor.visitAndSetId(id);
            return true;
        }
        return false;
    }

    public visitRecordId(): string {
        return this.enclosedJsonObject().recordId;
    }

    public visitReferringObject(): object {
        return this.enclosedJsonObject().referringObject;
    }

    private deriveDialogIdsFromDialogName(rootRecordId: string) {
        let dialogName = this.enclosedJsonObject()['dialogName'];
        if (!dialogName) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        if (rootRecordId) {
            const recordIdEncoded = Base64.encodeUrlSafeString(rootRecordId);
            dialogName = `${dialogName}@${recordIdEncoded}`;
        }
        this.visitAndSetId(dialogName);
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                dialogVisitor.deriveDialogIdsFromDialogName(rootRecordId);
            }
        }
    }

}
