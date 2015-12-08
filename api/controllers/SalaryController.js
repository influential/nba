/********************
* Salary Controller *
********************/

var http = require("http"); 

module.exports = {
	
	salary: function(req, res) {

		var months = [10,11,12,1,2,3,4];
		var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
		var players = [];
		var start = 100;
		for(var month in months) {
			for(var day in days) {
				var year = months[month] > 5 ? "2014" : "2015";
				var date = new Date(year, months[month] - 1, days[day], "", "", "", "");
				var options = {
					host: "rotoguru1.com",
					port: 80,
					path: "/cgi-bin/hyday.pl?game=fd&mon=" + months[month] + "&day=" + days[day] + "&year=" + year + "&scsv=1:80"
				};
				http.get(options, function(resp) {
					var body = "";
					resp.on("data", function(chunk) {
						body += chunk;
					}).on("end", function() {
						var lines = body.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)[1].split(/\r\n|\r|\n/);
						for(var line in lines) {
							if(line > 0 && lines[line].length > 10) {
								var section = lines[line].split(";");
								if(!section[2].match("NA")) {
									var first = section[3].split(",")[1].trim();
									var last = section[3].split(",")[0].trim();
									var full = first + " " + last;
									var salary = parseInt(section[6].replace(/\$|,/g, ""));
									Player.find({name:full}).exec(function createCB(err, found) {
										if(found) {
											var playerID = created.playerID;
											Salary.create({date:date, playerID:playerID, salary:salary}).exec(function(err, created) {});
										}
									});
								}
							}
						}
					});
				}).on("error", function(e) {
					console.log(e.message);
				});
			}
		}
	}

};

