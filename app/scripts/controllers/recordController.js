'use strict';

angular.module('sbAdminApp')
  .controller('RecordCtrl', ['$http', '$scope', '$state', '$stateParams', 'SpringDataRestAdapter', '$q', 'Upload', '$timeout', '$sce', function ($http, $scope, $state, $stateParams, SpringDataRestAdapter, $q, Upload, $timeout, $sce) {

  $scope.libraryId = $stateParams.libraryId;

  $scope.fields = [];
  $scope.record = {};
  $scope.contents = [];

  $scope.editMode = false;

  var fieldsPromise = $http.get('http://localhost:8080/api/fields/search/findByLibraryIdOrderBySequenceAsc?id=' + $stateParams.libraryId);

  SpringDataRestAdapter.process(fieldsPromise, 'fieldType').then(function (processedResponse) {
    $scope.fields = processedResponse._embeddedItems;
  });

  if ($stateParams.recordId) {
    var recordPromise = $http.get('http://localhost:8080/api/records/' + $stateParams.recordId);

    SpringDataRestAdapter.process(recordPromise).then(function (processedResponse) {
      $scope.record = processedResponse;
    });

    var contentsPromise = $http.get('http://localhost:8080/api/contents/search/findByRecordId?id=' + $stateParams.recordId);

    SpringDataRestAdapter.process(contentsPromise, ['field', 'fieldType'], true).then(function (processedResponse) {
      for (var i = 0; i<processedResponse._embeddedItems.length; i++) {
        $scope.contents[i] = processedResponse._embeddedItems[i];
      }
    });
  } else {
    $scope.record['active'] = true;
    $scope.editMode = true;
  }

  $scope.toggleEditMode = function() {
    $scope.editMode = !$scope.editMode;
  }

  $scope.submit = function() {
    if ($stateParams.recordId) {

      var record = angular.copy($scope.record);
      record['contents'] = angular.copy($scope.contents);
      var promises = [];

      record.contents.forEach(function(content) {
        content.field = 'http://localhost:8080/api/fields/' + content.field.id;
        var contentPromise = function(content) {
          if (content.id) {
            return $http.put('http://localhost:8080/api/contents/' + content.id, content).then(function(response) {
              console.log('Content updated.');
              record.contents[record.contents.indexOf(content)] = response.headers('Location');
            }, function(response) {
              $scope.errorMessage = 'Problem while updating content: ' + response.data.message;
            });
          } else {
            return $http.post('http://localhost:8080/api/contents/', content).then(function(response) {
              console.log('Content saved.');
              record.contents[record.contents.indexOf(content)] = response.headers('Location');
            }, function(response) {
              $scope.errorMessage = 'Problem while saving content: ' + response.data.message;
            });
          }
        }
        promises.push(contentPromise(content));
      });

      $q.all(promises).then(function() {
        $http.put('http://localhost:8080/api/records/' + $stateParams.recordId, record).then(function() {
          console.log('Record updated.');
          $scope.successMessage = 'Record updated.';
        }, function(response) {
          $scope.errorMessage = 'Problem while updating record: ' + response.data.message;
        })
      });
    } else {
      var record = $scope.record;
      record['contents'] = $scope.contents;
      record['library'] = 'http://localhost:8080/api/libraries/' + $stateParams.libraryId;
      var promises = [];

      record.contents.forEach(function(content) {
        content.field = 'http://localhost:8080/api/fields/' + content.field.id;
        promises.push(
          $http.post('http://localhost:8080/api/contents/', content).then(function(response) {
            console.log('Content saved.');
            record.contents[record.contents.indexOf(content)] = response.headers('Location');
          }, function(response) {
            $scope.errorMessage = 'Problem while saving content: ' + response.data.message;
          })
        );
      });

      $q.all(promises).then(function() {
        $http.post('http://localhost:8080/api/records/', record).then(function(response) {
          console.log('Record saved.');
          $scope.successMessage = 'Record saved.';
          var generatedId = response.headers('Location').split('/').pop();
          $state.go('main.library.record', {recordId: generatedId});
        }, function(response) {
          $scope.errorMessage = 'Problem while saving record: ' + response.data.message;
        })
      });
    }
    $scope.editMode = false;
  }

  $scope.initContents = function(fields) {
    $scope.contents = [];
    for (var i = 0; i < fields.length; i++) {
      $scope.contents[i] = {};
      // $scope.contents[i]['field'] = 'http://localhost:8080/api/fields/' + fields[i].id;
      $scope.contents[i]['field'] = fields[i];
      $scope.contents[i]['values'] = [];
      $scope.contents[i].values[0] = {};
      $scope.contents[i].values[0]['type'] = fields[i].fieldType.key;
    }
  }

  $scope.addValue = function(content) {
    var newValue = angular.copy(content.values[0]);
    content.values.push(newValue);
  }

  $scope.removeValue = function(content, index) {
    content.values.splice(index, 1);
  }

  $scope.uploadingFile = false;

  $scope.uploadFile = function(value) {
    if (value.file) {
      $scope.file = value.file

      value.file.upload = Upload.upload({
        url: 'http://localhost:8080/upload',
        data: {libraryId: $stateParams.libraryId, fileName: value.file.name, file: value.file}
      });

      value.file.upload.then(function (response) {
          $timeout(function () {
            value.file.result = response.data;
            value.path = response.data.path;
            value.name = response.data.name;
            value.originalName = value.file.name;
            value.fileType = value.file.type;
            value.size = value.file.size;
            $scope.successMessage = 'File uploaded.';
          });
        }, function (response) {
          if (response.status > 0) {
            $scope.errorMessage = 'Problem while uploading file: ' + response.data.message;
          }
        }, function (evt) {
          value.file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }
  }

  $scope.getMIME = function(fieldType) {
    if (fieldType == 'IMAGE') {
      return 'image/*';
    } else if (fieldType == 'VIDEO') {
      return 'video/*';
    } else if (fieldType == 'AUDIO') {
      return 'audio/*';
    } else {
      return '';
    }
  }

  $scope.trustUrl = function(url) {
    return $sce.trustAsResourceUrl('http://localhost:8080/download' + url);
  }

}]);