
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyAppClient_TMPL/app/KitchenSink/controllers/Segment/Entity/Collection_Img/CollectionSearchForm.js';

/* view:

{
	
	APP_NAME    : app name,
	CLIENT_NAME : client application name,
	
	segment           : segment name of this field,
	entity            : entity name of this field,
	primary_key       : primary key of this entity,
	
	segment_collected     : segment name of collected entity
	entity_collected      : entity name to be collected
	primary_key_collected : primary key of the entity
	Fields_collected      : containing "fieldName" and "search_types" containing "search_type"
	
*/
var generate = function(options){
	var APP_NAME      = options['APP_NAME'];
	var CLIENT_NAME   = options['CLIENT_NAME'];
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
	var output_path = output_dir + '/' + CLIENT_NAME + '/app/controllers/KitchenSink/' + view.segment + '/' + view.entity + '/' + view.entity_collected + '/SearchForm.js';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/app/controllers/KitchenSink/' + view.segment + '/' + view.entity + '/' + view.entity_collected);
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};


