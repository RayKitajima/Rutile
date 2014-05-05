
// usage:
//     
//     var Dispatch = require('CentralDispatch');
//     
//     // stand alone (1)
//     Dispatch.sync(apptag,params,callback);
//     
//     // stand alone (2)
//     Dispatch.sync({ apptag:apptag, params:params, callback:callback });
//     
//     // batched
//     Dispatch.push('BATCH_NAME',{ apptag:apptag1, params:params1, callback:callback1 });
//     Dispatch.push('BATCH_NAME',{ apptag:apptag2, params:params2, callback:callback2 });
//     Dispatch.sync('BATCH_NAME');
//     
//     
// note:
//     
//     if you make batch for recursive save of an object, be careful of its order.
//     apps are invoked frist-in first-out.
//     
//     

var Notifier = require('NotificationCenter');

var dispatch_serial = Math.floor(Math.random()*10000);

var retry_interval = 1000;
var max_retry      = 5;

var batches = {};

var push = function(){
	if( typeof arguments[0] == 'string' || arguments[0] instanceof String ){
		var name = arguments[0];
		var app  = arguments[1];
		if( !batches[name] ){ batches[name] = []; }
		var apps = batches[name];
		apps.push(app);
	}else{
		var app = arguments[0];
		exec([app]);
	}
};

var sync = function(){
	if( typeof arguments[0] == 'string' || arguments[0] instanceof String ){
		// Dispatch.sync('BATCH_NAME');
		var name = arguments[0];
		var apps = batches[name];
		exec(apps);
		delete batches[name];
	}else{
		if( arguments[0].hasOwnProperty('apptag') ){
			// Dispatch.sync({apptag:t,params:p,callback:cb});
			exec([arguments[0]]);
		}else{
			// Dispatch.sync(apptag,params,callback);
			exec([{ apptag:arguments[0], params:arguments[1], callback:arguments[2] }]);
		}
	}
};

var abort = function(context,callbacks){
	var responses = context.response;
	for( var i=0; i<responses.length; i++ ){
		var response = responses[i];
		var serial = response.serial;
		delete callbacks[serial];
	}
	context = null;
};

// 
// make request context:
//     
//     context.request = [
//         { apptag:apptag, params:params, serial:serial },
//     ];
// 
//     context.response = [
//         { apptag:apptag, results:results, serial:serial },
//     ];
// 
var exec = function(apps){
	var exec_serial    = dispatch_serial++;
	var response_event = 'response,' + exec_serial;
	
	var context = {};
	context.request = [];
	context.serial = exec_serial;
	{{#ImplAuthLogic}}context.token = Alloy.Globals.Rutile.token;
	{{/ImplAuthLogic}}
	var retry_count;
	var callbacks = {};
	
	retry_count = arguments[1];
	
	for( var i=0; i<apps.length; i++ ){
		var app = apps[i];
		var apptag   = app.apptag;
		var params   = app.params;
		var callback = app.callback || function(){};
		var serial   = dispatch_serial++;
		context.request.push({
			apptag : apptag,
			params : params,
			serial : serial,
		});
		callbacks[serial] = callback;
	}
	
	var http = Ti.Network.createHTTPClient({
		onload : function(e){
			var context = JSON.parse(this.responseText);
			if( context.Error ){
				var Error = context.Error;
				{{#ImplAuthLogic}}
				{{#AuthPassword}}
				if( context.Error.AuthPassword.authorize ){
					Notifier.notify('Error.AuthPassword.authorize',Error);
					abort(context,callbacks);
					return;
				}else if( context.Error.AuthPassword.authenticate ){
					Notifier.notify('Error.AuthPassword.authenticate',Error);
					abort(context,callbacks);
					return;
				}else{
					console.log("[CentralDispatch] unexpected AuthPassword.Error");
					return;
				}
				{{/AuthPassword}}
				{{/ImplAuthLogic}}
			}
			var responses = context.response;
			for( var i=0; i<responses.length; i++ ){
				var response = responses[i];
				var apptag = response.apptag;
				var result = response.result;
				var serial = response.serial
				var callback = callbacks[serial] || function(){ console.log("[CentralDispatch] uncaught response apptag:"+apptag+" serial:"+serial); };
				callback(result);
				delete callbacks[serial];
			}
		},
		onerror : function(e){
			console.log("[CentralDispatch] connection error");
		}
	});
	http.validatesSecureCertificate = false;
	http.open('POST','https://{{AppHost}}:{{AppPort}}/');
	http.send({context:JSON.stringify(context)});
};

module.exports = {
	sync : sync,
	push : push,
};

