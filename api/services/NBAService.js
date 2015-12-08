module.exports = {
  getPlayers: function(next) {
    Player.find().exec(function(err, players) {
      if(err) throw err;
      next(players);
    });
  }
};