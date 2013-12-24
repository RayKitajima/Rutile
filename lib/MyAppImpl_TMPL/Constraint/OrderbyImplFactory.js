
// Orderby Implementation Factory
// 
// usage:
//     
//     * orderby implementation
//     
//     var MyAppImpl = require('MyAppImpl');
//     var OrderbyImplFactory = MyAppImpl.getOrderbyImplFactory();
//     
//     var impl = OrderbyImplFactory.getImplementation('Segment/Entity','module_key');
//     if( impl ){
//         return imp;
//     }else{
//         return orderby_modules[module_key];
//     }
//     
//     

var orderbys = {};

var getImplementation = function(segment_entity,module_key){
	var key = segment_entity + '/' + module_key;
	return orderbys[key];
};

module.exports = {
	getImplementation : getImplementation
};

/*

var module_caches = {};

orderbys.__defineGetter__('Segment/Entity', function(){
	if( module_caches['key'] ){
		return module_caches['key'];
	}
	module_caches['key'] = require('./Segment/Entity/OrderbySomeField');
	return module_caches['key'];
});

*/


