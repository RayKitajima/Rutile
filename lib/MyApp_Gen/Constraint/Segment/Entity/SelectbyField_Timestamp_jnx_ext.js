
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyApp_TMPL/Constraint/Segment/Entity/SelectbyField_Timestamp_jnx_ext.js';

var Uc_first = function(text){
	var f = text.charAt(0).toUpperCase();
	return f + text.substr(1);
};

/* view:

{
	APP_NAME : APP_NAME,
	
	segment     : segment of the entity,
	entity      : entity of the field,
	primary_key : primary key of the entity,
	
	junction : junction table,
	
	segment_jnx     : segment of the joined entity,
	entity_jnx      : joined entity,
	primary_key_jnx : primary key of joined entity,
	field_jnx       : field of the joined entity,
	search_type_jnx : search type of the joined field,
	
	Escape_reserved : function(){},
	Lc_first : function(){},
	Uc_first : function(){},
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
	var output_path   = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + '/Constraint/' + view.segment + '/' + view.entity + '/Selectby' + view.entity_jnx + Uc_first(view.field_jnx) + 'Timestamp.js';
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};

