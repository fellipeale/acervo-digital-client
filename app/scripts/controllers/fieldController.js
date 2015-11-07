'use strict';

angular.module('sbAdminApp')
  .controller('FieldCtrl', ['$http', '$scope', '$stateParams', 'SpringDataRestAdapter', function ($http, $scope, $stateParams, SpringDataRestAdapter) {

  var fieldPromise = $http.get('http://localhost:8080/api/fields/' + $stateParams.fieldId);

  SpringDataRestAdapter.process(fieldPromise).then(function (processedResponse) {
    $scope.field = processedResponse;
  });

}]);