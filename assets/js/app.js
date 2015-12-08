'use strict';

var nbaApp = angular.module('nbaApp', ['ngRoute', 'ui.bootstrap']);
nbaApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/templates/nba.html',
      controller: 'NBAController'
    }).otherwise({
      redirectTo: '/',
      caseInsensitiveMatch: true
    })
  }]);

nbaApp.controller('NBAController', ['$scope', '$rootScope', 'NBAService', function($scope, $rootScope, NBAService) {
  $scope.formData = {};
  $scope.players = [];
  $scope.salaries = [];

  NBAService.getPlayers().then(function(response) {
    $scope.players = response;
	console.log($scope.players);
  });
}]);