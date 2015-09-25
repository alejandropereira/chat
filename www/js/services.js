angular.module('starter.services', [])

.factory("Messages", function(FirebaseUrl, $firebaseArray, $q){
  var userMessagesRef = new Firebase(FirebaseUrl+'userMessages');

  var self = {
    messages: {},
    forUsers: function(uid1, uid2){
      var d = $q.defer();
      var path = uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;

      self.messages = $firebaseArray(userMessagesRef.child(path));
      self.messages.$loaded(function(){
        d.resolve(self.messages);
      });

      return d.promise;
    }
  };

  return self;
})

.factory("Auth", function(FirebaseUrl, $firebaseAuth) {
  var usersRef = new Firebase(FirebaseUrl);

  return $firebaseAuth(usersRef);
})

.factory("User", function(FirebaseUrl, $firebaseArray, $firebaseObject, $q, Auth){
  var usersRef = new Firebase(FirebaseUrl+'users');
  var users = $firebaseArray(usersRef);

  var self = {
    current: {},
    users: {},
    all: function(){
      var d = $q.defer();
      self.users = users; 
      self.users.$loaded(function(){
        d.resolve(self.users);
      });

      return d.promise;
    },
    find: function(uid){
      var userRef = new Firebase(FirebaseUrl+'users/'+uid);
      return $firebaseObject(userRef);
    },
    createUser: function(authData){
      usersRef.child(authData.uid).once('value', function(snapshot) {
        if (snapshot.val() === null) {
          usersRef.child(authData.uid).set(authData.facebook);
        }
      });
    },
    loginUser: function(){
      var d = $q.defer();

      console.log('Calling facebook login');
      openFB.login(
        function(response){
          console.log(response);

          if(response.status === 'connected'){
            console.log('Facebook login succeeded');
            var token = response.authResponse.accessToken;
            console.log('Token: ', token);
            
            openFB.api({
              path: '/me',
              params: {},
              success: function(userData){
                console.log('Got data from facebook about current user');
                console.log(userData);

                console.log("Authenticating with firebase");

                var auth = Auth;
                auth.$authWithOAuthToken('facebook', token)
                  .then(function(authData){
                    console.log("Authentication success, logged in as:", authData.uid);
                    console.log(authData);

                    usersRef.child(authData.uid)
                      .transaction(function(currentUserData){
                        if(currentUserData === null){
                          return {
                            'name': userData.name,
                            'profilePic': 'http://graph.facebook.com/' + userData.id + '/picture',
                            'userId': userData.id
                          };
                        }
                      },
                      function(error, committed){
                        self.current = $firebaseObject(usersRef.child(authData.uid));
                        self.current.$loaded(function(){
                          d.resolve(self.current);
                        });
                        
                      });
                  });

              },
              error: function(error){
                console.error('Facebook error: ' + error.error_description);

                //Implement popup error.
                d.reject(error);
              }
            });
          } else {
            console.error('Facebook login failed');
            d.reject(error);
          }
        }
      );

      return d.promise;
    }
  };

  return self;
});
