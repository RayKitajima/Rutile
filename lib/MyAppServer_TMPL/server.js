
// prep server
var http = require('http');
var server = http.createServer(function(req,res){
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end('server connected');
});
server.listen(3000);
var io = require('socket.io').listen(server);

// prep application
var {{APP_NAME}} = require('{{APP_NAME}}');
var LogicFactory = {{APP_NAME}}.getLogicFactory();

// prep container
var ContainerFactory = {{APP_NAME}}.getContainerFactory();
var container = ContainerFactory.getContainer({{#Segments}}"{{segment}}"{{^last}},{{/last}}{{/Segments}}); // quick facade
container.connect();

io.sockets.on('connection', function(socket){
	socket.on('request',function(context){
		container.init();
		context.response = [];
		var serial = context.serial;
		var response_event = 'response,' + serial;
		var tx = container.getTransaction();
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
			socket.emit(response_event,context);
		}catch(e){
			//console.log("[server] ***** got exception:"+e);
			tx.rollback();
		}
	});
});

