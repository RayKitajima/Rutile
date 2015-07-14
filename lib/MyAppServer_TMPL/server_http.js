
var {{APP_NAME}} = require('{{APP_NAME}}');
var {{APP_NAME}}Config = require('{{APP_NAME}}Config');

var https = require('https');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jsonParser = bodyParser.json();
var app = express();
app.use(cookieParser);
app.use(jsonParser);

var LogicFactory = {{APP_NAME}}.getLogicFactory();
var ContainerFactory = {{APP_NAME}}.getContainerFactory();
var container = ContainerFactory.getContainer({{#Segments}}"{{segment}}"{{^last}},{{/last}}{{/Segments}}); // quick facade
container.connect();

app.post('/app',function(req,res){
	var context = JSON.parse(req.body.context);
	container.init();
	context.response = [];
	context.volatile = {}; // prepare volatile space
	var serial = context.serial;
	var response_event = 'response,' + serial;
	var tx = container.getTransaction();
	tx.begin();
	try{
		var apps = context.request;
		for( var i=0, len=apps.length; i<len; i++ ){
			var app = apps[i];
			var tag = app.apptag;
			var method = LogicFactory.getMethod(tag);
			//console.log("***** [server] exec tag:"+tag);
			method(context,app);
		}
		tx.commit();
		context.request = {}; // remove request
		context.volatile = {}; // remove volatile data
		res.writeHead(200,{'Content-Type':'text/plain'});
		res.end(JSON.stringify(context));
	}catch(e){
		console.log("[server] ***** got exception:"+e);
		tx.rollback();
		context.volatile = {}; // remove volatile data
	}
});

var server = https.createServer(
	{ key:{{APP_NAME}}Config.SSLKey, cert:{{APP_NAME}}Config.SSLCert }, app
);
server.listen({{AppPort}},'{{AppHost}}',function(){ console.log("{{APP_NAME}} server started"); });

