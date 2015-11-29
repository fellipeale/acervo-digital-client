'use strict';

angular.module('sbAdminApp')
  .controller('HomeCtrl', function ($http, $scope, SpringDataRestAdapter) {

  loadLibraries();

  $scope.deleteLibrary = function(id) {
    var libraryDeletionPromise = $http.delete('http://localhost:8080/api/libraries/' + id);

    SpringDataRestAdapter.process(libraryDeletionPromise).then(function () {
      console.log('Library deleted.');
      $scope.successMessage = 'Library deleted.';
      loadLibraries();
    }, function(response) {
      $scope.errorMessage = 'Problem while deleting library: ' + response.data;
    });
  }

  function loadLibraries() {
    var librariesPromise = $http.get('http://localhost:8080/api/libraries');

    SpringDataRestAdapter.process(librariesPromise).then(function (processedReponse) {
      $scope.libraries = processedReponse._embeddedItems;
    });
  }

});