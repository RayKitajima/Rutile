
// Utils

var util = require("util");

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// make pg-sync connection string
// 
// usage:
//     
//     var conString = Utils.makeDbConnString(
//         "127.0.0.1"
//         5432,
//         "myapp"
//     );
//     
//     this will make "host=127.0.0.1 port=5432 dbname=myapp"
//     so that you can use as db_client.connect(conString);
//     	
var makeDbConnString = function(host,port,dbname){
	return util.format("host=%s port=%s dbname=%s",host,port,dbname);
};

// merge express req.param, req.query and req.body into context.request object
// 
// usage:
//     
//     var app = express();
//     app.use(function(req,res,next){
//         context.request = Utils.mergeExpressRequests(req);
//         next();
//     });
//     
var mergeExpressRequests = function(req){
	var raw_params_keys = Object.keys(req.params);
	var raw_query_keys  = Object.keys(req.query);
	var raw_body_keys   = Object.keys(req.body);
	var request = {};
	for( var i=0; i<raw_params_keys.length; i++ ){
		request[ raw_params_keys[i] ] = req.params[ raw_params_keys[i] ];
	}
	for( var i=0; i<raw_query_keys.length; i++ ){
		request[ raw_query_keys[i] ] = req.query[ raw_query_keys[i] ];
	}
	for( var i=0; i<raw_body_keys.length; i++ ){
		request[ raw_body_keys[i] ] = req.body[ raw_body_keys[i] ];
	}
	return request;
};

// nomalize field case of result object
// 
// raw_results should be an array of row object.
// 
// usage:
//     
//     var raw_results = container.db_sync_query(sql,params);
//     var normalized_results = Utils.normalizeField(FieldManifest,raw_results);
// 
var normalizeField = function(FieldManifest,raw_results){
	var normalized_results = [];
	for( var i=0; i<raw_results.length; i++ ){
		var result = raw_results[i];
		var n_result = {};
		var keys = Object.keys(result);
		for( var j=0; j<keys.length; j++ ){
			var key = keys[j];
			var n_key = FieldManifest[key];
			if( n_key ){
				n_result[n_key] = result[key];
			}else{
				n_result[key] = result[key];
			}
		}
		normalized_results.push(n_result);
	}
	return normalized_results;
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

module.exports = {
	makeDbConnString : makeDbConnString,
	mergeExpressRequests : mergeExpressRequests,
	normalizeField : normalizeField
};


