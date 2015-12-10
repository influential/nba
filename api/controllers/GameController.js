/******************
* Game Controller *
******************/

var Nightmare = require('nightmare');
var vo = require('vo');

module.exports = {

	games: function(req, res) {

		function gameLoop(id, teamID, teamName) {
			if(id < 74) { //1231
				var number = 4 - (id + "").length;
				for(var i = 0; i < number; i++) id = "0" + id;
				var url = "http://stats.nba.com/game/#!/002140" + id;
				vo(function* () {
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.wait(1000)
				    	.evaluate(function (teamName, teamID) {
				    		var awayID = document.querySelectorAll(".team-city-name a")[0].href.split("/")[5];
				    		var homeID = document.querySelectorAll(".team-city-name a")[1].href.split("/")[5];
				    		var home = teamName[teamID.indexOf(homeID)];
				    		var away = teamName[teamID.indexOf(awayID)];
				    		var won, lost;
				    		var awayScore = document.querySelectorAll(".team-info h2")[0].innerText;
				    		var homeScore = document.querySelectorAll(".team-info h2")[1].innerText;
				    		if(awayScore > homeScore) {
				    			won = away;
				    			lost = home;
				    		} else {
				    			won = home;
				    			lost = away;
				    		}
				    		var score = [awayScore, homeScore];
				    		var periods = document.querySelectorAll(".game-clock .ng-hide")[0].innerText * 1;
				    		var overtimes = periods - 4;
				    		var attendance = document.querySelectorAll(".attend div")[1].innerText.split(":")[1].trim().replace(",", "") * 1;
				    		var date = document.querySelectorAll(".game-date span")[0].innerText;
							return [home, away, won, lost, score, overtimes, attendance, date];
				    	}, teamName, teamID);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					if(err) console.log(err);
					Game.create({gameID:id, home:result[0], away:result[1], won:result[2], lost:result[3], score:result[4], overtimes:result[5], attendance:result[6], date:new Date(result[7])}).exec(function(err, created) {
						if(err) console.log(err);
						if(created) {
							gameLoop(++id, teamID, teamName);
						} else {
							console.log("Failed to create game " + id);
							gameLoop(++id, teamID, teamName);
						}
					});
				});
			} else {
				return;
			}
		}

		var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
		var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		gameLoop(72, teamID, teamName);
	}
	
};

