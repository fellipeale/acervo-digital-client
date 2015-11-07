'use strict';

angular.module('sbAdminApp')
  .controller('RecordCtrl', ['$http', '$scope', '$stateParams', 'SpringDataRestAdapter', function ($http, $scope, $stateParams, SpringDataRestAdapter) {

  var recordPromise = $http.get('http://localhost:8080/api/records/' + $stateParams.recordId);

  SpringDataRestAdapter.process(recordPromise, ['contents', 'field'], true).then(function (processedResponse) {
    $scope.record = processedResponse;
  });

}]);