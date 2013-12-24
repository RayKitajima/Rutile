
// 
// singleton instance provider
// 
// usage:
//     
//     var Container = require('Container');
//     
//     // in your model constructor
//     var pooled_instance = Container.getPooledInstance(MODEL_NAME,id);
//     if( pooled_instance ){
//         return pooled_instance;
//     }else{
//         // make your own instance
//         // then push it into the pool for reuse
//         Container.setPooledInstance(MODEL_NAME,id,instance);
//     }
//     
//     

var instancePool = {};

var getPooledInstance = function(MODEL_NAME,id){
	var key = MODEL_NAME + '/' + id;
	return instancePool[key];
};

var setPooledInstance = function(MODEL_NAME,id,instance){
	var key = MODEL_NAME + '/' + id;
	instancePool[key] = instance;
};

var delPooledInstance = function(MODEL_NAME,id){
	var key = MODEL_NAME + '/' + id;
	delete instancePool[key];
};

module.exports = {
	getPooledInstance : getPooledInstance,
	setPooledInstance : setPooledInstance,
	delPooledInstance : delPooledInstance,
};

