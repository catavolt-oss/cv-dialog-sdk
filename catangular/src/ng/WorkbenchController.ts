/**
 * Created by rburson on 5/6/15.
 */

///<reference path="../../../src/catavolt/references.ts"/>

module catavolt.ng {

    declare var PxLoader;

    export class WorkbenchController {

        constructor ($scope, $location, $rootScope, $timeout, Catavolt) {


            $scope.launchActions = [];

            var workbenches:Array<Workbench> = Catavolt.appWinDefTry.success.workbenches;
            var launchActions:Array<WorkbenchLaunchAction> = workbenches.length ? workbenches[0].workbenchLaunchActions : [];

            //preload images
            var loader = new PxLoader();
            loader.addCompletionListener(function() {
                addLaunchers(launchActions);
            });
            for (var i = 0; i < launchActions.length; i++) {
                loader.addImage(launchActions[i].iconBase);
            }
            loader.start();

            function addLaunchers(launchActions) {
                launchActions.forEach(function (item, i) {
                    $timeout(function () {
                        $scope.launchActions.push(item);
                    }, i*200);
                });
            }

            $scope.performLaunchAction = function(launchAction:WorkbenchLaunchAction) {
                Catavolt.performLaunchAction(launchAction).onComplete((launchTry:Try<NavRequest>)=>{
                    if(launchTry.isFailure) {
                        alert('Handle Launch Failure!');
                        Log.error(launchTry.failure);
                    } else {
                        if(launchTry.success instanceof FormContext) {
                            Log.info('Succeded with ' + launchTry.success);
                        } else {
                            alert('Unhandled type of NavRequest ' + launchTry.success);
                        }
                    }
                });
            }
        }

    }
}