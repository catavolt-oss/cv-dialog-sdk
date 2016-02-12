/**
 * Created by rburson on 3/27/15.
 */
import { Redirection } from "./Redirection";
export class WorkbenchRedirection extends Redirection {
    constructor(_workbenchId, _dialogProperties, _fromDialogProperties) {
        super();
        this._workbenchId = _workbenchId;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    get workbenchId() {
        return this._workbenchId;
    }
    get dialogProperties() {
        return this._dialogProperties;
    }
    get fromDialogProperties() {
        return this._fromDialogProperties;
    }
    set fromDialogProperties(props) {
        this._fromDialogProperties = props;
    }
}
//# sourceMappingURL=WorkbenchRedirection.js.map