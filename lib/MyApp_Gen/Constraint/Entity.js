
// just create entity folders
// be sure segments folders are ready

var fs = require('fs');
var Mustache = require('mustache');

/* view:

{
	APP_NAME : APP_NAME,
	
	// list of all entities with its segment
	Entities : [
		{
			segment : SEGMENT,
			entity : ENTITY
		}
	],
}

*/
var generate = function(options){
	var APP_NAME      = options['APP_NAME'];
	var SERVER_NAME   = options['SERVER_NAME'];
	var template_dir  = options['template_dir'];
	var output_dir    = options['output_dir'];
	var view          = options['view'];
	var tools         = options['tools'];
	
	// apply functions
	tools.apply(view);
	
	// remove trailing slash
	var o_match = output_dir.match(/\/$/);
	if( o_match ){
		output_dir = output_dir.substr(0,o_match.index);
	}
	// make path
	var base_dir = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + '/Constraint';
	
	// make dirs
	for( var i=0; i<view.Entities.length; i++ ){
		if( view.Entities[i].collection ){ continue; }
		var segmentName = view.Entities[i].segment;
		var entityName  = view.Entities[i].entity;
		var dir = base_dir + '/' + segmentName + '/' + entityName;
		if( !fs.existsSync(dir) ){ fs.mkdirSync(dir) };
	}
};

module.exports = {
	generate : generate
};

