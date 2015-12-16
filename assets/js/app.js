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
	$scope.performances = [];
	$scope.games = [];

	NBAService.getPerformances().then(function(response) {

    	$scope.performances = response.slice(0, 1000); //Too many performances, so we are taking just 10%;

    	NBAService.getGames().then(function(response) {
	    	$scope.games = response;
	    	for (var i = 0; i < $scope.performances.length; i++) {
		    	for(var m = 0; m < $scope.games.length; m++) {
					if($scope.games[m].gameID == $scope.performances[i].gameID) {
						$scope.performances[i].game = $scope.games[m];
						break;
					}
				}
			}
	  	});

    	NBAService.getPlayers().then(function(response) {
	    	$scope.players = response;
	    	for (var i = 0; i < $scope.performances.length; i++) {
		    	for(var j = 0; j < $scope.players.length; j++) {
					if($scope.players[j].playerID == $scope.performances[i].playerID) {
						$scope.performances[i].player = $scope.players[j];
						break;
					}
				}
			}
	  	});

	  	/*NBAService.getSalaries().then(function(response) {
	    	$scope.salaries = response;
	    	for (var i = 0; i < $scope.performances.length; i++) {
				for(var k = 0; k < $scope.salaries.length; k++) {
					if($scope.salaries[k].playerID == $scope.performances[i].playerID && $scope.salaries[k].month == $scope.performances[i].game.date) {
						$scope.performances[i].salary = $scope.salaries[k].salary;
						break;
					}
				}
			}
	  	});*/

  	});
 
}]);