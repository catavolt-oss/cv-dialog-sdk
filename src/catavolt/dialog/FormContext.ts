/**
 * Created by rburson on 3/30/15.
 */

///<reference path="../references.ts"/>

module catavolt.dialog {

    export class FormContext {

        private _actionSource:ActionSource = null;

        get actionSource():ActionSource {
            return this._actionSource;
        }
    }
}
