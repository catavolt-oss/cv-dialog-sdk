/**
 * Created by rburson on 5/5/15.
 */

///<reference path="../../../src/catavolt/references.ts"/>

module catavolt.ng {

    export class LoginController {

        constructor($scope,
                    $location,
                    $rootScope,
                    $timeout,
                    Catavolt)  {

            //prefill the form for now...
            $scope.creds = {tenantId:'***REMOVED***z', gatewayUrl:'www.catavolt.net',
                userId:'sales', password:'***REMOVED***', clientType:'LIMITED_ACCESS'};

            $scope.loginMessage = "";
            $scope.loggingIn = false;
            $scope.loggedIn = Catavolt.isLoggedIn;

            $scope.login = function (creds) {
                $scope.loginMessage = "";
                $scope.loggingIn = true;
                if (Catavolt.loggedIn) {
                    $scope.loggedIn = Catavolt.isLoggedIn;
                    $location.path('/main');
                } else {
                    Catavolt.login(creds.gatewayUrl, creds.tenantId, creds.clientType, creds.userId, creds.password)
                        .onComplete(function (appWinDefTry:Try<AppWinDef>) {
                            $rootScope.$apply(function () {
                                $scope.loggingIn = false;
                                if (appWinDefTry.isFailure) {
                                    $scope.loginMessage = "Invalid Login";
                                    $scope.loggedIn = Catavolt.isLoggedIn;
                                } else {
                                    $scope.loggedIn = Catavolt.isLoggedIn;
                                    $timeout(function() {
                                        $location.path('/main');
                                    }, 800);
                                }
                            });
                        });
                }
            }
        }


    }
}