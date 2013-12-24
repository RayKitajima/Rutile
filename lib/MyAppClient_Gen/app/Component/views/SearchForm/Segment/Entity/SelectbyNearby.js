
var fs = require('fs');
var Mustache = require('mustache');

var template_file = 'MyAppClient_TMPL/app/Component/views/SearchForm/Segment/Entity/SelectbyNearby.xml';

/* view:

{
	
	APP_NAME             : app name,
	CLIENT_NAME          : client application name,
	
	segment              : segment name of search target,
	entity               : entity name of search target,
	primary_key          : primary key of search target entity,
	
	constraint_segment   : constarint segment,
	constraint_entity    : constraint entity,
	constraint_fieldName : constraint field name,
	search_type          : search_type,
	
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
	var output_path = output_dir + '/' + CLIENT_NAME + '/app/views/Component/SearchForm/' + view.segment + '/' + view.entity + '/Selectby' + view.constraint_entity + tools.ucfirst(view.constraint_fieldName) + 'Nearby.xml';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/app/views/Component/SearchForm/' + view.segment + '/' + view.entity);
	
	// render and output
	var template = fs.readFileSync(template_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_path,output);
};

module.exports = {
	generate : generate
};


