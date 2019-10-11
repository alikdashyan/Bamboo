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
    .when('/reportsTable',{
      templateUrl: 'view/reports.html',
      controller:'reportsCtrl'
    })
    .when('/demo',{
      templateUrl: 'view/demo.html',
      controller: 'demoCtrl'
    })
    .when('/admin',{
      templateUrl: 'view/admin/admin.html',
      controller:'adminCtrl'
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
      controller: 'footerCntrl'
    })
    .when('/formHome',{
      templateUrl: 'view/admin/adminview/formHome.html',
      controller:'formHome'
    })
    .when('/formServices',{
      templateUrl: 'view/admin/adminview/formServices.html',
      controller: 'formServices'
    })
    .when('/formHeader',{
      templateUrl: 'view/admin/adminview/formHeader.html',
      controller: 'HeaderCtrl'
    })
    .when('/paymentError', {
      templateUrl: 'view/page-error.html'
    })
    .when('/error404',{
      templateUrl: 'view/page-404.html'
    })
    // .otherwise({ redirectTo: 'view/page-404.html'})
}])

//Admin Panel
app.controller('adminCtrl',function($scope,$http,$location){
  if(localStorage.adminToken){
    $location.path('/formHome').replace();
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

app.controller('formHome',function($scope, $http,$location){
  if(!localStorage.adminToken){
        $location.path('/').replace();
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
  $scope.updateData = function (id) {
    let headingHomeSection1 = $scope.headingHomeSection1;
    let descriptionHomeSection1 = $scope.descriptionHomeSection1;
    let callToActionHomeSection1 = $scope.callToActionHomeSection1;
    let headingHomeSection2 = $scope.headingHomeSection2;
    let headingSpanHomeSection2 = $scope.headingSpanHomeSection2;
    let descriptionHomeSection2 = $scope.descriptionHomeSection2;
    let additionalDescriptionHomeSection2 = $scope.additionalDescriptionHomeSection2;
    let headingHomeSection3_1 = $scope.headingHomeSection3_1;
    let descriptionHomeSection3_1 = $scope.descriptionHomeSection3_1;
    let headingHomeSection3_2 = $scope.headingHomeSection3_2;
    let descriptionHomeSection3_2 = $scope.descriptionHomeSection3_2;
    let headingHomeSection3_3 = $scope.headingHomeSection3_3;
    let descriptionHomeSection3_3 = $scope.descriptionHomeSection3_3;
    let headingHomeSection3_4 = $scope.headingHomeSection3_4;
    let descriptionHomeSection3_4 = $scope.descriptionHomeSection3_4;
    let headingHomeSection3_5 = $scope.headingHomeSection3_5;
    let descriptionHomeSection3_5 = $scope.descriptionHomeSection3_5;
    let headingHomeSection4 = $scope.headingHomeSection4;
    let descriptionHomeSection4 = $scope.descriptionHomeSection4;
    let callToActionHomeSection4 = $scope.callToActionHomeSection4;
    let body = JSON.stringify(
      {
        headingHomeSection1,
        descriptionHomeSection1,
        callToActionHomeSection1,
        headingHomeSection2,
        headingSpanHomeSection2,
        descriptionHomeSection2 ,
        additionalDescriptionHomeSection2,
        headingHomeSection3_1,
        descriptionHomeSection3_1,
        headingHomeSection3_2,
        descriptionHomeSection3_2,
        headingHomeSection3_3,
        descriptionHomeSection3_3,
        headingHomeSection3_4,
        descriptionHomeSection3_4,
        headingHomeSection3_5,
        descriptionHomeSection3_5,
        headingHomeSection4,
        descriptionHomeSection4,
        callToActionHomeSection4
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        if(success.data){
          $scope.congratsText = 'Data is updated succesfully';
        }
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})

app.controller('formServices',function($scope,$http,$location){
  if(!localStorage.adminToken){
    $location.path('/').replace();
   }
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
    let headingServicesSection1 = $scope.headingServicesSection1;
    let descriptionServicesSection1 = $scope.descriptionServicesSection1;
    let callToActionServicesSection1 = $scope.callToActionServicesSection1;
    let headingServicesSection2_1 = $scope.headingServicesSection2_1;
    let descriptionServicesSection2_1 = $scope.descriptionServicesSection2_1;
    let headingServicesSection2_2 = $scope.headingServicesSection2_2;
    let descriptionServicesSection2_2 = $scope.descriptionServicesSection2_2;
    let headingServicesSection2_3 = $scope.headingServicesSection2_3;
    let descriptionServicesSection2_3 = $scope.descriptionServicesSection2_3;
    let headingServicesSection2_4 = $scope.headingServicesSection2_4;
    let descriptionServicesSection2_4 = $scope.descriptionServicesSection2_4;
    let headingServicesSection2_5 = $scope.headingServicesSection2_5;
    let descriptionServicesSection2_5 = $scope.descriptionServicesSection2_5;
    let headingServicesSection2_6 = $scope.headingServicesSection2_6;
    let descriptionServicesSection2_6 = $scope.descriptionServicesSection2_6;
    let headingSpanServicesSection3 = $scope.headingSpanServicesSection3;
    let headingServicesSection3 = $scope.headingServicesSection3;
    let descriptionServicesSection3 = $scope.descriptionServicesSection3;
    let additionalDescriptionServicesSection3 = $scope.additionalDescriptionServicesSection3;
    let headingSpanServicesSection4 = $scope.headingSpanServicesSection4;
    let headingServicesSection4 = $scope.headingServicesSection4;
    let descriptionServicesSection4 = $scope.descriptionServicesSection4;
    let additionalDescriptionServicesSection4 = $scope.additionalDescriptionServicesSection4;
    let headingServicesSection5_1 = $scope.headingServicesSection5_1;
    let descriptionServicesSection5_1 = $scope.descriptionServicesSection5_1;
    let headingServicesSection5_2 = $scope.headingServicesSection5_2;
    let descriptionServicesSection5_2 = $scope.descriptionServicesSection5_2;
    let headingServicesSection5_3 = $scope.headingServicesSection5_3;
    let descriptionServicesSection5_3 = $scope.descriptionServicesSection5_3;
    let headingServicesSection5_4 = $scope.headingServicesSection5_4;
    let descriptionServicesSection5_4 = $scope.descriptionServicesSection5_4;
    let headingServicesSection6 = $scope.headingServicesSection6;
    let descriptionServicesSection6 = $scope.descriptionServicesSection6;
    let headingServicesSection7 = $scope.headingServicesSection7;
    let descriptionServicesSection7 = $scope.descriptionServicesSection7;
    let callToActionServicesSection7 = $scope.callToActionServicesSection7;
    let body = JSON.stringify(
      {
        headingServicesSection1,
        descriptionServicesSection1,
        callToActionServicesSection1,
        headingServicesSection2_1,
        descriptionServicesSection2_1,
        headingServicesSection2_2,
        descriptionServicesSection2_2,
        headingServicesSection2_3,
        descriptionServicesSection2_3,
        headingServicesSection2_4,
        descriptionServicesSection2_4,
        headingServicesSection2_5,
        descriptionServicesSection2_5,
        headingServicesSection2_6,
        descriptionServicesSection2_6,
        headingSpanServicesSection3,
        headingServicesSection3,
        descriptionServicesSection3,
        additionalDescriptionServicesSection3,
        headingSpanServicesSection4,
        headingServicesSection4,
        descriptionServicesSection4,
        additionalDescriptionServicesSection4,
        headingServicesSection5_1,
        descriptionServicesSection5_1,
        headingServicesSection5_2,
        descriptionServicesSection5_2,
        headingServicesSection5_3,
        descriptionServicesSection5_3,
        headingServicesSection5_4,
        descriptionServicesSection5_4,
        headingServicesSection6,
        descriptionServicesSection6,
        headingServicesSection7,
        descriptionServicesSection7,
        callToActionServicesSection7
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        if(success.data){
          $scope.congratsText = 'Data is updated succesfully';
        }
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})

app.controller('formAbout',function($scope,$http,$location){
  if(!localStorage.adminToken){
    $location.path('/').replace();
   }
 
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
    let headingAboutSection1 = $scope.headingAboutSection1;
    let descriptionAboutSection1 = $scope.descriptionAboutSection1;
    let headingAboutSection2 = $scope.headingAboutSection2 ;
    let descriptionAboutSection2 = $scope.descriptionAboutSection2;
    let headingAboutSection3_1 = $scope.headingAboutSection3_1;
    let descriptionAboutSection3_1 = $scope.descriptionAboutSection3_1;
    let headingAboutSection3_2 = $scope.headingAboutSection3_2;
    let descriptionAboutSection3_2 = $scope.descriptionAboutSection3_2;
    let headingAboutSection3_3 = $scope.headingAboutSection3_3 ;
    let descriptionAboutSection3_3 = $scope.descriptionAboutSection3_3;
    let headingAboutSection3_4 = $scope.headingAboutSection3_4;
    let descriptionAboutSection3_4 = $scope.descriptionAboutSection3_4;
    let headingAboutSection3_5 =$scope.headingAboutSection3_5;
    let descriptionAboutSection3_5 = $scope.descriptionAboutSection3_5;
    let headingAboutSection4_1 = $scope.headingAboutSection4_1;
    let headingAboutSection4_2 = $scope.headingAboutSection4_2;
    let headingAboutSection4_3 = $scope.headingAboutSection4_3;
    let headingAboutSection4_4 = $scope.headingAboutSection4_4;
    let headingSpanAboutSection5 = $scope.headingSpanAboutSection5;
    let headingAboutSection5 = $scope.headingAboutSection5;
    let descriptionAboutSection5 = $scope.descriptionAboutSection5;
    let ditionalDescriptionAboutSection5 = $scope.ditionalDescriptionAboutSection5;
    let headingSpanAboutSection6 = $scope.headingSpanAboutSection6;
    let headingAboutSection6 = $scope.headingAboutSection6;
    let descriptionAboutSection6 = $scope.descriptionAboutSection6;
    let ditionalDescriptionAboutSection6 = $scope.ditionalDescriptionAboutSection6;
    let headingSpanAboutSection7 = $scope.headingSpanAboutSection7;
    let headingAboutSection7 = $scope.headingAboutSection7;
    let descriptionAboutSection7 = $scope.descriptionAboutSection7;
      
    let body = JSON.stringify(
      {
        headingAboutSection1,
        descriptionAboutSection1,
        headingAboutSection2 ,
        descriptionAboutSection2,
        headingAboutSection3_1,
        descriptionAboutSection3_1,
        headingAboutSection3_2,
        descriptionAboutSection3_2,
        headingAboutSection3_3,
        descriptionAboutSection3_3,
        headingAboutSection3_4,
        descriptionAboutSection3_4,
        headingAboutSection3_5 ,
        descriptionAboutSection3_5,
        headingAboutSection4_1,
        headingAboutSection4_2,
        headingAboutSection4_3,
        headingAboutSection4_4,
        headingSpanAboutSection5,
        headingAboutSection5,
        descriptionAboutSection5,
        ditionalDescriptionAboutSection5 ,
        headingSpanAboutSection6,
        headingAboutSection6,
        descriptionAboutSection6,
        ditionalDescriptionAboutSection6,
        headingSpanAboutSection7,
        headingAboutSection7,
        descriptionAboutSection7 
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        if(success.data){
          $scope.congratsText = 'Data is updated succesfully';
        }
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})

app.controller('formContact', function($scope,$http,$location){
  if(!localStorage.adminToken){
    $location.path('/').replace();
   }
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
    let headingSpanContactSection1 = $scope.headingSpanContactSection1;
    let headingContactSection1 = $scope.headingContactSection1;
    let descriptionContactSection1 = $scope.descriptionContactSection1;
    let headingContactSection2 = $scope.headingContactSection2;
    let headingSpanContactSection2 = $scope.headingSpanContactSection2;
    let descriptionContactSection2 = $scope.descriptionContactSection2;
    let headingContactSection3 = $scope.headingContactSection3;
    let descriptionContactSection3 = $scope.descriptionContactSection3;
    let callToActionContactSection3 = $scope.callToActionContactSection3;
    let headingContactSection4 = $scope.headingContactSection4;
    let contactAdressSection = $scope.contactAdressSection;
    let contactPhoneSection = $scope.contactPhoneSection;
    let contactEmailSection = $scope.contactEmailSection;
    let headingContactSection5 = $scope.headingContactSection5;
    let headingSpanContactSection5 = $scope.headingSpanContactSection5;
    let descriptionContactSection5_1 = $scope.descriptionContactSection5_1;
    let descriptionContactSection5_2 = $scope.descriptionContactSection5_2;
    let descriptionContactSection5_3 = $scope.descriptionContactSection5_3
    let body = JSON.stringify(
      {
        headingSpanContactSection1,
        headingContactSection1,
        descriptionContactSection1,
        headingContactSection2,
        headingSpanContactSection2,
        descriptionContactSection2,
        headingContactSection3,
        descriptionContactSection3,
        callToActionContactSection3,
        headingContactSection4,
        contactAdressSection,
        contactPhoneSection,
        contactEmailSection,
        headingContactSection5,
        headingSpanContactSection5,
        descriptionContactSection5_1 ,
        descriptionContactSection5_2,
        descriptionContactSection5_3
      }
    )
    $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
      success => {
        if(success.data){
          $scope.congratsText = 'Data is updated succesfully';
        }
      },
      innerError => {
        console.log(innerError)
      }
    ).catch(error => console.log(error))
  }
})

app.controller('footerCntrl', function($scope, $http,$location) {
  // if(!localStorage.adminToken){
  //   $location.path('/').replace();
  //  }
$http.get('/textData/readAll').then(
success => {
  let textData = success.data;
  $scope.textData = textData;
},
innerError => {
  console.log(innerError);
}

).catch(error => console.log(error))
$scope.updateData = function (id) {
let headingFooterSection1 = $scope.headingFooterSection1;
let descriptionFooterSection1 = $scope.descriptionFooterSection1;
let headingFooterSection2 = $scope.headingFooterSection2;
let descriptionFooterSection2 = $scope.descriptionFooterSection2;
let headingFooterSection3 = $scope.headingFooterSection3;
let contactAdres = $scope.contactAdres;
let contactPhone = $scope.contactPhone;
let contactEmail = $scope.contactEmail;
let headingFooterSection4 = $scope.headingFooterSection4;
let headingFooterSection5 = $scope.headingFooterSection5;
let body = JSON.stringify(
  {
    headingFooterSection1,
    descriptionFooterSection1,
    headingFooterSection2,
    descriptionFooterSection2,
    headingFooterSection3,
    contactAdres ,
		contactPhone,
    contactEmail,
    headingFooterSection4,
    headingFooterSection5
  }
)
$http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
  success => {
    if(success.data){
      $scope.congratsText = 'Data is updated succesfully';
    }
  },
  innerError => {
    console.log(innerError)
  }
).catch(error => console.log(error))
}
 
})
 
app.controller('adminLogoutCtrl', function($scope, $http, $location){
  $scope.adminLogout = function(){
    $http.post('/users/logout', {}, {headers:{'Authorization': `Bearer ${localStorage.adminToken}`}})
    .then(data => {
      localStorage.removeItem('adminToken')
      window.location.reload()
    })
    .catch(error => error ? console.log(error) : '')
  }
})

//End Admin Panel

app.controller('homeCtrl', function ($scope,$http) {
    $('#revolutionSlider').show().revolution();

    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
    $(document).ready(function(){
      $('.owl-carousel').owlCarousel({
        items: 1, 
        margin: 100, 
        loop: true, 
        nav: true, 
        dots: false, 
        stagePadding: 100, 
        autoHeight: true
      })
    })
    
    $http.get('/textData/readAll').then(
      success => {
        let textData = success.data;
        $scope.textData = textData;
        let slider_heading = document.querySelectorAll('div#revolutionSlider h1')[0];
        slider_heading.textContent = textData["home"].headingHomeSection1;
        let slider_descriotion = document.querySelectorAll('div#revolutionSlider div.tp-caption')[1];
        slider_descriotion.textContent = textData["home"].descriptionHomeSection1;
        let slider_callToAction= document.querySelectorAll('div#revolutionSlider a')[0];
        slider_callToAction.textContent = textData["home"].callToActionHomeSection1;
      },
      innerError => {
        console.log(innerError);
      }
      
    ).catch(error => console.log(error))
})
app.controller('pageCtrl', function ($scope,$http) {
  $('#revolutionSlider').show().revolution();
    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
    $(document).ready(function(){
      $('.owl-carousel').owlCarousel({
        responsive: {
          0: {items: 1}, 
          476: {items: 1}, 
          768: {items: 5}, 
          992: {items: 5}, 
          1200: {items: 7}
        },
        
          autoplay: true,
          autoplayTimeout: 3000,
          dots: false
      
      })
    })
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
    $('#revolutionSlider').show().revolution();
    let animations = document.getElementsByClassName('appear-animation');

    for (let index = 0; index < animations.length; index++) {
        const element = animations[index];
        const opacity =  element.style.opacity;
        if(opacity != '1')
            element.style.opacity = '1';
    }
})
app.controller('aboutCtrl',function($scope, $http){
  $('#revolutionSlider').show().revolution();
  let animations = document.getElementsByClassName('appear-animation');

  for (let index = 0; index < animations.length; index++) {
    const element = animations[index];
    const opacity =  element.style.opacity;
    if(opacity != '1')
      element.style.opacity = '1';
  }
  $(document).ready(function(){
    
    $('.owl-carousel').eq(0).owlCarousel({
      responsive: {
        576: {items: 1}, 
        768: {items: 1}, 
        992: {items: 2}, 
        1200: {items: 2}
      },
        margin: 25,
        loop: true,
        nav: false,
        dots: false, 
        stagePadding: 40,
        autoplay: true,
        autoplayTimeout: 3000,
        loop: true
  
  })
  $('.owl-carousel').eq(1).owlCarousel({
    responsive: {
      576: {items: 1}, 
      768: {items: 1}, 
      992: {items: 1}, 
      1200: {items: 1}
    },
      loop: true, 
      nav: false,
      dots: false, 
      stagePadding: 40,
      autoplay: true,
      autoplayTimeout: 3000,
      loop: true
  })
  })
   

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
app.controller('authCtrl', function($scope, $http, $location) {
  $('#revolutionSlider').show().revolution();
  let animations = document.getElementsByClassName('appear-animation');

  for (let index = 0; index < animations.length; index++) {
      const element = animations[index];
      const opacity =  element.style.opacity;
      if(opacity != '1')
          element.style.opacity = '1';
  }
    // if(localStorage.token){
    //   $location.path('/profile').replace();
    // }
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
                $location.path('/profile').replace();
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
                $location.path('/profile').replace();
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

  })
app.controller('postCtrl', function ($scope, $routeParams,postsFactory) {
    console.log($routeParams.postId);
    $scope.postId = $routeParams.postId
    $('#revolutionSlider').show().revolution();
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
    let emailForRefunds = $scope.emailForRefunds;
    let keywords = $scope.keywords;
    let amount = $scope.paymentRadio.paymentOption;
    let transferWay = $scope.transferRadio.option;

    let paymentInfo = {
      amount
    } 


    let httpOptions = {
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      }
    }
    
    let body = {
        orderInfo: {
        productLink,
        buyingsPerDay,
        itemPrice,
        totalBuyingSummary,
        additionalInfo,
        emailForRefunds,
        keywords,
        transferWay,
      },
      paymentInfo
    }
    let stringifiedBody = JSON.stringify(body);

    $scope.success = '';
    $http.post('/order',stringifiedBody, httpOptions).then(
      success => {
        if(!success.data.error){
           window.location.href = success.data.formUrl;
        }else{
           $scope.orderError = success.data.error;
        }
        console.log(success)
      },
      innerError => {
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
  $scope.$on('LOAD',function(){
    $scope.loading=true;
  })
  $scope.$on('UNLOAD',function(){
   $scope.loading=false;
 })
 $scope.loadingGif = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
 $scope.$emit("LOAD")
  $http.get('/orders', {headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
    success => {
      let bambooData = success.data;
      $scope.viewData = bambooData;
      $scope.$emit("UNLOAD")
    },
    innerError => {
      console.log(innerError);
    }
  )
})
app.controller('reportsCtrl',function($scope, $http, $location){
  if(!localStorage.token){
    $location.path('/').replace();
  }
   $scope.$on('LOAD',function(){
     $scope.loading=true;
   })
   $scope.$on('UNLOAD',function(){
    $scope.loading=false;
  })
  $scope.loadingGif = 'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
  $scope.$emit("LOAD")
  $http.get('http://www.amzbamboo.com/data',{headers:{'Authorization': `Bearer ${localStorage.token}`}}).then(
    success => {
      let bambooData = success.data;
      $scope.viewData = bambooData;
      
      $scope.$emit("UNLOAD")
      console.log(bambooData)
      
    },
    innerError => {
      console.log(innerError)
    }
  )
})
app.controller('profileCntrl', function($scope, $location, $http){
  if(!localStorage.token){
    $location.path('/').replace();
  }
  
  $scope.editUser = function(){
    $scope.ubdateError = "";
    let contactInfo = {
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

        $http.post('/users/logout', {}, {headers:{'Authorization': `Bearer ${localStorage.token}`}})
        .then(data => {
          localStorage.removeItem('token')
          window.location.reload()
        })
        .catch(error => error ? console.log(error) : '')
      }
      // if(!localStorage.adminToken){
        // $location.path('/').replace();
      //   console.log('es piti urish texic ashxati Davs');
      //  }
    $http.get('/textData/readAll').then(
      success => {
        let textData = success.data;
        $scope.textData = textData;
        
      },
      innerError => {
        console.log(innerError);
      }
    
    ).catch(error => console.log(error))
    $scope.updateData = function (id) {
      let headingHeaderSection1= $scope.headingHeaderSection1;
      let headingHeaderSection2 = $scope.headingHeaderSection2;
      let headingHeaderSection3 = $scope.headingHeaderSection3;
      let headingHeaderSection4 = $scope.headingHeaderSection4;
      let headingHeaderSection5 = $scope.headingHeaderSection5;
      let body = JSON.stringify(
        {
          headingHeaderSection1,
          headingHeaderSection2,
          headingHeaderSection3,
          headingHeaderSection4,
          headingHeaderSection5
        }
      )
      $http.patch(`/textData/update/${id}`, body, {headers: {"Authorization": `Bearer ${localStorage.adminToken}`}}).then(
        success => {
          if(success.data){
            $scope.congratsText = 'Data is updated succesfully';
          }
        },
        innerError => {
          console.log(innerError)
        }
      ).catch(error => console.log(error))
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
     },
     {
      "id": "4",
      "name": "Unlimited Ways"
    },
    {
      "id": "5",
      "name": "Unlimited Ways"
    },
    {
      "id": "6",
      "name": "Unlimited Ways"
    },
    {
      "id": "7",
      "name": "Unlimited Ways"
    },
    {
      "id": "8",
      "name": "Unlimited Ways"
    }
    ];
})
