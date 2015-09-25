angular.module('starter.controllers', [])

.controller("LoginCtrl", function($scope, $state, User, $ionicLoading) {

  $scope.loggingIn = false;

  $scope.login = function(authMethod) {

    if(!$scope.loggingIn){
      $scope.loggingIn = true;

      User.loginUser().then(function(){
        $scope.loggingIn = false;
        $state.go('tab.dash');
      });
    }
  };
})


.controller('DashCtrl', function($scope, User, currentAuth) {
  $scope.loggingIn = true;
  User.all().then(function(data){
    $scope.loggingIn = false;
    $scope.friends = data;
  });
  $scope.currentUserID = currentAuth.uid;
})

.controller('ChatDetailCtrl', function($scope, $stateParams, currentAuth, Messages, toUser, $ionicScrollDelegate, $timeout) {
  var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
  $scope.loggingIn = true;

  $scope.$on('$ionicView.enter', function() {
    Messages.forUsers($stateParams.uid, currentAuth.uid).then(function(data){
      $scope.loggingIn = false;
      $scope.messages = data;

      $timeout(function() {
        viewScroll.scrollBottom(true);
      }, 0);
    });
    $scope.user = currentAuth;
    $scope.toUser = toUser;
  });

  $scope.sendMessage = function(){
    if($scope.message){
      $scope.messages.$add({
        uid: currentAuth.uid,
        body: $scope.message,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });
      $scope.message = '';
      $timeout(function() {
        viewScroll.scrollBottom(true);
      }, 600);
    }
  };
})

.controller('AccountCtrl', function($scope, $state, Auth) {
  // Logs a user out
  $scope.logout = function() {
    Auth.$unauth();
    $state.go('login');
  };
});

