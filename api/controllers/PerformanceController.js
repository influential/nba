/*************************
* Performance Controller *
*************************/

module.exports = {
	
	performances: function(req, res) {

		function boxLoop(id) {
			if(id < 2) { //1231
				var url = "http://stats.nba.com/game/#!/" + id;
				vo(function* () {
				  	var selector = ".attendance div";
				  	var nightmare = Nightmare({ show: true });
				  	var link = yield nightmare
				    	.goto(url)
				    	.evaluate(function () {
				    		var attendance = document.querySelectorAll(".attendance div")[1].innerText;
				    		var attendance = document.querySelectorAll(".attendance div")[1].innerText;
							return [attendance];
				    	}, selector);
				  	yield nightmare.end();
				  	return link;
				})(function (err, result) {
					console.log(result);
					boxLoop(++id);
				});
			} else {
				return;
			}
		}

		boxLoop(1);
		/*advancedLoop(1);
		miscLoop(1);
		scoringLoop(1);
		usageloop(1);
		factorLoop(1);
		trackingLoop(1);*/
	}

};

