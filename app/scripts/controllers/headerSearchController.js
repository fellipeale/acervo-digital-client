'use strict';

angular.module('sbAdminApp')
  .controller('HeaderSearchCtrl', ['$http', '$scope', '$state', '$stateParams', 'SpringDataRestAdapter', function ($http, $scope, $state, $stateParams, SpringDataRestAdapter) {

    $scope.submit = function(searchText) {
      $state.go('main.search', {query: searchText});
    }

}]);