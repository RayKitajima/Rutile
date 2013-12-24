
var exec = require('child_process').exec;

var source_dir = 'MyAppClient_TMPL/modules';

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
	
	// copy commonjs
	
	source = source_path + '/commonjs';
	dest   = output_dir + '/' + CLIENT_NAME + '/modules/';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/modules');
	
	command = 'cp -r ' + source + ' ' + dest;
	
	exec(command,function(){
		console.log("copy modules/commonjs");
	});
	
	// copy iphone
	
	source = source_path + '/iphone';
	dest   = output_dir + '/' + CLIENT_NAME + '/modules/';
	
	command = 'cp -r ' + source + ' ' + dest;
	
	exec(command,function(){
		console.log("copy modules/iphone");
	});
	
};

module.exports = {
	generate : generate
};


