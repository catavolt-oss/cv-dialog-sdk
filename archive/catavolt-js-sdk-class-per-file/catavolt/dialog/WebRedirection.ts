/**
 * Created by rburson on 3/27/15.
 */

import {StringDictionary} from "../util/Types";
import {Redirection} from "./Redirection";
import {NavRequest} from "./NavRequest";

export class WebRedirection extends Redirection implements NavRequest {

    constructor(private _webURL:string,
                private _open:boolean,
                private _dialogProperties:StringDictionary,
                private _fromDialogProperties:StringDictionary) {
        super();
    }

    get fromDialogProperties():StringDictionary {
        return this._fromDialogProperties;
    }

    set fromDialogProperties(props:StringDictionary) {
        this._fromDialogProperties = props;
    }


}
