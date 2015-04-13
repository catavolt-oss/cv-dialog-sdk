/**
 * Created by rburson on 3/10/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

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
    }

}
