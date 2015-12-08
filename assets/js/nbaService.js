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
    }
}});
  