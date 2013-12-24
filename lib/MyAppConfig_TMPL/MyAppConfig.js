
// {{APP_NAME}}Config

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
};

module.exports = Config;


