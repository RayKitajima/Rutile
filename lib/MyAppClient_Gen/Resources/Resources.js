
var exec = require('child_process').exec;

var source_dir = 'MyAppClient_TMPL/Resources';

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
	
	var source = source_path + '/fonts';
	var dest   = output_dir + '/' + CLIENT_NAME + '/Resources/.';
	
	tools.confirmPath(output_dir + '/' + CLIENT_NAME + '/Resources/');
	
	var command = 'cp -r ' + source + ' ' + dest;
	
	exec(command,function(){
		console.log("copy fonts");
	});
	
};

module.exports = {
	generate : generate
};


