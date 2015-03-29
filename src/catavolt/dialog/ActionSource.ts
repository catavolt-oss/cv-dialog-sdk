/**
 * Created by rburson on 3/27/15.
 */

///<reference path="references.ts"/>

module catavolt.dialog {

    export interface ActionSource {
        fromActionSource():ActionSource;
        virtualPathSuffix():Array<string>;
    }

}