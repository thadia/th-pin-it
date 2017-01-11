var myApp = angular.module('myApp', []);


myApp.controller('mainController', function($scope, $http, $window) {

    $http.get("/username")
        .then(function(response) {
            if (response.data != null) {
                $scope.userName = response.data;
                console.log(response.data + ' Get My Username ' + $scope.userName);
                
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
                
            }
        });
        
   
    $scope.login = function(userName, userPwd) {
        $http.get("/login/" + userName)
            .then(function(response) {
                if (response.data == 'true') {
                    userName = userName;
                    console.log(response.data + 'LOG HERE');
                    $window.location.href = '/home/true';
                }
                if(response.data == 'false'){
                    alert("Password invalid.");
                }
                if(response.data == 'badUser'){
                    alert("Username invalid.");
                }
            });
    }
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
        console.log("LOG New IMG Added: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Your New Image: " +  $scope.imgUrl + " was added.");
            });
    };
    
    $scope.removeImage = function (userName,imgUrl){
        $scope.user_name= userName;
        $scope.string_API = "/img/" +  $scope.user_name + "/remove/" + encodeURIComponent(imgUrl);  
        console.log("Request to remove image: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                console.log("Your Image: " + encodeURIComponent(imgUrl) + " was removed.");
            });
    };
    
    $scope.getMyPins = function (userName){
        $scope.user_name="maat_shu"; //userName;
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

  
    $scope.removePoll = function(pollName) {
        $scope.pollName = pollName;
        $scope.string_API = "/polls/remove/" + $scope.pollName;
        console.log("LOG New Poll: " + $scope.string_API);
        $http.get($scope.string_API)
            .then(function(response) {
                $scope.getAll();
                $scope.alertVoted = "Your Poll: " + $scope.pollName + " was removed.";
                $scope.pollName = "";
            });
    };

    //CREATE
    $scope.create = function(userName, userPwd) {
        $http.get("/create/user/" + userName + "/" + userPwd)
            .then(function(response) {
                if (response.data == 'true') {
                    $scope.userName = userName;
                    console.log(response.data + 'LOG HERE');
                   
                }
                 $http.get("/username")
            .then(function(response) {
                if (response.data != null) {
                    $scope.userName = response.data;
                    console.log(response.data + ' Get My Username');
                     $window.location.href = '/home/true';
                }
            });
            });
    }
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
    $scope.getMyBooks = function(userName) {
        $http.get("/books/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.myBooks = response.data[0].user_books;
                    console.log('--- Get My Books ' + JSON.stringify($scope.myBooks));
                }
            });

    }
    
    $scope.getAvailableBooks = function(userName) {
        $http.get("/availablebooks/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.availableBooks = response.data;
                    console.log('--- Get Available Books ' + JSON.stringify($scope.availableBooks));
                }
            });

    }
    $scope.getAll = function() {
        $http.get("/data/all")
            .then(function(response) {

            });
    }
    
    $scope.getMyRequestedBooks = function(userName) {
        $http.get("/myrequestedbooks/" + $scope.userName)
            .then(function(response) {
                if (response.data != null) {
                    $scope.requestedBooks = response.data;
                    console.log('--- Get My Requested Books ' + JSON.stringify($scope.requestedBooks));
                }
            });

    }
    
    //UPDATE
    $scope.addBook = function(userName, bookTitle, bookAuthor, bookYear) {
        $http.get("/books/" + userName + "/add/" + bookTitle + "/" + bookAuthor + "/" + bookYear)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log(response.data + 'BOOK WAS ADDED.');
                }
            });

    }
    $scope.saveMyInfo = function(userName, fullName, city, state) {
        $http.get("/myInfo/" + userName + "/save/" + fullName + "/" + city + "/" + state)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- INFO DATA WAS SAVED.');
                }
            });

    }
    $scope.requestBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/requestbook/" + userName + "/" + ownerName+ "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- INFO DATA WAS SAVED. ' + bookTitleOffered);
                }
            });
        
        $http.get("/availablebooks/" + $scope.userName)
                    .then(function(response) {
                        if (response.data != null) {
                            $scope.availableBooks = response.data;
                            console.log('--- Get Available Books ' + JSON.stringify($scope.availableBooks));
                }
        });

    }
    $scope.rejectBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/rejectbook/" + userName + "/" + ownerName + "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- Request was Deleted. Book Requested: ' + bookTitleRequested + 'User_request: '+ ownerName + "Book_offered: " + bookTitleOffered);
                }
            });
    }
   
    $scope.acceptBook = function(userName,ownerName, bookTitleRequested, bookTitleOffered) {
        $http.get("/acceptbook/" + userName + "/" + ownerName + "/" + bookTitleRequested  + "/" + bookTitleOffered)
            .then(function(response) {
                if (response.data == 'true') {
                    console.log('--- Request was Accepted. Book Requested: ' + bookTitleRequested + 'User_request: '+ ownerName + "Book_offered: " + bookTitleOffered);
                }
            });
    }

    //DELETE
    $scope.deleteMyBook = function(userName,bookTitle,bookAuthor,bookYear) {
        $http.get("/books/" + userName + "/remove/" + bookTitle + "/" + bookAuthor + "/" + bookYear)
            .then(function(response) {
                if (response.data != null) {
                    $scope.myBooks = response.data[0].user_books;
                    console.log('--- Get My Books After Delete ' + JSON.stringify($scope.myBooks));
                }
            });

    }

});