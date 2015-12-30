/**
 * Created by rburson on 3/10/15.
 */

import {Try} from "../fp/Try";
import {OType} from "./OType";
import {StringDictionary} from "../util/Types";
import {WebRedirection} from "./WebRedirection";
import {DialogRedirection} from "./DialogRedirection";
import {WorkbenchRedirection} from "./WorkbenchRedirection";

export class Redirection {

    static fromWS(otype:string, jsonObj):Try<Redirection> {
        if (jsonObj && jsonObj['webURL']) {
            return OType.deserializeObject<WebRedirection>(jsonObj, 'WSWebRedirection', OType.factoryFn);
        } else if (jsonObj && jsonObj['workbenchId']) {
            return OType.deserializeObject<WorkbenchRedirection>(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
        } else {
            return OType.deserializeObject<DialogRedirection>(jsonObj, 'WSDialogRedirection', OType.factoryFn);
        }
    }

    fromDialogProperties:StringDictionary;
}

