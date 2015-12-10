/*************************
* Performance Controller *
*************************/

var Nightmare = require('nightmare');
var vo = require('vo');

module.exports = {
	
	performances: function(req, res) {

		function insertLoop(perf, gameID) {
			var name = perf[0];
			Player.findOne({name:name}).exec(function(err, created) {
				if(err) console.log(err);
				if(created) {
					Performance.create({gameID:gameID, playerID:created.playerID, team:perf[1], time:perf[2], fgm:perf[3], fga:perf[4], tpm:perf[5], tpa:perf[6], ftm:perf[7], fta:perf[8], oreb:perf[9], dreb:perf[10], ast:perf[11], tov:perf[12], stl:perf[13], blk:perf[14], pf:perf[15], pts:perf[16], pm:perf[17]}).exec(function(err, created) {
						if(err) console.log(err);
					});
				}
			});
		}

		function performanceLoop(gameID, teamID, teamName) {
			if(gameID < 2) { //1231
				var number = 4 - (gameID + "").length;
				for(var i = 0; i < number; i++) gameID = "0" + gameID;
				var url = "http://stats.nba.com/game/#!/002140" + gameID;
				vo(function* () {
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.wait(1000)
				    	.evaluate(function (teamName, teamID) {
				    		var players = [];
				    		var awayID = document.querySelectorAll(".team-city-name a")[0].href.split("/")[5];
				    		var homeID = document.querySelectorAll(".team-city-name a")[1].href.split("/")[5];
				    		var home = teamName[teamID.indexOf(homeID)];
				    		var away = teamName[teamID.indexOf(awayID)];
				    		var awayPlayers = document.querySelectorAll(".table-responsive tbody")[0];
				    		var homePlayers = document.querySelectorAll(".table-responsive tbody")[1];
				    		var awayCount = awayPlayers.querySelectorAll("tr").length;
				    		var rows = document.querySelectorAll(".table-responsive tbody tr").length;
				    		var team = away;
				    		for(var i = 0; i < rows; i++) {
				    			if(i >= awayCount) team = home;
				    			var row = document.querySelectorAll(".table-responsive tbody tr")[i];
				    			var columns = row.querySelectorAll("td").length;
				    			if(columns > 3) {
				    				var name = row.querySelectorAll("td")[0].innerText;
				    				var minutes = row.querySelectorAll("td")[1].innerText.split(":")[0] * 60;
				    				var seconds = row.querySelectorAll("td")[1].innerText.split(":")[1] * 1;
				    				if(name.match(/\s-\s[A-Z]/)) name = name.substring(0, name.length - 4);
				    				var player = [name, team, minutes + seconds];
				    				for(var j = 2; j < columns; j++) {
				    					if(j != 4 && j != 7 && j != 10) {
				    						player.push(row.querySelectorAll("td")[j].innerText * 1);
				    					}
				    				}
				    				players.push(player);
				    			}
				    		}
							return players;
				    	}, teamName, teamID);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					if(err) console.log(err);
					for(var index in result) {
						insertLoop(result[index], gameID);
					}
				});
			} else {
				return;
			}
		}

		var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
		var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		performanceLoop(1, teamID, teamName);
	}

};

