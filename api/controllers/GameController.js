/******************
* Game Controller *
******************/

var Nightmare = require('nightmare');
var vo = require('vo');
var moment = require('moment');

module.exports = {

	scrapeGames: function(req, res) {

		function gameLoop(id) {
			var teamID = ["1610612738", "1610612742", "1610612751", "1610612766", "1610612741", "1610612739", "1610612737", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
			var teamName = ["BOS", "DAL", "BKN", "CHA", "CHI", "CLE", "ATL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
			var number = 4 - (id + "").length;
			for(var i = 0; i < number; i++) id = "0" + id;
			var url = "http://stats.nba.com/game/#!/002140" + id;
			vo(function* () {
			  	var nightmare = Nightmare();
			  	var result = yield nightmare
			    	.goto(url)
			    	.wait(".attend div")
			    	.evaluate(function (teamName, teamID) {
			    		var awayID = document.querySelectorAll(".team-city-name a")[0].href.split("/")[5];
			    		var homeID = document.querySelectorAll(".team-city-name a")[1].href.split("/")[5];
			    		var home = teamName[teamID.indexOf(homeID)];
			    		var away = teamName[teamID.indexOf(awayID)];
			    		var won, lost;
			    		var awayScore = document.querySelectorAll(".team-info h2")[0].innerText * 1;
			    		var homeScore = document.querySelectorAll(".team-info h2")[1].innerText * 1;
			    		if(awayScore > homeScore) {
			    			won = away;
			    			lost = home;
			    		} else {
			    			won = home;
			    			lost = away;
			    		}
			    		var date = document.querySelectorAll(".game-date span")[0].innerText;
			    		var ds = date;
			    		var months = ["J", "F", "M", "A", "X", "X", "X", "X", "X", "O", "N", "D"];
			    		var year = "2015";
			    		var day = date.split(",")[0].replace(/\D/g,'');
			    		var month = months.indexOf(date.charAt(0)) + "";
			    		if(month.length == 1) {
			    			month = "0" + month;
			    			year = "2014";
			    		}
			    		if(day.length == 1) day = "0" + day;
			    		date = year + " " + month + " " + day;
			    		var score = [awayScore, homeScore];
			    		var periods = document.querySelectorAll(".game-clock .ng-hide")[0].innerText * 1;
			    		var overtimes = periods - 4;
			    		var attendance = document.querySelectorAll(".attend div")[1].innerText.split(":")[1].trim().replace(",", "") * 1;
			    		var check = true;
			    		if(!attendance || !periods || !homeID) check = false;
						return [home, away, won, lost, score, overtimes, attendance, date, check];
			    	}, teamName, teamID);
				yield nightmare.end();
				return result;
			})(function (err, result) {
				vo(function* () {
					if(result[8]) {
						var store = yield Game.create({gameID:id, home:result[0], away:result[1], won:result[2], lost:result[3], score:result[4], overtimes:result[5], attendance:result[6], date:moment(result[7], "YYYY MM DD").toDate()})
						.then(function(created) {
							return ++created.gameID;
						}).catch(function (err) {
							console.log("ERROR");
						});
						return store;
					} else {
						console.log("Retry");
						return id;
					}
				})(function (err, result) {
					console.log(result);
					if(result < 1231) return gameLoop(result);
				});
			});
		}

		//gameLoop(1);
		return res.send(200);
	}
	
};

