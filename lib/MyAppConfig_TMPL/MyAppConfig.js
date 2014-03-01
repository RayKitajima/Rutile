
// {{APP_NAME}}Config

var fs = require('fs');

{{#ImplAuthLogic}}
var jwscert = fs.readFileSync(__dirname + '/{{APP_NAME}}.jwscert');
{{/ImplAuthLogic}}

var sslkey = fs.readFileSync(__dirname + '/{{APP_NAME}}.sslkey');
var sslcert = fs.readFileSync(__dirname + '/{{APP_NAME}}.sslcert');

var Config = {
	"container" : {
{{#Segments}}
		"{{segment}}" : {
			"db_host"    : "127.0.0.1",
			"db_port"    : 5432,
			"db_name"    : "{{#Lc_first}}{{segment}}{{/Lc_first}}",
			"cache_host" : "127.0.0.1",
			"cache_port" : 6379
		}{{^last}},{{/last}}
{{/Segments}}
	},
	"SelectAllLimit" : {{SelectAllLimit}},
	"MaxExpandLevel" : {{MaxExpandLevel}},
	"SSLKey" : sslkey,
	"SSLCert" : sslcert{{#ImplAuthLogic}},
	"JWSCert" : jwscert{{/ImplAuthLogic}}
};

module.exports = Config;


