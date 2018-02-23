import {DialogModeEnum, TypeNames} from "./types";
import {ReferringDialog} from "./ReferringDialog";

export class ReferringObject {

    public readonly type: string;
    public readonly actionId: string;

    public isDialogReferrer(): boolean {
        return this.type === TypeNames.ReferringDialogTypeName;
    }

    public isWorkbenchReferrer(): boolean {
        return this.type === TypeNames.ReferringWorkbenchTypeName;
    }

    public get sourceDestroyed(): boolean {
        if (this.isDialogReferrer()) {
            return this['dialogMode'] === DialogModeEnum.DESTROYED;
        } else {
            return false;
        }
    }

}
