'use strict';

angular.module('sbAdminApp')
  .controller('LibraryCtrl', function ($http, $scope, $stateParams, SpringDataRestAdapter) {

  $scope.library = {};
  $scope.fields = [];
  $scope.records = [];

  $scope.editMode = false;

  $scope.selectedTab = 0;

  if ($stateParams.libraryId) {
    var libraryPromise = $http.get('http://localhost:8080/api/libraries/' + $stateParams.libraryId);

    SpringDataRestAdapter.process(libraryPromise).then(function (processedResponse) {
      $scope.library = processedResponse;
    });

    var fieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByPresentationTrueAndLibraryId?id=' + $stateParams.libraryId);

    SpringDataRestAdapter.process(fieldsPromise, 'fieldType').then(function (processedResponse) {
      $scope.fields = processedResponse._embeddedItems;
    });

    var recordsPromise = $http.get('http://localhost:8080/api/records/search/findByLibraryId?id=' + $stateParams.libraryId);

    SpringDataRestAdapter.process(recordsPromise, ['contents', 'field'], true).then(function (processedResponse) {
      $scope.records = processedResponse._embeddedItems;
    });
  } else {
    $scope.library['active'] = true;
    $scope.editMode = true;
  }

  $scope.toggleEditMode = function() {
    $scope.editMode = !$scope.editMode;
  }

  $scope.selectTab = function(index) {
    $scope.selectedTab = index;
  }

  $scope.submit = function() {
    if ($stateParams.libraryId) {
      $http.put("http://localhost:8080/api/libraries/" + $stateParams.libraryId, $scope.library).then(function() {
        console.log("Library updated.")
      });
    } else {
      $http.post("http://localhost:8080/api/libraries/", $scope.library).then(function() {
        console.log("Library saved.")
      });
    }
  }

});
