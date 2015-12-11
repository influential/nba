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
	$scope.players.salary = [];
	console.log($scope.players);
  });
  
  NBAService.getSalaries().then(function(response) {
    $scope.salaries = response;
	$scope.players.salary = [];
	for (var i = 0; i < $scope.salaries.length; ++i) {
		for (var j = 0; j < $scope.players.length; ++j) {
			if ($scope.players[j].playerID === $scope.salaries[i].playerID){
				if ($scope.players[j].salary == undefined){
					$scope.players[j].salary = [$scope.salaries[i]];
				}
				else{
					$scope.players[j].salary.push($scope.salaries[i]);
				}
			}
		}
	}
	console.log($scope.salaries);
  });
 
}]);