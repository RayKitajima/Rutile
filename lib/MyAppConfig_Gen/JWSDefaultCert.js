
var fs = require('fs');
var Mustache = require('mustache');

var exec = require('child_process').exec;

/* view:

{
	APP_NAME : APP_NAME,
	
	SelectAllLimit : SelectAllLimit,
	MaxExpandLevel : MaxExpandLevel,
	
	// array of segment
	Segments : [ { segment:SEGMENT }, ],
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
	var privatekey_path = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + 'Config' + '/' + APP_NAME + '.jwskey';
	var cert_path       = output_dir + '/' + SERVER_NAME + '/' + APP_NAME + 'Config' + '/' + APP_NAME + '.jwscert';
	var config_file     = __dirname + '/JWSDefaultCert.conf';
	
	// render
	var gen_privatekey = 'openssl genrsa 2048 > ' + privatekey_path ;
	var gen_cert       = 'openssl req -new -x509 -key ' + privatekey_path + ' -out ' + cert_path + ' -config ' + config_file + ' -days 3650';
	
	console.log("generating private key");
	var child = exec(gen_privatekey,function(error,stdout,stderr){
		if( !error ){
			console.log(stdout);
			exec(gen_cert,function(error,stdout,stderr){
				if( error ){
					console.log("[generating cert] error:");
					console.log(error);
				}
				if( stderr ){
					console.log("[generating cert]stderr:");
					console.log(stderr);
				}
				if( stdout ){
					console.log(stdout);
					console.log("generated cert file");
				}
			});
		}else{
			if( error ){
				console.log("[generating private key] error:");
				console.log(error);
			}
			if( stderr ){
				console.log("[generating private key] stderr:");
				console.log(stderr);
			}
		}
	});
};

module.exports = {
	generate : generate
};



