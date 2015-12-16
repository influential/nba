module.exports = {
  getPlayers: function(next) {
    Player.find().exec(function(err, players) {
      if(err) throw err;
      next(players);
    });
  },
  getSalary: function(next) {
    Salary.find().exec(function(err, salaries) {
      if(err) throw err;
      next(salaries);
    });
  },
  getGames: function(next) {
    Game.find().exec(function(err, games) {
      if(err) throw err;
      next(games);
    });
  },
  getPerformances: function(next) {
    Performance.find().exec(function(err, performances) {
      if(err) throw err;
      next(performances);
    });
  }
};