import {JsonObjectVisitor} from "./JsonObjectVisitor";

/**
 *
 */
export class RedirectionVisitor implements JsonObjectVisitor {

    private _enclosedJsonObject: any;

    constructor(value: string | object) {
        if (!value) {
            throw new Error('DialogRedirectionVisitor -- null value exception')
        }
        if (typeof value === 'string') {
            this._enclosedJsonObject = JSON.parse(value as string);
        } else {
            this._enclosedJsonObject = value;
        }
    }

    // --- State Management Helpers --- //

    // --- State Import/Export --- //

    public copyAsJsonObject(): object {
        return JSON.parse(this.copyAsJsonString());
    }

    public copyAsJsonString(): string {
        return JSON.stringify(this.enclosedJsonObject());
    }

    public enclosedJsonObject(): any {
        return this._enclosedJsonObject;
    }

    // --- State Management --- //

    public visitId(): string {
        return this.enclosedJsonObject().id;
    }

    public visitAndSetId(id: string) {
        this.enclosedJsonObject().id = id;
    }

    public visitReferringDialogId(): string {
        return this.visitReferringObject()['dialogId'];
    }

    public visitReferringDialogMode(): string {
        return this.visitReferringObject()['dialogMode'];
    }

    public visitAndSetReferringDialogAlias(dialogAlias: string) {
        this.visitReferringObject()['dialogAlias'] = dialogAlias;
    }

    public visitAndSetReferringDialogId(dialogId: string) {
        this.visitReferringObject()['dialogId'] = dialogId;
    }

    public visitAndSetReferringDialogMode(dialogMode: string) {
        this.visitReferringObject()['dialogMode'] = dialogMode;
    }

    public visitAndSetReferringDialogName(dialogName: string) {
        this.visitReferringObject()['dialogName'] = dialogName;
    }

    public visitReferringObject(): object {
        return this.enclosedJsonObject().referringObject;
    }

}
