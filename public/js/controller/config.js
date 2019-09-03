var app = angular.module('app',['ngRoute','angularUtils.directives.dirPagination']);
app.config(['$routeProvider',function($routeProvider){

    $routeProvider
    .when('/',{
        templateUrl:'view/home.html',
        controller: 'homeCtrl'
    
    })
    .when('/services',{
        templateUrl:'view/page-services.html',
        controller: 'pageCtrl'
    })
    .when('/blog',{
        templateUrl:'view/blog-grid-3-columns.html',   
        controller: 'blogCtrl' 
    }) 
    .when('/about',{
        templateUrl:'view/about-us-advanced.html', 
        controller: "aboutCtrl"   
    })
    .when('/contact',{
        templateUrl:'view/contact-us.html',
        controller: 'contactCtrl'
    })   
    .when('/login',{
        templateUrl:'view/page-login.html',    
        controller: 'authCtrl'
      })
    .when('/blog/:postId',{
        templateUrl: 'view/blog-post.html',
        controller: 'postCtrl',
    })
    .when('/formsUserProfile',{
      templateUrl: 'view/forms-user-profile.html',
      controller: 'formCntrl'
    })
    .when('/profile', {
      templateUrl: 'view/profile.html',
      controller: 'profileCntrl'
    })
    .when('/userTable',{
      templateUrl: 'view/user-tables.html',
      controller: 'tableCtrl'
    })
    .otherwise({redirctTo:'/'})
}])
app.controller('homeCtrl', function ($scope) {

    $('#revolutionSlider').show().revolution();

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';


    }
})
app.controller('pageCtrl', function ($scope) {

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }

})
app.controller('blogCtrl',function ($scope, postsFactory) {

    $scope.posts = postsFactory;
    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
})
app.controller('aboutCtrl',function($scope){
  $(function() {
      $('[data-plugin-counter]:not(.manual), .counters [data-to]').each(function() {
          var $this = $(this),
              opts;

          var pluginOptions = theme.fn.getOptions($this.data('plugin-options'));
          if (pluginOptions)
              opts = pluginOptions;

          $this.themePluginCounter(opts);
      });
  });
  let animations = document.getElementsByClassName('appear-animation');

  for (let index = 0; index < animations.length; index++) {
    const element = animations[index];
    const opacity =  element.style.opacity;
    if(opacity != '1')
      element.style.opacity = '1';
  }
})
app.controller('contactCtrl', function ($scope) {

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
})
app.controller('authCtrl', function($scope, $http, $location) {
    if(localStorage.token){
      $location.path('/profile').replace();
    }
    $scope.submit = function(){

      let email = $scope.email;
      let password = $scope.password;
      let body = JSON.stringify({
          email,
          password
      });
      // const httpOptions = {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.token}`
      //   }
      // }
        $http.post('http://www.amzbamboo.com/users/login', body,{headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
            success => {
              let token = success.data.token;
              if(token){
                localStorage.setItem('token', token);
                window.location.reload();
              }
            },
            innerError => {
              if(innerError.data){
                $scope.loginError = innerError.data.error;
              }
              
            }
            )
            .catch(error => console.log(error));
      }
      $scope.registerSubmit = function() {
        $scope.authError = '';
        $scope.passwordError = '';
        let name = $scope.regName;
        let lastName = $scope.regLastName;
        let email = $scope.regEmail;
        let password = $scope.regPassword === $scope.regPasswordRepeat ? $scope.regPassword : $scope.passwordError = 'Password didnt match';

        let regBody = {
          name,
          lastName,
          email,
          password,
        }
        
        let stringifiedBody = JSON.stringify(regBody);
        let checked = document.querySelector('label[for="terms"]');
        let submitBUtton = document.querySelector('input[disabled="disabled"]');

        if(password != $scope.passwordError ){
          regRequest();
        }
        // const httpOptions = {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.token}`
        //   }
        // }
        function regRequest() {
          $http.post('http://www.amzbamboo.com/users/signup',stringifiedBody,{headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
            success => {
              let token = success.data.token;
              if(token){
                localStorage.setItem('token', token);
                $location.path('/profile').replace();
              }
            },
            innerError => {
              if(innerError){
                $scope.authError = innerError.data.error;
              }
            })      
        }
      }

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
  })
app.controller('postCtrl', function ($scope, $routeParams,postsFactory) {
    console.log($routeParams.postId);
    $scope.postId = $routeParams.postId

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
})

app.controller('formCntrl', function($scope, $http,$location) {
  if(!localStorage.token){
    $location.path('/').replace();
  }
  // const headers = new Headers()
  // headers.append('Authorization', `Bearer ${localStorage.token}`)
  // const httpOptions = {
  //   header: headers
  // }
  $scope.submitOrder = function(){
    let productLink = $scope.productLink;
    let buyingsPerDay = $scope.buyingsPerDay;
    let itemPrice = $scope.itemPrice;
    let totalBuyingSummary = $scope.totalBuyingSummary;
    let additionalInfo = $scope.additionalInfo;
    let body = {
      productLink,
      buyingsPerDay,
      itemPrice,
      totalBuyingSummary,
      additionalInfo,
    }
    let stringifiedBody = JSON.stringify(body);
    $http.post('http://www.amzbamboo.com/order',stringifiedBody, {headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
      success => {
        let token = success.data.token;
              if(token){
                localStorage.setItem('token', token);
              }
        console.log(success);
      },
      innerError => {
        if(innerError.data){
          $scope.orderError = innerError.error;
        }
      }
    )
  }
 
})
app.controller('tableCtrl', function($scope,$http,$location){
  if(!localStorage.token){
    $location.path('/').replace();
  }
  // const httpOptions = {
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.token}`
  //   }
  // }
  $http.get('http://www.amzbamboo.com/orders', {headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
    success => {
      let bambooData = success.data;
      $scope.viewData = bambooData;
      console.log(bambooData);
      
    },
    innerError => {
      console.log(innerError);
    }
  )
})
app.controller('profileCntrl', function($scope, $location){
  if(!localStorage.token){
    $location.path('/').replace();
  }
  let firstName =$scope.firstName;
  let lastName = $scope.lastName;
  let email = $scope.email;
  let company  = $scope.company;
  let website = $scope.website;
  let address = {
    street : $scope.street,
    city : $scope.city,
    state : $scope.state
  }
  let timeZone = {

  }
  let userName = $scope.userName;
  let password = $scope.password;
  let confirmPassword = $scope.confirmPassword;

  let profileBody = {
    firstName,
    lastName,
    email,
    company,
    website,
    address,
    timeZone,
    userName,
    password,
    confirmPassword
  }
  
})

app.controller('HeaderCtrl', function($scope){
      if(localStorage.token) $scope.token = localStorage.token;

      // $scooe.checkLogAuth = function (token) {
      //     return token ? 'profile' : 'login'
      // }

      $scope.logout = function(){
        // event.preventDefault();
        if(localStorage.token) localStorage.removeItem('token');
        $http.post('/users/logout',{headers:{'Authorization': `Bearer ${localStorage.token}`}})
        .then(data => data ? window.location.reload(): console.log(data))
        .catch(error => error ? console.log(error) : '')
      }
});


  app.factory('postsFactory', function () {
    return [
      {
       "id": "1",
       "name": "Amazing Mountain"
     },
     {
       "id": "2",
       "name": "Creative Business"
     },
     {
       "id": "3",
       "name": "Unlimited Ways"
     }
    ];
  })
