
var fs = require('fs');
var exec = require('child_process').exec;

var template_loc = 'MyAppClient_TMPL/app/lib';
var static_files = '{Container.js,EditFormGroup.js,FontAwesome.js,GeneralCache.js,GeoTools.js,IconicFont.js,ImageTools.js,LigatureSymbols}';

/* view:

{
	
	APP_NAME    : app name,
	CLIENT_NAME : client application name,
	
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
	var input_path  = template_dir + '/' + template_loc;
	var output_path = output_dir + '/' + CLIENT_NAME + '/app/lib';
	
	tools.confirmPath(output_path);
	
	var source = input_path + '/' + static_files;
	var dest   = output_path + '/.'
	var command = 'cp ' + source + ' ' + dest;
	exec(command,function(){
		console.log("copy lib/*.js");
	});
};

module.exports = {
	generate : generate
};


