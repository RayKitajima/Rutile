
var exec = require('child_process').exec;

var source_dir = 'MyAppClient_TMPL/setup';

var generate = function(options){
	var APP_NAME      = options['APP_NAME'];
	var CLIENT_NAME   = options['CLIENT_NAME'];
	var template_dir  = options['template_dir'];
	var output_dir    = options['output_dir'];
	var view          = options['view'];
	var tools         = options['tools'];
	
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
	var source_path = template_dir + '/' + source_dir;
	
	var source;
	var dest;
	var command;
	
	// copy alloy.js
	
	source = source_path + '/alloy.js';
	dest   = output_dir + '/' + CLIENT_NAME + '/app';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/app');
	
	command = 'cp ' + source + ' ' + dest;
	
	exec(command,function(){
		console.log("copy alloy.js");
	});
	
	// copy Info.plist
	
	source = source_path + '/Info.plist';
	dest   = output_dir + '/' + CLIENT_NAME + '/';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME);
	
	command = 'cp ' + source + ' ' + dest;
	
	exec(command,function(){
		console.log("copy Info.plist");
	});
	
};

module.exports = {
	generate : generate
};


