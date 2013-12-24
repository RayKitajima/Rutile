
console.log("building titanium app for ios");

var fs = require('fs');
var path = require('path');

var program_file = process.argv[1];

var LIB_PATH = path.resolve(program_file,"../../lib/node_modules/rutile/lib");
var WORKING_DIR = process.cwd();

var tools = require(path.resolve(LIB_PATH,'tools.js'));
var Generator = require(path.resolve(LIB_PATH,'Generator_client'));

var config_file = process.argv[4];
if( config_file.match(/^\./) ){
	config_file = path.resolve(WORKING_DIR,config_file);
}else{
	throw new Error("invalid config file: "+config_file);
}
var MyAppConfig = require(config_file);

var CONFIG_PATH = path.resolve(config_file,'..');

console.log("loading config...");

var APP_NAME = MyAppConfig.APP_NAME;

console.log("LIB_PATH    : "+LIB_PATH);
console.log("APP_NAME    : "+APP_NAME);
console.log("WORKING_DIR : "+WORKING_DIR);

// run tiappmaker
var TIAPPMAKER = '/bin/sh ' + WORKING_DIR + "/" + APP_NAME + "Tools/tiappmaker.sh " + WORKING_DIR;

console.log("TIAPPMAKER  : "+TIAPPMAKER);

var exec = require('child_process').exec;
var child = exec(TIAPPMAKER,function(error,stdout,stderr){
	if( error ){
		console.log("error:");
		console.log(error);
	}
	if( stderr ){
		console.log("stderr:");
		console.log(stderr);
	}
	if( stdout ){
		console.log(stdout);
		console.log("+-----------------------------------------------+");
		console.log("Now you got your KitchenSink TiApp.              ");
		console.log("Make sure your generated server is running.      ");
		console.log("Then go:                                         ");
		console.log("                                                 ");
		console.log("titanium build -p ios -d ./" + APP_NAME + "App   ");
		console.log("                                                 ");
		console.log("enjoy                                            ");
		console.log("+-----------------------------------------------+");
	}
});


