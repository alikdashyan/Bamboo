var app = angular.module('app',['ngRoute','angularUtils.directives.dirPagination']);
app.config(['$routeProvider',function($routeProvider){

    $routeProvider
    .when('/',{
    templateUrl:'view/home.html',  
    })
    .when('/services',{
        templateUrl:'view/page-services.html',    
    })
    .when('/blog',{
        templateUrl:'view/blog-grid-3-columns.html',   
        controller: 'blogCtrl' 
    }) 
    .when('/about',{
        templateUrl:'view/about-us-advanced.html',    
    })
    .when('/contact',{
        templateUrl:'view/contact-us.html',    
    })   
    .when('/login',{
        templateUrl:'view/page-login.html',    
        controller: 'authCtrl'
      })
    .when('/blog/:postId',{
        templateUrl: 'view/blog-post.html',
        controller: 'postCtrl',
    })
    .otherwise({redirctTo:'/'})
}]) 
app.controller('blogCtrl',function ($scope, postsFactory) {
    console.log('blogCtrl', postsFactory);
    $scope.posts = postsFactory
    console.log($scope.posts);
})
app.controller('postCtrl', function ($scope, $routeParams,postsFactory) {
    console.log($routeParams.postId);
    $scope.postId = $routeParams.postId
  })
app.controller('authCtrl', function($scope, $http) {
  $scope.user = {
    name: null,
    password: null
  }
  let body = JSON.stringify({
    email: $scope.user.name,
    password: $scope.user.password
  })
  let config = {
    method: 'POST',
    url: '/users/login',
    data: body 
  }
  $scope.submit = function() {
    // e.preventDefault();
    console.log(config);
    $http(config)
          .then(
            success => console.log(success),
            innerError => console.log(innerError)
          ).catch(error => console.log(error));
  }
})

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
       "name": "Developer Life"
     },
        {
       "id": "5",
       "name": "The Blue Sky"
     },
         {
       "id": "6",
       "name": "Night Life"
     },
         {
       "id": "7",
       "name": "Another World Perspective"
     },
         {
       "id": "8",
       "name": "Alone on the Forest"
     },
     {
      "id": "9",
      "name": "The Blue Sky"
    },
        {
      "id": "10",
      "name": "Night Life"
    },
        {
      "id": "11",
      "name": "Another World Perspective"
    },
        {
      "id": "12",
      "name": "Alone on the Forest"
    },
    {
      "id": "13",
      "name": "Unlimited Ways"
    },
       {
      "id": "14",
      "name": "Developer Life"
    },
       {
      "id": "15",
      "name": "The Blue Sky"
    },
        {
      "id": "16",
      "name": "Night Life"
    },
        {
      "id": "17",
      "name": "Another World Perspective"
    },
        {
      "id": "18",
      "name": "Alone on the Forest"
    },
    {
     "id": "19",
     "name": "The Blue Sky"
   },
       {
     "id": "20",
     "name": "Night Life"
   },
       {
     "id": "21",
     "name": "Another World Perspective"
   },
       {
     "id": "22",
     "name": "Alone on the Forest"
   }, {
    "id": "23",
    "name": "Unlimited Ways"
  },
     {
    "id": "24",
    "name": "Developer Life"
  },
     {
    "id": "25",
    "name": "The Blue Sky"
  },
      {
    "id": "26",
    "name": "Night Life"
  },
      {
    "id": "27",
    "name": "Another World Perspective"
  },
      {
    "id": "28",
    "name": "Alone on the Forest"
  },
  {
   "id": "29",
   "name": "The Blue Sky"
 },
 {
  "id": "30",
  "name": "Unlimited Ways"
},
   {
  "id": "31",
  "name": "Developer Life"
},
   {
  "id": "32",
  "name": "The Blue Sky"
},
    {
  "id": "33",
  "name": "Night Life"
},
    {
  "id": "34",
  "name": "Another World Perspective"
},
    {
  "id": "35",
  "name": "Alone on the Forest"
},
{
 "id": "36",
 "name": "The Blue Sky"
},
{
  "id": "37",
  "name": "Amazing Mountain"
},
{
  "id": "38",
  "name": "Creative Business"
},
{
  "id": "39",
  "name": "Unlimited Ways"
},
   {
  "id": "40",
  "name": "Developer Life"
},
   {
  "id": "41",
  "name": "The Blue Sky"
},
    {
  "id": "42",
  "name": "Night Life"
},
    {
  "id": "43",
  "name": "Another World Perspective"
},
    {
  "id": "44",
  "name": "Alone on the Forest"
},
{
 "id": "45",
 "name": "The Blue Sky"
},
   {
 "id": "46",
 "name": "Night Life"
},
   {
 "id": "47",
 "name": "Another World Perspective"
},
   {
 "id": "48",
 "name": "Alone on the Forest"
},
{
 "id": "49",
 "name": "Unlimited Ways"
},
  {
 "id": "50",
 "name": "Developer Life"
},
  {
 "id": "51",
 "name": "The Blue Sky"
},
   {
 "id": "52",
 "name": "Night Life"
},
   {
 "id": "53",
 "name": "Another World Perspective"
},
   {
 "id": "54",
 "name": "Alone on the Forest"
},
{
"id": "55",
"name": "The Blue Sky"
},
  {
"id": "56",
"name": "Night Life"
},
  {
"id": "57",
"name": "Another World Perspective"
},
  {
"id": "58",
"name": "Alone on the Forest"
}, {
"id": "59",
"name": "Unlimited Ways"
},
{
"id": "60",
"name": "Developer Life"
},
{
"id": "61",
"name": "The Blue Sky"
},
 {
"id": "62",
"name": "Night Life"
},
 {
"id": "63",
"name": "Another World Perspective"
},
 {
"id": "64",
"name": "Alone on the Forest"
},
{
"id": "65",
"name": "The Blue Sky"
},
{
"id": "67",
"name": "Unlimited Ways"
},
{
"id": "68",
"name": "Developer Life"
},
{
"id": "69",
"name": "The Blue Sky"
},
{
"id": "70",
"name": "Night Life"
},
{
"id": "71",
"name": "Another World Perspective"
},
{
"id": "72",
"name": "Alone on the Forest"
},
{
"id": "73",
"name": "The Blue Sky"
},
    ];
  })
