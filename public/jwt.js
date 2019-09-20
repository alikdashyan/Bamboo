var adminapp = angular.module('app',['ngRoute']);
app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
    .when('/admin',{
      templateUrl: 'view/admin/admin.html',
      controller:'adminCtrl'
    })
    .when('/adminpanel',{
      templateUrl: 'view/admin/adminview/adminpanel.html',
      controller: 'adminpanel'
    })
    .when('/formAbout',{
      templateUrl: 'view/admin/adminview/formAbout.html',
      controller: 'formAbout'
    })
    .when('/formContact',{
      templateUrl: 'view/admin/adminview/formContact.html',
      controller: 'formContact'
    })
    .when('/formFooter',{
      templateUrl: 'view/admin/adminview/formFooter.html',
    })
    .when('/formHome',{
      templateUrl: 'view/admin/adminview/formHome.html',
      controller:'formHome'
    })
    .when('/formServices',{
      templateUrl: 'view/admin/adminview/formServices.html',
      controller: 'formServices'
    })
    .otherwise({redirctTo:'/'})
}])
app.controller('adminCtrl',function($scope,$http,$location){
  if(localStorage.adminToken){
    $location.path('/adminpanel').replace();
  }
  $scope.submit = function(){
      console.log("Davo exav")
      $scope.loginError = '';
      $scope.loginPasswordError = '';
      let email = $scope.email;
      let password = $scope.password ;
      let body = JSON.stringify({
          email,
          password
      });

      $http.post('/users/login/admin', body).then(
            success => {
              let adminToken = success.data.adminToken;
              if(adminToken){
                localStorage.setItem('adminToken', adminToken);
                window.location.reload();
              }
            },
            innerError => {
              if(innerError.data){
                $scope.loginError = innerError.data.error;
              }
              console.log(innerError)
            }
            )
            .catch(error => console.log(error));
      }
})
app.controller('adminpanel',function($location){
  if(!localStorage.adminToken){
    $location.path('/').replace();
  }
})
app.controller('formHome',function($scope, $http){
  $http.get('/textData/readAll').then(
    success => {
      let textData = success.data;
      $scope.textData = textData;
      console.log(textData )
    },
    innerError => {
      console.log(innerError);
    }
    
  ).catch(error => console.log(error))
  $scope.updateData = function (id) {
    let heding = $scope.heding;
    let hedingSpan = $scope.hedingSpan;
    let descriotion = $scope.descriotion;
    let additionalDescription = $scope.additionalDescription;
    let callToAction = $scope.callToAction;
    let body = JSON.stringify(
      {
        heding,
        hedingSpan,
        descriotion,
        additionalDescription,
        callToAction
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        console.log(success)
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})
app.controller('formServices',function($scope,$http){
  $http.get('/textData/readAll').then(
    success => {
      let textData = success.data;
      $scope.textData = textData;
      console.log(textData )
    },
    innerError => {
      console.log(innerError);
    }
    
  ).catch(error => console.log(error))
  $scope.updateData = function (id) {
    let heding = $scope.heding;
    let hedingSpan = $scope.hedingSpan;
    let descriotion = $scope.descriotion;
    let additionalDescription = $scope.additionalDescription;
    let callToAction = $scope.callToAction;
    let body = JSON.stringify(
      {
        heding,
        hedingSpan,
        descriotion,
        additionalDescription,
        callToAction
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        console.log(success)
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})
app.controller('formAbout',function($scope,$http){
  $http.get('/textData/readAll').then(
    success => {
      let textData = success.data;
      $scope.textData = textData;
      console.log(textData )
    },
    innerError => {
      console.log(innerError);
    }
    
  ).catch(error => console.log(error))
  $scope.updateData = function (id) {
    let heding = $scope.heding;
    let hedingSpan = $scope.hedingSpan;
    let descriotion = $scope.descriotion;
    let additionalDescription = $scope.additionalDescription;
    let callToAction = $scope.callToAction;
    let body = JSON.stringify(
      {
        heding,
        hedingSpan,
        descriotion,
        additionalDescription,
        callToAction
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        console.log(success)
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})
app.controller('formContact', function($scope,$http){
  $http.get('/textData/readAll').then(
    success => {
      let textData = success.data;
      $scope.textData = textData;
      console.log(textData )
    },
    innerError => {
      console.log(innerError);
    }
    
  ).catch(error => console.log(error))
  $scope.updateData = function (id) {
    let heding = $scope.heding;
    let hedingSpan = $scope.hedingSpan;
    let descriotion = $scope.descriotion;
    let additionalDescription = $scope.additionalDescription;
    let callToAction = $scope.callToAction;
    let contactAdress = $scope.contactAdress;
    let contactPhone = $scope.contactPhone;
    let contactEmail = $scope.contactEmail;
    let body = JSON.stringify(
      {
        heding,
        hedingSpan,
        descriotion,
        additionalDescription,
        callToAction,
        contactAdress,
        contactPhone,
        contactEmail
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        console.log(success)
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})