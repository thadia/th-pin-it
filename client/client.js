
var myApp = angular.module('myApp',[]);


myApp.controller('mainController', function($scope, $http, $window) {
 //    $http.get("/polls/all")
 //   .then(function (response) {
 //        $scope.polls = response.data;
 // }); 

    $scope.getAll = function(){
          $http.get("/polls/all")
            .then(function (response) {
            $scope.polls = response.data;
        });
     }
     
     $scope.login = function(){
          $http.get("/login")
            .then(function (response) {
        });
     }  
     
    $scope.newPoll = function(pollName, items ) {
         // polls/post/:user/:title/:list
         
         $scope.pollName = pollName;
         $scope.items = items;
         $scope.string_API = "/polls/post/"+$scope.pollName+"/" +$scope.items;
         console.log("LOG New Poll: "+ $scope.string_API);
    
         $http.get($scope.string_API)  
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "Your New Poll: "+$scope.pollName+" was added.";
        });
        
         $scope.pollName = "";
         $scope.items = "";
    }; 
    $scope.removePoll = function(pollName ) {
         $scope.pollName = pollName;
         $scope.string_API = "/polls/remove/"+$scope.pollName ;
         console.log("LOG New Poll: "+ $scope.string_API);
         $http.get($scope.string_API)  
        .then(function (response) {
             $scope.getAll();
             $scope.alertVoted = "Your Poll: "+$scope.pollName+" was removed.";
             $scope.pollName = "";
        }); 
    }; 
    
    

}); 


 
   
 






