/**
 * Created by rburson on 3/17/15.
 */

import {Redirection} from "./Redirection";
import {StringDictionary} from "../util/Types";

export class NullRedirection extends Redirection {

    constructor(public fromDialogProperties:StringDictionary) {
        super();
    }
}
