angular.module('starter.controllers', [])

.controller("LoginCtrl", function($scope, $rootScope, Auth, $state, $ionicLoading, User) {
  $scope.login = function(provider) {
    $ionicLoading.show({
      template: 'Loading...'
    });

    Auth.$authWithOAuthRedirect(provider).then(function(authData) {
      // User successfully logged in
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup(provider).then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  };

  Auth.$onAuth(function(authData) {
    $ionicLoading.hide();

    if (authData === null) {
      console.log("Not logged in yet");
    } else {

      if (User.isNewUser(authData.uid)) {
        User.createUser(authData);
      }

      console.log("Logged in as", authData.uid);
      $state.go('tab.dash');
    }
    $scope.authData = authData; // This will display the user's name in our view
  });
})


.controller('DashCtrl', function($scope, User) {
  $scope.friends = User.all;
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $state, Auth) {
  $scope.settings = {
    enableFriends: true
  };

  // Logs a user out
  $scope.logout = function() {
    Auth.$unauth();
    $state.go('login');
    console.log("Logged out")
  };
});

