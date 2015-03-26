/**
 * Created by rburson on 3/20/15.
 */
'use strict';

var catavoltSdk = angular.module('catavoltSdk', ['ngRoute', 'ngFx']);

catavoltSdk.config(['$routeProvider',
    function ($routeProvider, $http, $q, Catavolt) {
        $routeProvider.
            when('/', {templateUrl:'views/login.html', controller: 'LoginController'}).
            when('/main', {
                templateUrl:'views/main.html',
                controller: 'WorkbenchController'
            });
            //otherwise({redirectTo:'/'});
    }
]);

catavoltSdk.controller('LoginController', ['$scope', '$location', '$rootScope',
    'Catavolt', function($scope, $location, $rootScope, Catavolt) {


    $scope.creds = {tenantId:'***REMOVED***', gatewayUrl:'www.catavolt.net',
        userId:'sales', password:'***REMOVED***', clientType:'LIMITED_ACCESS'};
    $scope.loginMessage = "";

    $scope.login = function(creds){
        $scope.loginMessage = "";
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

catavoltSdk.controller('WorkbenchController', ['$scope', '$location', '$rootScope', '$timeout',
    'Catavolt', function($scope, $location, $rootScope, $timeout, Catavolt) {

        $scope.launchActions = [];

        function init() {
            var workbenches = Catavolt.appWinDefTry.success.workbenches;
            var launchActions = workbenches.length ? workbenches[0].workbenchLaunchActions : [];

            //preload images
            var loader = new PxLoader();
            loader.addCompletionListener(function() {
                addLaunchers(launchActions);
            });
            for (var i = 0; i < launchActions.length; i++) {
                loader.addImage(launchActions[i].iconBase);
            }
            loader.start();
        }

        function addLaunchers(launchActions) {
            launchActions.forEach(function (item, i) {
                $timeout(function () {
                    $scope.launchActions.push(item);
                }, i*200);
            });
        }

        init();
}]);


catavoltSdk.factory('Catavolt', function(){ return catavolt.dialog.AppContext.singleton; });


/*
,
resolve: {
    item: function ($http, $q, Catavolt) {
        var deferred = $q.defer();
        var loader = new PxLoader();
        loader.addCompletionListener(function(){
            deferred.resolve();
        });
        var workbenches = Catavolt.appWinDefTry.success.workbenches;
        var launchActions = workbenches.length ? workbenches[0].workbenchLaunchActions : [];
        for(var i=0; i<launchActions.length; i++){
            loader.addImage(launchActions[i].iconBase);
        }
        loader.start();
        return deferred.promise;
    }
}
    */