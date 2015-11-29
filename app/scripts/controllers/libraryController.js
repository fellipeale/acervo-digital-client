'use strict';

angular.module('sbAdminApp')
  .controller('LibraryCtrl', function ($http, $scope, $state, $stateParams, SpringDataRestAdapter) {

  $scope.library = {};
  $scope.fields = [];
  $scope.presentationFields = [];
  $scope.records = [];

  $scope.editMode = false;

  $scope.selectedTab = 0;

  if ($stateParams.libraryId) {    
    loadLibrary();
    loadPresentationFields();
    loadFields();
    // loadRecords();    
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
      $http.put('http://localhost:8080/api/libraries/' + $stateParams.libraryId, $scope.library).then(function() {
        console.log('Library updated.');
        $scope.successMessage = 'Library updated.';
      }, function(response) {
        $scope.errorMessage = 'Problem while updating library: ' + response.data.message;
      });
    } else {
      $http.post('http://localhost:8080/api/libraries/', $scope.library).then(function(response) {
        console.log('Library saved.');
        $scope.successMessage = 'Library saved.';
        var generatedId = response.headers('Location').split('/').pop();
        $state.go('main.library', {libraryId: generatedId});
      }, function(response) {
        $scope.errorMessage = 'Problem while saving library: ' + response.data.message;
      });
    }
    $scope.editMode = false;
  }

  $scope.deleteField = function(id) {
    var fieldDeletionPromise = $http.delete('http://localhost:8080/api/fields/' + id);

    SpringDataRestAdapter.process(fieldDeletionPromise).then(function () {
      console.log('Field deleted.');
      $scope.successMessage = 'Field deleted.';
      loadFields();
    }, function(response) {
      $scope.errorMessage = 'Problem while deleting field: ' + response.data.message;
    });
  }

  $scope.deleteRecord = function(id) {
    var recordDeletionPromise = $http.delete('http://localhost:8080/api/records/' + id);

    SpringDataRestAdapter.process(recordDeletionPromise).then(function () {
      console.log('Record deleted.');
      $scope.successMessage = 'Record deleted.';
      loadRecords();
    }, function(response) {
      $scope.errorMessage = 'Problem while deleting record: ' + response.data.message;
    });
  }

  $scope.recordLibrary = function(id) {
    var recordDeletionPromise = $http.delete('http://localhost:8080/api/records/' + id);

    SpringDataRestAdapter.process(recordDeletionPromise).then(function () {
      console.log('Record deleted.');
      $scope.successMessage = 'Record deleted.';
      loadRecords();
    }, function(response) {
      $scope.errorMessage = 'Problem while deleting record: ' + response.data.message;
    });
  }

  function loadLibrary() {
    var libraryPromise = $http.get('http://localhost:8080/api/libraries/' + $stateParams.libraryId);

    SpringDataRestAdapter.process(libraryPromise).then(function (processedResponse) {
      $scope.library = processedResponse;
    });
  }

  function loadPresentationFields() {
    var presentationFieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByPresentationTrueAndLibraryId?id=' + $stateParams.libraryId);

    SpringDataRestAdapter.process(presentationFieldsPromise, 'fieldType').then(function (processedResponse) {
      $scope.presentationFields = processedResponse._embeddedItems;
      loadRecords();
    });
  }

  function loadFields() {
    var fieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByLibraryIdOrderBySequenceAsc?id=' + $stateParams.libraryId);

    SpringDataRestAdapter.process(fieldsPromise, 'fieldType').then(function (processedResponse) {
      $scope.fields = processedResponse._embeddedItems;
    });
  }

  function loadRecords() {
    var recordsPromise = $http.get('http://localhost:8080/api/records/search/findByLibraryId?id=' + $stateParams.libraryId);

    SpringDataRestAdapter.process(recordsPromise, ['contents', 'field'], true).then(function (processedResponse) {
      $scope.records = createPresentationRecords(processedResponse._embeddedItems);
    });
  }

  function createPresentationRecords(records) {
    if (records) {
      for (var i = 0; i<records.length; i++) {
        records[i].contents = records[i].contents._embeddedItems.filter(function(content) {
          return $scope.presentationFields.some(function(field) {
            return field.id === content.field.id;
          })
        }).sort(function(a, b) {
          return a.field.sequence - b.field.sequence;
        });
      }
    }
    return records;
  }

});
