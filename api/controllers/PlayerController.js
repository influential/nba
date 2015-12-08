/********************
* Player Controller *
********************/

var Nightmare = require('nightmare');
var vo = require('vo');

module.exports = {
	
	getPlayers: function(req, res) {
        NBAService.getPlayers(function(players) {
            res.json(players);
        });
    },

	reference: function(req, res) {

		function teamLoop(teamID, teamName, counter, index) {
			if(index < teamID.length) {
				var url = "http://stats.nba.com/league/player/#!/?Season=2014-15&SeasonType=Regular%20Season&TeamID=" + teamID[index];
				vo(function* () {
				  	var selector = ".table-responsive table tbody .first a";
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.wait(1000)
				    	.evaluate(function (selector) {
				    		var names = [];
				    		var list = document.querySelectorAll(selector);
							for(var name in list) names.push(list[name].innerText);
							return names.filter(function(n){ return n != undefined });
				    	}, selector);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					vo(function() {
						playerLoop(0, result, teamName[index]);
						return;
					})(function(err, res) {
						teamLoop(teamID, teamName, counter, ++index);
					});
				});
			} else {
				return;
			}
		}

		function playerLoop(index, result, playerTeam) {
			if(index < result.length) {
				Player.find({name:result[index]}).exec(function(err, found) {
					if(found.length > 0) {
						if(found[0].teams.indexOf(playerTeam) < 0) {
							var teams = found[0].teams;
							teams.push(playerTeam);
							Player.update({name:result[index]}, {teams:teams, traded:true}).exec(function(err, updated) {
								playerLoop(++index, result, playerTeam);
							});
						} else {
							playerLoop(++index, result, playerTeam);
						}
					} else {
						Player.create({playerID:counter, teams:[playerTeam], name:result[index], traded:false}).exec(function(err, created) {
							if(created) {
								counter++;
							}
							playerLoop(++index, result, playerTeam);
						});
					}
				});
			} else {
				return;
			}
		}

		process.setMaxListeners(30);
		var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
		var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		var counter = 1;
		teamLoop(teamID, teamName, counter, 0);
	},

	games: function(req, res) {

		function gameLoop(id) {
			if(id > 10) {
				var url = "http://stats.nba.com/game/#!/" + id;
				vo(function* () {
				  	var selector = ".attendance div";
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.wait(1000)
				    	.evaluate(function (selector) {
				    		var query = document.querySelectorAll(selector);
							return query[1].innerText;
				    	}, selector);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					console.log(result);
					gameLoop(++id);
				});
			} else {
				return
			}
		}

		gameLoop(1);
	}

};

