/**
 * Created by rburson on 3/27/15.
 */
import { Redirection } from "./Redirection";
export class WebRedirection extends Redirection {
    constructor(_webURL, _open, _dialogProperties, _fromDialogProperties) {
        super();
        this._webURL = _webURL;
        this._open = _open;
        this._dialogProperties = _dialogProperties;
        this._fromDialogProperties = _fromDialogProperties;
    }
    get fromDialogProperties() {
        return this._fromDialogProperties;
    }
    set fromDialogProperties(props) {
        this._fromDialogProperties = props;
    }
}
