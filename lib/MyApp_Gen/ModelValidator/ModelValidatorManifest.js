
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyApp_TMPL/ModelValidator/ModelValidatorManifest.js';
var output_file   = 'ModelValidator/ModelValidatorManifest.js';

/* view:

{
	APP_NAME : APP_NAME,
	
	// list of all entities with its segment
	Entities : [ { segment:SEGMENT, entity:ENTITY, last:0|1 } ],
	
	Align_colon : function(){},
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
	var t_match = template_dir.match(/\/$/);
	if( t_match ){
		template_dir = template_dir.substr(0,t_match.index);
	}
	var o_match = output_dir.match(/\/$/);
	if( o_match ){
		output_dir = output_dir.substr(0,o_match.index);
	}
	// make path
	var template_path = template_dir + '/' + template_file;
	var output_path   = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + '/' + output_file;
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};

