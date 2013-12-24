
// LogicImplFactory

// usage;
//     
//     var LogicImplFactory = require('MyAppImpl').getLogicImplFactory();
//     
//     var method = LogicImplFactory.getImplementation('Logic_Implementation_Tag');
//     
//     method(context);
//     
//     

var logics = {};

var getImplementation = function(logic_tag){
	return logics[logic_tag];
};

module.exports = {
	getImplementation : getImplementation
};

/*

define your implementation here.

var module_caches = {};

logics.__defineGetter__('Segment/Entity', function(){
	if( module_caches['Segment/Entity'] ){
		return module_caches['Segment/Entity'];
	}
	module_caches['Segment/Entity'] = require('./Segment/Entity');
	return module_caches['Segment/Entity'];
});

*/

