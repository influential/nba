nbaApp.service('NBAService', function($http, $q) {
  return {
    'getPlayers': function() {
      var defer = $q.defer();
      $http.get('/player/getPlayers').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
	
	'getSalaries': function() {
      var defer = $q.defer();
      $http.get('/salary/getSalary').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },

    'getGames': function() {
      var defer = $q.defer();
      $http.get('/game/getGames').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },

    'getPerformances': function() {
      var defer = $q.defer();
      $http.get('/performance/getPerformances').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    }
}});
  