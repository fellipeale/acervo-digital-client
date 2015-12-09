'use strict';

angular.module('sbAdminApp')
  .controller('SearchCtrl', ['$http', '$scope', '$state', '$stateParams', 'SpringDataRestAdapter', function ($http, $scope, $state, $stateParams, SpringDataRestAdapter) {

  if (!$stateParams.query) {
    return false;
  }

  $scope.query = $stateParams.query;
  $scope.records = {};

  loadRecords();

  function loadRecords() {
    var recordsPromise = $http.get('http://localhost:8080/api/records/search/findByValue?query=' + $stateParams.query);

    SpringDataRestAdapter.process(recordsPromise, ['library', 'contents', 'field'], true).then(function (processedResponse) {
      $scope.records = createPresentationRecords(processedResponse._embeddedItems);
    });
  }

  function createPresentationRecords(records) {
    if (records) {
      for (var i = 0; i<records.length; i++) {
        records[i].contents = records[i].contents._embeddedItems.filter(function(content) {
          return content.field.presentation
        }).sort(function(a, b) {
          return a.field.sequence - b.field.sequence;
        });
      }
    }
    return records;
  }

}]);