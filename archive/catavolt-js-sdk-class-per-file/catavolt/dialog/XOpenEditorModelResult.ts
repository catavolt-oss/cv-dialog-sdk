/**
 * Created by rburson on 4/1/15.
 */

import {XOpenDialogModelResult} from "./XOpenDialogModelResult";
import {EntityRecDef} from "./EntityRecDef";
import {XFormModel} from "./XFormModel";
import {DialogRedirection} from "./DialogRedirection";

export class XOpenEditorModelResult implements XOpenDialogModelResult {

    constructor(public editorRecordDef:EntityRecDef, public formModel:XFormModel) {
    }

    get entityRecDef():EntityRecDef {
        return this.editorRecordDef;
    }

    get formPaneId():string {
        return this.formModel.form.paneId;
    }

    get formRedirection():DialogRedirection {
        return this.formModel.form.redirection;
    }

}
