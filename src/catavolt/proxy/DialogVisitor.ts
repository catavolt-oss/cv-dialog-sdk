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

    public static visitAndSetId(dialog: object, id: string) {
        (new DialogVisitor(dialog)).visitAndSetId(id);
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
     * The record id targeted by the root dialog (usually a Form) will be used to help derive new dialog ids for the
     * root and all of its children. The derived dialog id is a concatenation of the dialogName with a '@' and the
     * root record id.
     */
    public deriveDialogIdsFromDialogNameAndRecordId() {
        let derivedDialogId = this.enclosedJsonObject()['dialogName'];
        if (!derivedDialogId) {
            throw new Error("Cannot derive dialog ids -- dialog name not found")
        }
        let rootRecordId = null;
        const referringObject = this.visitReferringObject();
        if (DialogProxyTools.isReferringDialogModel(referringObject)) {
            rootRecordId = this.visitRecordId();
            // TODO: Fix the error in Dialog Service that returns null record ids as a string literal of "null"
            if (rootRecordId && rootRecordId !== 'null') {
                const recordIdEncoded = Base64.encodeUrlSafeString(rootRecordId);
                derivedDialogId = `${derivedDialogId}@${recordIdEncoded}`;
            }
        }
        this.visitAndSetId(derivedDialogId);
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                dialogVisitor.deriveDialogIdsFromDialogName(rootRecordId);
            }
        }
    }

    /**
     * Traverse this dialog and its children and derive their dailog ids by concatenating each dialog's
     * dialogName with a '$' and the given suffix. Dialog ids ending withs a suffix are synthetic. Its possible
     * that a dialog id may have a suffix and a specific record id. In this case the dialog id will contain
     * a '$' and an '@' so that each field can be parsed separately.
     *
     * @param {string} suffix
     */
    public deriveDialogIdsFromDialogNameAndSuffix(suffix: string) {
        let derivedDialogId = this.enclosedJsonObject()['dialogName'];
        if (!derivedDialogId) {
            throw new Error("Cannot propagate dialog ids -- dialog name not found")
        }
        if (suffix) {
            derivedDialogId = derivedDialogId + '$' + suffix;
        }
        this.visitAndSetId(derivedDialogId);
        if (this.enclosedJsonObject()['children']) {
            for (const c of this.enclosedJsonObject()['children']) {
                const dialogVisitor = new DialogVisitor(c);
                dialogVisitor.deriveDialogIdsFromDialogNameAndSuffix(suffix);
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

    public visitDescription(): string {
        return this.enclosedJsonObject().description;
    }

    public visitAndSetDescription(description: string) {
        this.enclosedJsonObject().description = description;
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

    public visitAndSetRootDialogId(rootDialogId: string) {
        this.enclosedJsonObject().rootDialogId = rootDialogId;
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

    public visitAndSetRecordId(recordId: string) {
        this.enclosedJsonObject().recordId = recordId;
    }

    public visitReferringObject(): object {
        return this.enclosedJsonObject().referringObject;
    }

    public visitAndSetReferringDialogId(dialogId: string) {
        this.visitReferringObject()['dialogId'] = dialogId;
    }

    private deriveDialogIdsFromDialogName(rootRecordId: string) {
        let dialogName = this.enclosedJsonObject()['dialogName'];
        if (!dialogName) {
            throw new Error("Cannot propagate dialog name -- dialog name not found")
        }
        // TODO: Fix the error in Dialog Service that returns null record ids as a string literal of "null"
        if (rootRecordId && rootRecordId !== 'null') {
            const recordIdEncoded = Base64.encodeUrlSafeString(rootRecordId);
            dialogName = `${dialogName}@${recordIdEncoded}`;
        }


        if (rootRecordId) {
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
