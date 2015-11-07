'use strict';

angular.module('sbAdminApp')
  .controller('LibraryCtrl', function ($http, $scope, $stateParams, SpringDataRestAdapter) {

  var libraryPromise = $http.get('http://localhost:8080/api/libraries/' + $stateParams.libraryId);

  SpringDataRestAdapter.process(libraryPromise).then(function (processedResponse) {
    $scope.library = processedResponse;
  });

  var fieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByLibraryId?id=' + $stateParams.libraryId);

  SpringDataRestAdapter.process(fieldsPromise).then(function (processedResponse) {
    $scope.fields = processedResponse._embeddedItems;
  });

  var recordsPromise = $http.get('http://localhost:8080/api/records/search/findByLibraryId?id=' + $stateParams.libraryId);

  SpringDataRestAdapter.process(recordsPromise, ['contents', 'field'], true).then(function (processedResponse) {
    $scope.records = processedResponse._embeddedItems;
  });

  $scope.selectedTab = 0;

  $scope.selectTab = function(index) {
    $scope.selectedTab = index;
  }

});
