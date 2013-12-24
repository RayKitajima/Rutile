
var command = process.argv[2];
var option  = process.argv[3];

if( command === 'md2config' ){
	require('./md2config.js');
}
else if( command === 'generate' ){
	if( option === 'server' ){
		require('./generate_server.js');
	}
	else if( option === 'client' ){
		require('./generate_client.js');
	}
}
else if( command === 'build' ){
	if( option === 'tiapp' ){
		require('./build_tiapp');
	}
}
else{
	console.log("no command");
}

