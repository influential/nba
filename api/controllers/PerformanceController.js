/*************************
* Performance Controller *
*************************/

var Nightmare = require('nightmare');
var async = require('async')
var vo = require('vo');

module.exports = {
	
	performances: function(req, res) {

		function insertLoop(perf, gameID) {
			if(perf[0] != undefined) {
				var name = perf[0];
				Player.findOne({name:name}).exec(function(err, found) {
					if(err) console.log(err);
					if(found) {
						Performance.create({gameID:perf[19], playerID:found.playerID, team:perf[1], time:perf[2], fgm:perf[3], fga:perf[4], tpm:perf[5], tpa:perf[6], ftm:perf[7], fta:perf[8], oreb:perf[9], dreb:perf[10], ast:perf[12], tov:perf[13], stl:perf[14], blk:perf[15], pf:perf[16], pts:perf[17], pm:perf[18]}).exec(function(err, created) {
							if(err) return "Error Inserting";
							return "Inserted";
						});
					} else {
						return "Not Found";
					}
				});
			} else {
				return "Error Inserting";
			}
			return "Fall";
		}

		function performanceLoop(gameID, callback) {
			vo(function* () {
				var nightmare = Nightmare({ waitTimeout: 5000 });
			  	var number = 4 - (gameID + "").length;
				for(var i = 0; i < number; i++) gameID = "0" + gameID;
				var url = "http://stats.nba.com/game/#!/002140" + gameID;
				var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
				var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		    	var result = yield nightmare.goto(url).inject("js", "node_modules/jquery/dist/jquery.js").wait(function() { 
		    		if($(".table-responsive tbody tr td")[0].innerText.length > 1) return true; })
		    		.evaluate(function(teamName, teamID, gameID) {
		    		var players = [];
		    		var divide = $($(document).find(".table-responsive tbody")[0]).find("tr").length;
		    		var awayID = $(document).find(".team-city-name a")[0].href.split("/")[5];
		    		var homeID = $(document).find(".team-city-name a")[1].href.split("/")[5];
		    		var away = teamName[teamID.indexOf(awayID)];
		    		var home = teamName[teamID.indexOf(homeID)];
		    		var team = away;
		    		$(".table-responsive tbody tr").each(function(i) {
						if(i >= divide) team = home;
		    			if($(this).find("td").length > 3) {
		    				var name = $(this).find("td")[0].innerText;
		    				var time = $(this).find("td")[1].innerText
		    				var minutes = time.split(":")[0] * 60;
		    				var seconds = time.split(":")[1] * 1;
		    				if(name.match(/\s-\s[A-Z]/)) name = name.substring(0, name.length - 4);
		    				var player = [name, team, minutes + seconds];
		    				for(var j = 2; j < 21; j++) {
		    					if(j != 4 && j != 7 && j != 10) {
		    						player.push($(this).find("td")[j].innerText * 1);
		    					}
		    				}
		    				player.push(gameID);
		    				players.push(player);
		    			}
					});
					return players;
		    	}, teamName, teamID, gameID);
				console.log(result);
				yield nightmare.end();
			  	return result;
			})(function (err, results) {
				return callback(null, results);
			});
		}

		function startLoop(gameID) {
			async.waterfall([
			    function(callback) {
			    	performanceLoop(gameID, callback);
			    }
			], function (err, result) {
				if(err || result == undefined) {
					console.log("Bad Results: " + gameID);
					return startLoop(gameID);
				} else {
					if(result.length < 1) {
						console.log("Empty Array: " + gameID);
						return startLoop(gameID);
					} else {
						async.map(result, insertLoop, function(err, results) {
							if(err) console.log(err);
						});
						console.log(gameID);
						if(gameID < 1231) { 
							return startLoop(++gameID);
						} else {
							console.log("done");
						}
					}
				}
				console.log("doneearly");
			});
		}

		process.setMaxListeners(1231);
		//startLoop(424);
		return res.send(200);
	}

};