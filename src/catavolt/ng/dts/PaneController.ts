/**
 * Created by rburson on 5/6/15.
 */

///<reference path="../references.ts"/>

module catavolt.ng {

    export class PaneController {

        constructor($scope, $location, $rootScope, $timeout, Catavolt) {
        }

    }

    export class FormController extends PaneController{

        constructor($scope, $location, $rootScope, $timeout, Catavolt) {
            super($scope, $location, $rootScope, $timeout, Catavolt);

        }

    }
}