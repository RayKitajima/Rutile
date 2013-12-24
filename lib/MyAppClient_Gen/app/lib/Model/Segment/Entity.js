
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyAppClient_TMPL/app/lib/Model/Segment/Entity.js';

/* view:

{
	
	APP_NAME    : app name,
	CLIENT_NAME : client application name,
	
	segment           : segment name of this field,
	entity            : entity name of this field,
	primary_key       : primary key of this entity,
	
	Fields            : containing "fieldName" and "helper"
	
	Aggregation : has "aggregation_segmentName" and "aggregation_entityName"
	
					ex) aggregation_segmentName:Product, aggregation_entityName:ProductProductImage,
						primary_key_collected:productImageID, segment_collected:Product, entity_collected:ProductImage

	Fields_joined : has "fieldName_joined", "segment_joined" and "entity_joined"
	
					ex) fieldName_joined:productClassID, segment_joined:Product, entity_joined:ProductClass

	Fields_collected : has "primary_key_collected", "segment_collected" and "entity_collected"
		
					ex) primary_key_collected:productImageID, segment_collected:Product, entity_collected:ProductImage
	
}

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
	var output_path = output_dir + '/' + CLIENT_NAME + '/app/lib/Model/' + view.segment + '/' + view.entity + '.js';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/app/lib/Model/' + view.segment);
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};


