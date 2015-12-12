/**
 * Route Mappings
 */

module.exports.routes = {
	
  '/start' : {view: 'start'},

  '/performances' : 'PerformanceController.performances', 

  '/': { view: 'homepage' }

};
