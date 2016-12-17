
var myApp = angular.module('myApp',[]);


myApp.controller('mainController', function($scope, $http, $window) {

     $scope.logout = function() {
        $http.get("/logout")
        .then(function (response) {
             $scope.userdata = null;
             $scope.getAll();
             $window.location.href = '/home';
        }); 
    }; 
    
}); 


 window.onload=function(){
     $(function(){
         if(window.location.protocol==="https:")
             window.location.protocol="http";
     });
 }



 
   
 





