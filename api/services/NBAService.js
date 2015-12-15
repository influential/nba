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
  }
};