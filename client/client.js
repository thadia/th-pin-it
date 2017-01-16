var myApp = angular.module('myApp', []);


myApp.controller('mainController', function($scope, $http, $window) {

    $http.get("/username")
        .then(function(response) {
            if (response.data != null) {
                $scope.userName = response.data;
                console.log(response.data + ' Get My Username ' + $scope.userName);
                
                if($scope.userName != ""){
                    $scope.string_API = "/getMyPins/" +  $scope.userName;  
                    console.log("Requesting all my Pins:  " + $scope.string_API);
                    $http.get($scope.string_API)
                        .then(function(response) {
                    console.log("Response received: "+ response.data); 
                    if(response.data != null){
                        $scope.myPins=response.data.user_pins;
                        console.log(" My Pins List: " + JSON.stringify(response.data.user_pins));
                    }
                     });   
                } 
                
            }
        });
        
   
    $scope.logout = function() {
        $http.get("/logout")
            .then(function(response) {
                console.log('LogOut was pressed. ');
                console.log(' Username before logout: ' + $scope.userName);
                $scope.userName = null;
                $window.location.href = '/';
                console.log(' Username after logout: ' + $scope.userName);
        });
    }
    
    $scope.addImage = function (userName,imgUrl){
        $scope.user_name=userName;
        $scope.string_API = "/img/post/" +  $scope.user_name + "/" + encodeURIComponent(imgUrl);  
        console.log("-- Request to add image: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Your New Image: " +  $scope.imgUrl + " was added. " + response);
                $scope.imgUrl = "";
            });
    };
    
    $scope.removeImage = function (userName,imgUrl){ 
        $scope.user_name=userName;
        $scope.string_API = "/img/" +  $scope.user_name + "/remove/" + encodeURIComponent(imgUrl);  
        console.log("-- Request to remove image: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Your Image: " + encodeURIComponent(imgUrl) + " was removed.");
                $scope.string_API = "/getMyPins/" +  $scope.user_name;  
                console.log("Requesting all my Pins:  " + $scope.string_API);
                $http.get($scope.string_API)
                    .then(function(response) {
                console.log("Response received: "+ response.data); 
                if(response.data != null){
                    $scope.myPins=response.data.user_pins;
                    console.log(" My Pins List: " + JSON.stringify(response.data.user_pins));
                }
                 });    
            });
    };
    
    $scope.getMyPins = function (userName){
        $scope.user_name=userName;
        $scope.string_API = "/getMyPins/" +  $scope.user_name;  
        console.log("Requesting all my Pins:  " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Response received: "+ response.data); 
                if(response.data != null){
                    $scope.myPins=response.data.user_pins;
                    console.log(" My Pins List: " + JSON.stringify(response.data.user_pins));
                }
            });
    };
    
    
     $scope.getOtherPins = function (userName){
        $scope.user_name=userName;
        $scope.string_API = "/getOtherPins/" +  $scope.user_name;  
        console.log("Requesting all other Pins:  " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Response received: "+ response.data); 
                if(response.data != null){
                    $scope.otherPins=response.data;
                    console.log(" My Pins List: " + JSON.stringify(response.data));
                }
            });
    };

    //READ
    $scope.getUserName = function() {
        $http.get("/username")
            .then(function(response) {
                if (response.data != null) {
                    $scope.userName = response.data;
                    console.log(response.data + ' Get My Username');
                }
            });
    }
    
    
});