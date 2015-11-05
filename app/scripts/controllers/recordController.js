'use strict';

angular.module('sbAdminApp')
  .controller('RecordCtrl', ['$http', '$scope', '$state', '$stateParams', function ($http, $scope, $state, $stateParams) {

  $http.get('http://localhost:8080/api/records/' + $stateParams.recordId).success(function (data) {
    $scope.record = data
  });

  $http.get('http://localhost:8080/api/records/' + $stateParams.recordId + '/contents').success(function (data) {
    $scope.contents = data._embedded.contents;
  });

}]);