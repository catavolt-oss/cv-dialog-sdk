/**
 * Created by rburson on 3/30/15.
 */

import {NavRequest} from "./NavRequest";
import {StringDictionary} from "../util/Types";

export class NullNavRequest implements NavRequest {

    fromDialogProperties:StringDictionary;

    constructor() {
        this.fromDialogProperties = {};
    }
}
