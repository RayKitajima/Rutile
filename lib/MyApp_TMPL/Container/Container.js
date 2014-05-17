
// Container

// idioms for enduser:
//     
//     // get container for the segment
//     var ContainerFactory = MyApp.getContainerFactory();
//     var container = ContainerFactory.getContainer('Segment');
//     
//     // when you start your service process, 
//     // first, set a connection to the cache/backend with *auto commit mode*
//     // this connection will alive while this process goes on.
//     container.connect();
//     
//     // at the first of your session,
//     // you MUST call init method of your all containers.
//     // this will drain instance pool.
//     // without this, it makes instances that should be volatile endangered.
//     container.init();
//     
//     // and also, you may want to get transaction object at first.
//     // this will start new transaction automatically.
//     var tx = container.getTransaction();
//     
//     // so you dont have to call begin explicitly.
//     tx.begin();
//     
//     // but the transaction is not auto commit mode and PostgreSQL default isolation level,
//     // if you would like to make it on or need some other isoloation, 
//     // you should call some contol method.
//     // (if you dont get transaction object, container is in auto commit mode.)
//     tx.setAutoCommit();
//     tx.isolationLebelSerializable();
//     
//     # manage entity
//     instance.setFoo(bar);
//     
//     // after your entity management, commit or rollback your transaction.
//     tx.commit();
//     tx.rollback();
//     
//     // commit/rollback will effective if some entity had been changed.
//     // without entity change, those do nothing.
//     // you can call forceCommit/Rollback anyway.
//     tx.forceCommit();
//     tx.forceRollback();
//     
//     // it is nice to close transaction explicitly,
//     // this will make the transaction auto commit again.
//     tx.close();
//     
// usage for framwork:
//     
//     var Container = require('Container');
//     var segment_container = new Container(segment);
//     
// MyAppConfig should be in your NODE_PATH
//     
//     var Config = {
//         "container" : {
//         	   "SEGMENT_A" : {
//         	       "db_host"    : IP,
//         	       "db_port"    : PORT,
//         	       "db_user"    : USER,
//         	       "db_pass"    : PASSWORD,
//         	       "cache_host" : IP,
//         	       "cache_port" : PORT
//         	   },
//         	   "SEGMENT_B" : {
//         	       "db_host"    : IP,
//         	       "db_port"    : PORT,
//         	       "db_name"    : NAME,
//         	       "db_user"    : USER,
//         	       "db_pass"    : PASSWORD,
//         	       "cache_host" : IP,
//         	       "cache_port" : PORT
//         	   }
//         }
//     };
//     module.exports = Config;
//     

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// static vriables

var PgSync        = require('pg-sync');
var HiredisSimple = require('hiredis-simple');

{{#Align_equals}}
var {{APP_NAME}}  = require('{{APP_NAME}}');
var Utils         = {{APP_NAME}}.getUtils();
var Transaction   = require('./Transaction');
{{/Align_equals}}

// you should add a path to the {{APP_NAME}}Config into your NODE_PATH
var config = require('{{APP_NAME}}Config');

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// cunstructor

function ContainerConstructor(){
	// instance variables
	this.segment      = arguments[0];
	this.config       = {};
	this.db_client    = '';
	this.cache_client = '';
	this.pool         = {}; // instance pool
	this.shouldCommit = false; // turn true, when some entity was modified
	
	// get config
	this.config = config.container[this.segment];
	
	// init backend client
	this.db_client = new PgSync.Client();
	this.cache_client = new HiredisSimple.Client();
	
	// explicit representation of transaction
	this.transaction = new Transaction(this,this.db_client,this.cache_client);
}

module.exports = ContainerConstructor;

var Container = ContainerConstructor.prototype;

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// general

Container.init = function(){
	this.initInstancePool();
};

Container.drain = function(){
	this.initInstancePool();
};

// transaction services

Container.getTransaction = function(){
	return this.transaction;
};

Container.requestCommit = function(){
	this.shouldCommit = true;
};

Container.dismissCommit = function(){
	this.shouldCommit = false;
};

// instance pool

Container.initInstancePool = function(){
	this.pool = {};
};

Container.drainInstancePool = function(){
	this.pool = {};
};

Container.getPooledInstance = function(MODEL_NAME,id){
	var key = MODEL_NAME + '/' + id;
	return this.pool[key];
}

Container.setPooledInstance = function(MODEL_NAME,id,instance){
	var key = MODEL_NAME + '/' + id;
	this.pool[key] = instance;
}

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public api for backend connection

Container.connect = function(){
	// connect db
	this.db_client.connect(Utils.makeDbConnString({
		host     : this.config.db_host,
		port     : this.config.db_port,
		dbname   : this.config.db_name,
		user     : this.config.db_user,
		password : this.config.db_pass,
	}));
	// connect cache
	this.cache_client.connect(
		this.config.cache_host,
		this.config.cache_port
	);
	// make db connection auto commit
	this.transaction.setAutoCommit();
};

Container.disconnect = function(){
	this.db_client.disconnect();
	this.cache_client.disconnect();
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public api for cache controll

// value should be integer or string
Container.cache_sync_set = function(key,value){
	var result = this.cache_client.set(key,value);
	return result; // always undefined
};

Container.cache_sync_get = function(key){
	var result = this.cache_client.get(key);
	return result;
};

Container.cache_sync_del = function(key){
	var result = this.cache_client.del(key);
	return result;
};

Container.cache_sync_set_ttl = function(key,ttl){
	var result = this.cache_client.expire(key,ttl);
	return result; // always undefined
};

// *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    *    * 

// public api for rdmbs access

Container.db_sync_query = function(sql,params){
//console.log("[Container] ***** sql:"+sql);
//console.log("[Container] ***** params:"+params);
	if( !params ){ params = []; }
	var result = this.db_client.query(sql,params); // arguments might have sql and parameter
	return result;
};

// for query cannot be parameterized
Container.db_sync_query_prebind = function(sql,params){
	if( !params ){ params = []; }
	var holder_pattern = /\$\d+/g;
	var binded_sql = '';
	var first = 0;
	var last = 0;
	var result = [];
	var i = 0;
	while( (result = holder_pattern.exec(sql)) != null ){
		var param = params[i];
		last = result.index;
		binded_sql += sql.substring(first,last);
		// unparameterizable query should have dblink,
		// literal escape should be in the source 'sql'
		binded_sql += this.db_client.escapeStringConn(params[i]);
		first = result.index+result[0].length;
		i++;
	}
	binded_sql += sql.substring(first,sql.length);
	
//console.log("[Container] ***** (prebind) binded_sql:"+binded_sql);
	var result = this.db_client.query(binded_sql);
	return result;
};

