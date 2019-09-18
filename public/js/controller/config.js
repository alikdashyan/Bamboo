var app = angular.module('app',['ngRoute','angularUtils.directives.dirPagination']);
app.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider){
    $locationProvider.hashPrefix('');
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
    .when('/demo',{
      templateUrl: 'view/demo.html',
      controller: 'demoCtrl'
    })
    .when('/admin',{
      templateUrl: 'view/admin/admin.html',
      controller:'adminCtrl'
    })
    .when('/adminpanel',{
      templateUrl: 'view/admin/adminview/adminpanel.html',
    })
    .when('/formAbout',{
      templateUrl: 'view/admin/adminview/formAbout.html',
    })
    .when('/formContact',{
      templateUrl: 'view/admin/adminview/formContact.html',
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
app.controller('formHome',function($scope, $http){
  $http.get('http://localhost:3001/textData/readAll').then(
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
app.controller('demoCtrl', function($scope,$http){
    $scope.submit = function(){
      let id = $scope.demoId;
      let hedingSpan = $scope.demoHedingSpan
      let heding = $scope.demoHeding;
      let descriotion = $scope.demoDescriotion;
      let descriotionSpan = $scope.demoDescriotionSpan;
      let callToAction = $scope.demoCallToAction;
      let additionalDescription = $scope.demoAdditionalDescription;
      let demoBody = {
          id,
          hedingSpan,
          heding,
          descriotion,
          descriotionSpan,
          callToAction,
          additionalDescription,
          
        }
      
      $http.post('/textData/create',JSON.stringify(demoBody),{headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
        success => console.log(success),
        innerError => console.log(innerError)
        
      ).catch(error => console.log(error))
    } 
})


app.controller('homeCtrl', function ($scope,$http) {
    $('#revolutionSlider').show().revolution();

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
    $http.get('/textData/readAll').then(
      success => {
        let textData = success.data;
        $scope.textData = textData;
      },
      innerError => {
        console.log(innerError);
      }
      
    ).catch(error => console.log(error))
})
app.controller('pageCtrl', function ($scope,$http) {

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
    $http.get('/textData/readAll').then(
      success => {
        let textData = success.data;
        $scope.textData = textData;
      },
      innerError => {
        console.log(innerError);
      }
      
    ).catch(error => console.log(error))

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
app.controller('aboutCtrl',function($scope, $http){
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
  $http.get('/textData/readAll').then(
    success => {
      let textData = success.data;
      $scope.textData = textData;
    },
    innerError => {
      console.log(innerError);
    }
    
  ).catch(error => console.log(error))
})
app.controller('contactCtrl', function ($scope,$http) {

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
    $http.get('/textData/readAll').then(
      success => {
        let textData = success.data;
        $scope.textData = textData;
      },
      innerError => {
        console.log(innerError);
      }
      
    ).catch(error => console.log(error))
})
app.controller('authCtrl', function($scope, $http, $location) {
    if(localStorage.token){
      $location.path('/profile').replace();
    }
    $scope.submit = function(){
      $scope.loginError = '';
      $scope.loginPasswordError = '';
      let email = $scope.email;
      let password = $scope.password ;
      let body = JSON.stringify({
          email,
          password
      });

      $http.post('/users/login', body).then(
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
              console.log(innerError)
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

        function regRequest() {
          $http.post('/users/signup',stringifiedBody,{headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
            success => {
              let token = success.data.token;
              if(token){
                localStorage.setItem('token', token);
                window.location.reload();
              }
            },
            innerError => {
              if(innerError){
                $scope.authError = innerError.data.error;
              }
            })
            .catch(error => console.log(error));      
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

  $scope.submitOrder = function(){
    let productLink = $scope.productLink;
    let buyingsPerDay = $scope.buyingsPerDay;
    let itemPrice = $scope.itemPrice;
    let totalBuyingSummary = $scope.totalBuyingSummary;
    let additionalInfo = $scope.additionalInfo;
    
    let httpOptions = {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      }
    }
    
    let body = {
      productLink,
      buyingsPerDay,
      itemPrice,
      totalBuyingSummary,
      additionalInfo,
    }
    let stringifiedBody = JSON.stringify(body);

    $scope.success = '';
    $http.post('/order',stringifiedBody, httpOptions).then(
      success => {
        console.log(success);
        if(!success.data.error){
          $location.path('/userTable').replace();
        }else{
           $scope.orderError = success.data.error;
        }
      },
      innerError => {
        console.log(innerError);
        if(innerError.error){
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
  $http.get('/orders', {headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
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
app.controller('profileCntrl', function($scope, $location, $http){
  if(!localStorage.token){
    $location.path('/').replace();
  }
  
  $scope.editUser = function(){
    $scope.ubdateError = "";
    let name = $scope.name;
    let lastName = $scope.lastName;
    let contactInfo = {
      emailForRefunds: $scope.emailForRefunds,
      skypeViberWhatsApp: $scope.skypeViberWhatsApp,
      facebookLink: $scope.facebook
    }
    
    const httpOptions = {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
    }
  
    let profileBody = JSON.stringify({
      name,
      lastName,
      contactInfo
    })
    console.log(profileBody);
    $http.patch('/users/update', profileBody, httpOptions)
      .then(
        innerSuccess => innerSuccess.statusText == "OK" ? $scope.success = 'User Successfully Edited' : $scope.error = 'Something went wrong',

        innerError => {
          
            $scope.ubdateError = innerError.data.error;
            // console.log('text' , innerError)
            // console.log('text' , innerError.data.error)
        }
      )
      .catch(error => console.log(error))
  }
  
})

app.controller('HeaderCtrl', function($scope, $http, $location){
      if(localStorage.token) {
        $scope.token = localStorage.token;
      }

      $scope.logout = function(){

        // localStorage.removeItem('token');
        // $location.path('/').replace();
        // window.location.reload();
        $http.post('/users/logout', {}, {headers:{'Authorization': `Bearer ${localStorage.token}`}})
        .then(data => {
          localStorage.removeItem('token')
          window.location.reload()
        })
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
