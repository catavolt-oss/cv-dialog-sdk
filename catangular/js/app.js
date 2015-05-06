/**
 * Created by rburson on 3/20/15.
 */
'use strict';

var catavoltSdk = angular.module('catavoltSdk', ['ngRoute', 'ngFx']);
catavoltSdk.config(['$routeProvider',
    function ($routeProvider, $http, $q, Catavolt) {
        $routeProvider.
            when('/', {templateUrl:'views/login.html', controller: 'LoginController'}).
            when('/main', { templateUrl:'views/main.html', controller: 'WorkbenchController'});
            //otherwise({redirectTo:'/'});
    }
]);
catavoltSdk.controller('LoginController', ['$scope', '$location', '$rootScope', '$timeout', 'Catavolt', catavolt.ng.LoginController]);
catavoltSdk.controller('WorkbenchController', ['$scope', '$location', '$rootScope', '$timeout', 'Catavolt', catavolt.ng.WorkbenchController]);
catavoltSdk.factory('Catavolt', function(){ return catavolt.dialog.AppContext.singleton; });
