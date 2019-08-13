var myApp = angular.module('myApp',['ngRoute']);
myApp.config(['$routeProvider',function ($routeProvider) {
  $routeProvider
    .when('/'),{
      redirectTo: '/home'
    }
    .when('/home',{
      templateUrl:'/template/home.html',
      controller:'homeController'
    })
    .when('/authenticated',{
      templateUrl:'/template/authenticated.html',
      controller:'authenticatedController'
    })
    .when('/authorize',{
      templateUrl:'/template/authorize.html',
      controller: 'authorizeController'
    })
    .when('/login',{
      templateUrl:'/template/login.html',
      controller:'loginController'
    })
    .when('/unauthorized',{
      templateUrl:'/template/unauthorized.html',
      controller:'unauthorizedController'
    })
}])
//global verivle for store service base path
myApp.constant('serviceBasePath','http://localhost:3000')
//controller
myApp.controller('homeController',['$scope',function($scope) {

}])
myApp.controller('authenticatedController',['$scope',function($scope) {

}])
myApp.controller('authorizeController',['$scope',function($scope) {

}]
}])
myApp.controller('loginController',['$scope',function($scope) {

}])
myApp.controller('unauthorizedController',['$scope',function($scope) {

}])
//service
myApp.factory('dataService',['$http','serviceBasePath',function ($http,serviceBasePath) {
  var fac = {};
  fac.GetAnonymousData = function () {
    return $http.get(serviceBasePath + '/signup').then(function (response) {
        return response.data;
    })
  }
}])
