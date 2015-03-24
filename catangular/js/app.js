/**
 * Created by rburson on 3/20/15.
 */
'use strict';

var catavoltSdk = angular.module('catavoltSdk', ['ngRoute']);

catavoltSdk.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {templateUrl:'views/login.html', controller: 'LoginController'}).
            when('/main', {templateUrl:'views/main.html', controller: 'WorkbenchController'});
            //otherwise({redirectTo:'/'});
    }
]);

catavoltSdk.controller('LoginController', ['$scope', '$location', '$rootScope',
    'Catavolt', function($scope, $location, $rootScope, Catavolt) {


    $scope.creds = {tenantId:'***REMOVED***', gatewayUrl:'www.catavolt.net',
        userId:'sales', password:'***REMOVED***', clientType:'LIMITED_ACCESS'};
    $scope.loginMessage = "";

    $scope.login = function(creds){
         Catavolt.login(creds.gatewayUrl, creds.tenantId, creds.clientType, creds.userId, creds.password)
             .onComplete(function(appWinDefTry){
                 $rootScope.$apply(function(){
                     if(appWinDefTry.isFailure) {
                        $scope.loginMessage = "Invalid Login";
                     }else{
                         $location.path('/main');
                     }
                 });
        });
    }

}]);

catavoltSdk.controller('WorkbenchController', ['$scope', '$location', '$rootScope',
    'Catavolt', function($scope, $location, $rootScope, Catavolt) {

        $scope.workbenches = Catavolt.appWinDefTry.success.workbenches;
        $scope.launchActions = $scope.workbenches.length ? $scope.workbenches[0].workbenchLaunchActions : [];

}]);


catavoltSdk.factory('Catavolt', function(){ return catavolt.dialog.AppContext.singleton; });