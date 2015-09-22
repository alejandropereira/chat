angular.module('starter.controllers', [])

.controller("LoginCtrl", function($scope, $rootScope, Auth, $state, $ionicLoading, User) {

  $scope.login = function(authMethod) {
    var ref = new Firebase("https//sweltering-fire-7423.firebaseio.com/users");

    Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
    }).catch(function(error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
        });
      } else {
        console.log(error);
      }
    });

    Auth.$onAuth(function(authData) {
      $ionicLoading.hide();

      if (authData === null) {
        console.log("Not logged in yet");
      } else {

        User.createUser(authData);
        console.log("Logged in as", authData.uid);
        $state.go('tab.dash');
      }
      $scope.authData = authData; // This will display the user's name in our view
    });
  }
})


.controller('DashCtrl', function($scope, User, currentAuth) {
  $scope.friends = User.all;
  $scope.currentUserID = currentAuth.uid;
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, currentAuth, Messages, User, toUser, $ionicScrollDelegate, $timeout) {
  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

  $scope.$on('$ionicView.enter', function() {
    Messages.forUsers($stateParams.uid, currentAuth.uid).$loaded().then(function(data){
      $scope.messages = data;

      $timeout(function() {
        viewScroll.scrollBottom(true);
      }, 0);
    });
    $scope.user = currentAuth;
    $scope.toUser = toUser;
  });

  $scope.sendMessage = function(){
    if($scope.message.length > 0){
      $scope.messages.$add({
        uid: currentAuth.uid,
        body: $scope.message,
        timestamp: Firebase.ServerValue.TIMESTAMP
      }).then(function(){
        $scope.message = '';
      });
      $timeout(function() {
        viewScroll.scrollBottom(true);
      }, 0);
    }
  } 
})

.controller('AccountCtrl', function($scope, $state, Auth) {
  // Logs a user out
  $scope.logout = function() {
    Auth.$unauth();
    $state.go('login');
  };
});

