/********************
* Player Controller *
********************/

var http = require("http"); 

module.exports = {

	reference: function(req, res) {
	var options = {
		host: "stats.nba.com",
		port: 80,
		path: ""
	};
	http.get(options, function(resp) {
		var body = "";
		resp.on("data", function(chunk) {
			body += chunk;
		}).on("end", function() {
			var counter = 0;
			var lines = body.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)[1].split(/\r\n|\r|\n/);
			for(var line in lines) {
				var team = "";
				var name = "";
				Player.create({playerID:counter, team:team, name:name}).exec(function(err, created) {
					if(created) {
						counter++;
					} else {
						console.log("Couldn't Add: ");
					}
				});
			}
		});
	}

};

