/**
 * Route Mappings
 */

module.exports.routes = {
	
  '/start' : {view: 'start'},

  '/salary': 'SalaryController.salary',

  '/player' : 'PlayerController.players',

  '/games' : 'GameController.games', 

  '/': { view: 'homepage' }

};
