'use strict';

angular.module('sbAdminApp')
  .controller('RecordCtrl', ['$http', '$scope', '$stateParams', 'SpringDataRestAdapter', '$q', function ($http, $scope, $stateParams, SpringDataRestAdapter, $q) {

  $scope.fields = [];
  $scope.record = {};

  $scope.editMode = false;

  var fieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByLibraryId?id=' + $stateParams.libraryId);

  SpringDataRestAdapter.process(fieldsPromise, 'fieldType').then(function (processedResponse) {
    $scope.fields = processedResponse._embeddedItems;
  });

  if ($stateParams.recordId) {
    var recordPromise = $http.get('http://localhost:8080/api/records/' + $stateParams.recordId);

    SpringDataRestAdapter.process(recordPromise, ['contents', 'field', 'fieldType'], true).then(function (processedResponse) {
      $scope.record = processedResponse;
    });
  } else {
    $scope.editMode = true;
  }

  $scope.toggleEditMode = function() {
    $scope.editMode = !$scope.editMode;
  }

  $scope.submit = function() {
    if ($stateParams.recordId) {

      var record = $scope.record;
      record['contents'] = record.contents._embeddedItems;
      var promises = [];

      record.contents.forEach(function(content) {
        record.contents[record.contents.indexOf(content)].field = 'http://localhost:8080/api/fields/' + content.field.id;
        promises.push(
          $http.put('http://localhost:8080/api/contents/' + content.id, content).then(function(response) {
            console.log('Content updated.');
            record.contents[record.contents.indexOf(content)] = response.headers('Location');
          })
        );
      });

      $q.all(promises).then(function() {
        $http.put('http://localhost:8080/api/records/' + $stateParams.recordId, record).then(function() {
          console.log('Record updated.');
        });
      });
    } else {
      var record = $scope.record;
      record['contents'] = record.contents._embeddedItems;
      record['library'] = 'http://localhost:8080/api/libraries/' + $stateParams.libraryId;
      var promises = [];

      record.contents.forEach(function(content) {
        promises.push(
          $http.post('http://localhost:8080/api/contents/', content).then(function(response) {
            console.log('Content saved.');
            record.contents[record.contents.indexOf(content)] = response.headers('Location');
          })
        );
      });

      $q.all(promises).then(function() {
        $http.post('http://localhost:8080/api/records/', record).then(function() {
          console.log('Record saved.');
        });
      });
    }
  }

  $scope.initContents = function(fields) {
    $scope.record['contents'] = [];
    for (var i = 0; i < fields.length; i++) {
      $scope.record.contents[i] = {};
      $scope.record.contents[i]['field'] = 'http://localhost:8080/api/fields/' + fields[i].id;
      $scope.record.contents[i]['values'] = [];
      $scope.record.contents[i].values[0] = {};
      $scope.record.contents[i].values[0]['type'] = fields[i].fieldType.key;
    }
  }

  $scope.addValue = function(content) {
    content.values.push({});
  }

  $scope.removeValue= function(content, index) {
    content.values.splice(index, 1);
  }

}]);