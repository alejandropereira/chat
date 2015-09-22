angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

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
  var usersRef = new Firebase(FirebaseUrl+'users');

  return $firebaseAuth(usersRef);
})

.factory("User", function(FirebaseUrl, $firebaseArray, $firebaseObject){
  var usersRef = new Firebase(FirebaseUrl+'users');
  var users = $firebaseArray(usersRef);

  var userService = {
    all: users,
    find: function(uid){
      var userRef = new Firebase(FirebaseUrl+'users/'+uid)
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
