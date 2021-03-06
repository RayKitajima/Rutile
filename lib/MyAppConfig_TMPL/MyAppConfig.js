
// {{APP_NAME}}Config

var fs = require('fs');

var jwscert = fs.readFileSync(__dirname + '/{{APP_NAME}}.jwscert');

var sslkey = fs.readFileSync(__dirname + '/{{APP_NAME}}.sslkey');
var sslcert = fs.readFileSync(__dirname + '/{{APP_NAME}}.sslcert');

var Config = {
	"container" : {
{{#Segments}}
		"{{segment}}" : {
			"db_host"    : "{{DBHost}}",
			"db_port"    : {{DBPort}},
			"db_name"    : "{{#Lc_first}}{{segment}}{{/Lc_first}}",
			"db_user"    : "{{DBUser}}",
			"db_pass"    : "{{DBPass}}",
			"cache_host" : "{{CacheHost}}",
			"cache_port" : {{CachePort}}
		}{{^last}},{{/last}}
{{/Segments}}
	},
	"SelectAllLimit" : {{SelectAllLimit}},
	"MaxExpandLevel" : {{MaxExpandLevel}},
	"SSLKey" : sslkey,
	"SSLCert" : sslcert,
	"JWSCert" : jwscert
};

module.exports = Config;


