'use strict';

angular.module('sbAdminApp')
  .directive('headerSearch',function(){
    return {
        templateUrl:'scripts/directives/header/header-search/header-search.html',
        restrict: 'E',
        replace: true,
      }
  });