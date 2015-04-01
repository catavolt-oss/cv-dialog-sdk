/**
 * Created by rburson on 3/10/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class Redirection {

        static fromWS<A>(otype:string, jsonObj):Try<A> {
            if (jsonObj && jsonObj['webURL']) {
                return OType.deserializeObject<A>(jsonObj, 'WSWebRedirection', OType.factoryFn);
            } else if (jsonObj && jsonObj['workbenchId']) {
                return OType.deserializeObject<A>(jsonObj, 'WSWorkbenchRedirection', OType.factoryFn);
            } else {
                return OType.deserializeObject<A>(jsonObj, 'WSDialogRedirection', OType.factoryFn);
            }
        }
    }

}
