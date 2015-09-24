angular.module('starter.services', [])

.factory("Messages", function(FirebaseUrl, $firebaseArray){
  var userMessagesRef = new Firebase(FirebaseUrl+'userMessages');

  return {
    forUsers: function(uid1, uid2){
      var path = uid1 < uid2 ? uid1+'/'+uid2 : uid2+'/'+uid1;

      return $firebaseArray(userMessagesRef.child(path));
    }
  };
})

.factory("Auth", function(FirebaseUrl, $firebaseAuth) {
  var usersRef = new Firebase(FirebaseUrl);

  return $firebaseAuth(usersRef);
})

.factory("User", function(FirebaseUrl, $firebaseArray, $firebaseObject){
  var usersRef = new Firebase(FirebaseUrl+'users');
  var users = $firebaseArray(usersRef);

  var userService = {
    all: users,
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
    }
  };

  return userService;
});
