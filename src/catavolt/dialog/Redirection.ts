/**
 * Created by rburson on 3/10/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class Redirection {

        static fromWSRedirection(jsonObject:StringDictionary):Try<Redirection> {

            return DialogTriple.extractValue(jsonObject, 'WSRedirection',
                ()=>{
                    return DialogTriple.fromWSDialogObject<Try<DialogRedirection>>(jsonObject, 'WSRedirection', OType.factoryFn);
                });
        }


    }
}
