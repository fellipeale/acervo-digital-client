'use strict';

angular.module('sbAdminApp')
  .controller('HomeCtrl', ['$http', '$scope', function ($http, $scope) {

  $http.get('http://localhost:8080/api/libraries').success(function (data) {
    $scope.libraries = data._embedded.libraries;
  });

}]);