'use strict';

angular.module('sbAdminApp')
  .controller('HomeCtrl', function ($http, $scope, SpringDataRestAdapter) {

  var librariesPromise = $http.get('http://localhost:8080/api/libraries');

  SpringDataRestAdapter.process(librariesPromise).then(function (processedReponse) {
    $scope.libraries = processedReponse._embeddedItems;
  });

});