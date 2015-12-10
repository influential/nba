/**
 * Route Mappings
 */

module.exports.routes = {
	
  '/start' : {view: 'start'},

  '/salary': 'SalaryController.salary',

  '/players' : 'PlayerController.players',

  '/games' : 'GameController.games', 

  '/performances' : 'PerformanceController.performances', 

  '/': { view: 'homepage' }

};
