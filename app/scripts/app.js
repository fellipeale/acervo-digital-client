'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngResource',
    'spring-data-rest'
  ])
  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    
    $ocLazyLoadProvider.config({
      debug:false,
      events:true,
    });

    $urlRouterProvider.otherwise('/main/home');

    $stateProvider
      .state('main', {
        url:'/main',
        templateUrl: 'views/pages/main.html',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/directives/header/header.js',
                  'scripts/directives/header/header-notification/header-notification.js'
                ]
            })
          }
        }
      })  
      .state('main.home',{
        templateUrl:'views/pages/home.html',
        url:'/home',
        controller:'HomeCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/homeController.js'
                ]
            })
          }
        }
      })
      .state('main.library',{
        templateUrl:'views/pages/library.html',
        url:'/library/:libraryId',
        controller:'LibraryCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/libraryController.js'
                ]
            })
          }
        }
      })
      .state('main.library.field',{
        templateUrl:'views/pages/field.html',
        url:'/field/:fieldId',
        controller:'FieldCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/fieldController.js'
                ]
            })
          }
        }
      })
      .state('main.library.record',{
        templateUrl:'views/pages/record.html',
        url:'/record/:recordId',
        controller:'RecordCtrl',
        resolve: {
          loadMyFile:function($ocLazyLoad) {
            return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/recordController.js'
                ]
            })
          }
        }
      })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login'
      })
  }]);

    
