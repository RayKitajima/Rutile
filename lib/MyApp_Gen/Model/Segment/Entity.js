
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyApp_TMPL/Model/Segment/Entity.js';

/* view:

{
	APP_NAME : APP_NAME,
	
	segment : segment of the entity,
	entity  : entity,
	
	primary_key        : primary key of this entity,
	primary_key_holder : fields.length+1
	sequence           : sequence generator
	
	// list of field
	Fields : [ { field:FIELD, holder:$N, last:0|1 } ],
	
	// holders for primary key and all fields
	Holders : [ '$1','$2',...'$field.length+1' ],
	
	// resolve aggregation
	Collection  : [ entityDef of collection ]
	Aggregation : [ {Segment/Entity,Entity} list of aggregation to load modules in this Entity module ],
	
	Align_colon  : function(){},
	Align_equals : function(){},
	
	Lc_all : function(){},
	Lc_first : function(){},
	Uc_first : function(){},
	Cut_trail_id : function(){},
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
	var output_path = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + '/Model/' + view.segment + '/' + view.entity + '.js';
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};

