/********************
* Player Controller *
********************/

var http = require("http");
var Nightmare = require('nightmare');
var vo = require('vo');

module.exports = {
	getPlayers: function(req, res) {
        NBAService.getPlayers(function(players) {
            res.json(players);
        });
    },
	reference: function(req, res) {
		var teamID = ["1610612737", "1610612738"];//, "1610612751", "1610612766", "1610612741", "1610612739", "1610612742", "1610612743", "1610612765", "1610612744", "1610612745", "1610612754", "1610612746", "1610612747", "1610612763", "1610612748", "1610612749", "1610612750", "1610612740", "1610612752", "1610612760", "1610612753", "1610612755", "1610612756", "1610612757", "1610612758", "1610612759", "1610612761", "1610612762", "1610612764"];
		var teamName = ["ATL", "BOS", "BKN", "CHA", "CHI", "CLE", "DAL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"];
		var counter = 0;
		for(var team in teamID) {
			var url = "http://stats.nba.com/league/player/#!/?Season=2014-15&SeasonType=Regular%20Season&TeamID=" + teamID[team];
			vo(function* () {
			  	var selector = ".table-responsive table tbody .first a";
			  	var nightmare = Nightmare({ show: true });
			  	var link = yield nightmare
			    	.goto(url)
			    	.evaluate(function (selector) {
			    		var names = [];
			    		var list = document.querySelectorAll(selector);
			    		for(var name in list) names.push(list[name].innerText);
			    		return names;
			    	}, selector);
			  	yield nightmare.end();
			  	return link;
			})(function (err, result) {
			  	if (err) return console.log(err);
			  	console.log(result);
			  	//for(var name in result) console.log(result[name].innerText);
			});
		}



					/*for(var line in lines) {
						var playerTeam = [];
						playerTeam.push(teamName[team]);
						var playerName = "";
						var searchName = "";

						Player.create({playerID:counter, team:playerTeam, name:playerName, traded:false}).exec(function(err, created) {
							if(created) {
								counter++;
							} else {
								console.log("Couldn't Add: ");
							}
						});
					}*/

	}

};

