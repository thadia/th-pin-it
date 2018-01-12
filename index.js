var server = require('express');
var request = require('request');
var port = process.env.PORT || 3500;
var app = server();
var path = require('path');


app.use(server.static(__dirname + '/public'));
app.use(server.static(__dirname + '/bower_components'));
app.use(server.static(__dirname + '/js'));
app.use(server.static(__dirname + '/client'));

var mongoose = require('mongoose');
var User = require('./client/js/user-model');

var mongoose = require('mongoose');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectID;

var user =  {
    
}; 

var passport = require('passport');
var strategy = require('passport-twitter').Strategy;


var config = require('./node_modules/config');
var dbConfig = config.get('DBConfig.DB');
var consumerKey = config.get('DBConfig.C_KEY');
var consumerSecret = config.get('DBConfig.C_SECRET');


passport.use(new strategy({
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    callbackURL: "https://th-pin-it.herokuapp.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
      user.id=profile.id;
      user.name=profile.username;
      console.log("PROFILE: "+profile.username);
      this.redirect('/home/true'); //+profile.id);
     
   /* User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    });*/
  }
));


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
  extended: true
}));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

mongoose.connect(dbConfig);
var userName =user.name;

app.get('/logout', function(req, res) {
  userName = null;
  user.name = null;
  res.redirect('/');

});

app.get('/username', function(req, res) {
  console.log("Send username from server " +  user.name);
  res.send(user.name);
});

app.get('/', function(req, res) {
  var fileName = path.join(__dirname, '/client/index.html');
  res.sendFile(fileName, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/home/:online', function(req, res) {
  
    var fileName = path.join(__dirname, '/client/home.html');
    if (req.params.online == "true" && user.name != null) { //TO ADD for security &userName !=null
      res.sendFile(fileName, function(err) {
        if (err) {
          console.log(err);
          res.status(err.status).end();
        }
        else {
          console.log('Sent:', fileName);
        }
      });
    }
    else {
      console.log("User is not logged in. " + (req.params.online ));
      res.redirect('/');
    }
      
});

app.get('/home/demo1/:online', function(req, res) {
    user.name="demo1";
   // console.log("PROFILE: "+profile.username);
      res.redirect('/home/true'); 
});


app.listen(port, function() {
  console.log('Ready: ' + port);
});


app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedherkirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home/true');
  });

app.get('/img/post/:uName/:url', function(req, res) {  
        User.findOne({ 
            user_name: req.params.uName
          }, function(err, user) {
            if (err) console.log(err + "Error 1"); 
            if (user == null) {
               console.log("User value: " + user + " URL: " + decodeURI(req.params.url));
                //Create User if not found
                 var newUser = new User({
                    user_name: req.params.uName,  
                    user_pins: decodeURI(req.params.url)
                  });
                  newUser.save(function(err, resp) {
                    if (err){
                        console.log(err);
                        res.send({
                           message :'something went wrong'
                        });
                    }
                    console.log('Saved New! Username: ' + req.params.uName);
                    userName = req.params.uName;
                    res.send({ message:'the new user has been saved'});
                  });
            }
            if(user) {
               console.log("User value: " + user + " URL: " + decodeURI(req.params.url));
               user.user_pins.addToSet(decodeURI(req.params.url));
               console.log("Username saved on the server side " + userName);
               user.save(function(err) {
                    if (err) throw err;
                    console.log('Saved New Image to username: ' + req.params.uName);
                    userName = req.params.uName;
                    res.send({ message:'the img has been added'});
                  });
            //   res.send('true');
            }  
          });
  }); 
  
app.get('/getMyPins/:uName', function(req, res) {  
        User.findOne({ 
            user_name: req.params.uName
          }, function(err, user) {
            if (err) console.log(err + "Error 1"); 
            if (user == null) {
               console.log("This user: " + req.params.uName +  "has no pins saved.");
            }
            if(user) {
               console.log("User found: " + user);
               res.send(user);
            }  
          });
  });   
  
app.get('/getOtherPins/:uName', function(req, res) {  
        User.aggregate({ $match:  
          {  user_name:  {$ne: req.params.uName }}},
          function(err, user) {
            if (err) console.log(err + "Error 1"); 
            if (user == null) {
               console.log("This user: " + req.params.uName +  "has no pins saved.");
            }
            if(user) {
               console.log("User found: " + JSON.stringify(user));
               res.send(user);
            }  
          });
  });     
  
app.get('/img/:userName/remove/:pin', function(req, res) {
  User.update({
    "user_name": req.params.userName
  }, {$pull: {"user_pins": decodeURI(req.params.pin) }}, function(err, latest_data) {
    if (err) return console.error(err + "Error on remove book.");
    else {
      console.log("Image: " + decodeURI(req.params.pin) + " was removed successfully.");
       res.send({ message:'the image was removed'});
       userName = req.params.uName;
    } 
      
    });  
});

app.get('/logout', function(req, res) {
      //  req.logout();
       
        user.id=null;
        user.name=null;
        console.log(" LogOut Server: " + user.name);
        res.redirect('/');
});
    
