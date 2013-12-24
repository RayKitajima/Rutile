
var fs = require('fs');
var Mustache = require('mustache');

var template_loc = 'MyAppClient_TMPL/i18n';

/* view:

{
	
	APP_NAME    : app name,
	CLIENT_NAME : client application name,
	
	language : default language
	
	Segments : contains "Entities" and "ui_segmentName"
				Entities : contains,
					ui_entityName : name of human readable entity
					segmentName   : name of its segment
					entityName    : name of entity itself
					Fields        : has "fieldName" and "ui_fieldName"
	
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
	var template_path = template_dir + '/' + template_loc + '/' + view.language;
	var output_path   = output_dir + '/' + CLIENT_NAME + '/i18n/' + view.language;
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/i18n/' + view.language);
	
	var input_file_path;
	var output_file_path;
	
	// app.xml
	input_file_path = template_path + '/app.xml';
	output_file_path = output_path + '/app.xml';
	var template = fs.readFileSync(input_file_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_file_path,output);
	
	// string.xml
	input_file_path = template_path + '/string.xml';
	output_file_path = output_path + '/string.xml';
	var template = fs.readFileSync(input_file_path);
	var output = Mustache.render(template.toString(),view);
	fs.writeFileSync(output_file_path,output);
};

module.exports = {
	generate : generate
};



