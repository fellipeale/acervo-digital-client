'use strict';

angular.module('sbAdminApp')
  .controller('FieldCtrl', ['$http', '$scope', '$state', '$stateParams', 'SpringDataRestAdapter', function ($http, $scope, $state, $stateParams, SpringDataRestAdapter) {

  $scope.fieldTypes = [];
  $scope.field = {};

  $scope.editMode = false;

  var fieldTypesPromise = $http.get('http://localhost:8080/api/field-types/');

  SpringDataRestAdapter.process(fieldTypesPromise).then(function (processedResponse) {
    $scope.fieldTypes = processedResponse._embeddedItems;
  });

  if ($stateParams.fieldId) {
    var fieldPromise = $http.get('http://localhost:8080/api/fields/' + $stateParams.fieldId);

    SpringDataRestAdapter.process(fieldPromise, 'fieldType').then(function (processedResponse) {
      $scope.field = processedResponse;
    });
  } else {
    $scope.field['active'] = true;
    $scope.field['multiple'] = false;
    $scope.field['mandatory'] = false;
    $scope.field['presentation'] = false;
    $scope.editMode = true;
  }  

  $scope.toggleEditMode = function() {
    $scope.editMode = !$scope.editMode;
  }

  $scope.submit = function() {
    if ($stateParams.fieldId) {
      $http.put('http://localhost:8080/api/fields/' + $stateParams.fieldId, $scope.field).then(function() {
        console.log('Field updated.');
        $scope.successMessage = 'Field updated.';
      }, function(response) {
        $scope.errorMessage = 'Problem while updating field: ' + response.data.message;
      });
    } else if ($stateParams.libraryId) {
      $scope.field['library'] = 'http://localhost:8080/api/libraries/' + $stateParams.libraryId
      $http.post('http://localhost:8080/api/fields/', $scope.field).then(function(response) {
        console.log('Field saved.');
        $scope.successMessage = 'Field saved.';
        var generatedId = response.headers('Location').split('/').pop();
        $state.go('main.library.field', {fieldId: generatedId});
      }, function(response) {
        $scope.errorMessage = 'Problem while saving field: ' + response.data.message;
      });
    }
    $scope.editMode = false;
  }

}]);