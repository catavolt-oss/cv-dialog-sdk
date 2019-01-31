import {EditorDialog} from "./EditorDialog";

export class FormDialog extends EditorDialog {

    get isRefreshNeeded(): boolean {
        return this.anyChildNeedsRefresh;
    }
}
