/**
 * Route Mappings
 */

module.exports.routes = {
	
  '/start' : {view: 'start'},

  '/salary': 'SalaryController.salary',

  '/player' : 'PlayerController.reference',

  '/games' : 'PlayerController.games'

};
