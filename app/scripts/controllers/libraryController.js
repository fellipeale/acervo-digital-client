'use strict';

angular.module('sbAdminApp')
  .controller('LibraryCtrl', ['$http', '$scope', '$stateParams', function ($http, $scope, $stateParams) {

  $http.get('http://localhost:8080/api/libraries/' + $stateParams.libraryId).success(function (data) {
    $scope.library = data;
  });

  $http.get('http://localhost:8080/api/fields/search/findByLibraryId?id=' + $stateParams.libraryId).success(function (data) {
    $scope.fields = data._embedded.fields;
  });

  $http.get('http://localhost:8080/api/records/search/findByLibraryId?id=' + $stateParams.libraryId).success(function (data) {
    $scope.records = data._embedded.records;
  });

  $scope.selectedTab = 0;

  $scope.selectTab = function(index) {
    $scope.selectedTab = index;
  }

}]);
