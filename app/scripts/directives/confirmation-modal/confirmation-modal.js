'use strict';

angular.module('sbAdminApp', ['ui.bootstrap'])
  .directive('confirmationModal', ['$modal', function ($modal) {

    var ModalInstanceCtrl = function($scope, $modalInstance) {
      $scope.yes = function() {
        $modalInstance.close();
      };

      $scope.no = function() {
        $modalInstance.dismiss('cancel');
      };
    };

    return {
      restrict: 'A',
      scope: {
        confirmationModal:"&"
      },
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          var modalInstance = $modal.open({
            templateUrl: 'scripts/directives/confirmation-modal/confirmation-modal.html',
            controller: ModalInstanceCtrl
          });
          modalInstance.result.then(function() {
            scope.confirmationModal();
          }, function() {
            //Modal dismissed
          });
        });
      }
    }
  }]);