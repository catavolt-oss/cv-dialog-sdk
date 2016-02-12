/**
 * Created by rburson on 3/10/15.
 */
import { OType } from "./OType";
export class Redirection {
    static fromWS(otype, jsonObj) {
        if (jsonObj && jsonObj['webURL']) {
            return OType.deserializeObject(jsonObj, 'WSWebRedirection', OType.factoryFn);
        }
        else if (jsonObj && jsonObj['workbenchId']) {
            return OType.deserializeObject(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
        }
        else {
            return OType.deserializeObject(jsonObj, 'WSDialogRedirection', OType.factoryFn);
        }
    }
}
//# sourceMappingURL=Redirection.js.map