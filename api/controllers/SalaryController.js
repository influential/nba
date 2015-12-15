/********************
* Salary Controller *
********************/

var http = require("http"); 
var async = require('async');
var moment = require('moment');

module.exports = {
	
	getSalary: function(req, res) {
        NBAService.getSalary(function(salaries) {
            res.json(salaries);
        });
    },
	
	scrapeSalaries: function(req, res) {

		function insertSalary(entry) {
			var line = entry[0];
			var date = entry[1];
			var section = line.split(";");
			if(!section[2].match("NA")) {
				var first = section[3].split(",")[1].trim();
				var last = section[3].split(",")[0].trim();
				var full = first + " " + last;
				var salary = parseInt(section[6].replace(/\$|,/g, ""));
				Player.findOne({name:full}).exec(function createCB(err, found) {
					if(found) {
						Salary.create({date:date, playerID:found.playerID, salary:salary}).exec(function(err, created) {
							if(created) return "Created";
							else return "Not Created";
						});
					} else {
						return "Not Found";
					}
				});
			} else {
				return "NA";
			}
		}

		function salaryLoop(year, month, day) {
			var date = moment(year + " " + month + " " + day, "YYYY MM DD").toDate();
			var options = {
				host: "rotoguru1.com",
				port: 80,
				path: "/cgi-bin/hyday.pl?game=fd&mon=" + month + "&day=" + day + "&year=" + year + "&scsv=1:80"
			};
			http.get(options, function(resp) {
				var body = "";
				resp.on("data", function(chunk) {
					body += chunk;
				}).on("end", function() {
					var salaries = [];
					var lines = body.match(/<pre[^>]*>([\s\S]*?)<\/pre>/)[1].split(/\r\n|\r|\n/);
					for(var line in lines) {
						if(line > 0 && lines[line].length > 10) salaries.push([lines[line], date]);
					}
					async.map(salaries, insertSalary, function(err, results){
						if(err) console.log(err);
					});
				});
			}).on("error", function(e) {
				console.log(e.message);
			});
		}

		function startLoop(year, month, day) {
			async.waterfall([
				function(callback) {
			    	salaryLoop(year, month, day);
			    	callback(null)
			    },
			    function(callback) {
			    	if(day > 30) {
						if(month > 11) {
							year = 2015;
							month = 1;
							day = 1;
						} else {
							month++;
							day = 1;
						}
					} else {
						day++;
					}
			        callback(null, [year, month, day]);
			    }
			], function (err, results) {
				console.log(results);
			    if(results[1] == 5) return;
			    else startLoop(results[0], results[1], results[2]);
			});
		}

		//startLoop(2014, 10, 28);
		return res.send(200);
	}

};

