/******************
* Game Controller *
******************/

module.exports = {

	games: function(req, res) {

		function gameLoop(id) {
			if(id < 2) { //1231
				var url = "http://stats.nba.com/game/#!/002140" + id;
				vo(function* () {
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.evaluate(function () {
				    		var homeID = document.querySelectorAll(".team-city-name a")[0].href.split("/")[3];
				    		var awayID = document.querySelectorAll(".team-city-name a")[1].href.split("/")[3];
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
				    		var periods = document.querySelectorAll(".game-clock span")[1].innerText * 1;
				    		var overtimes = periods - 4;
				    		var attendance = document.querySelectorAll(".attendance div")[1].innerText;
				    		var date = new Date(document.querySelectorAll(".game-date span")[0].innerText);
							return [home, away, won, lost, score, overtimes, attendance, date];
				    	}, selector);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					if(err) return res.send("Error");
					console.log(result);
					gameLoop(++id);
				});
			} else {
				return;
			}
		}

		var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
		var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		gameLoop(1);
		return res.send("Success");
	}
	
};

