
// Selectby Implementation Factory
// 
// usage:
//     
//     * selectby implementation
//     
//     var MyAppImpl = require('MyAppImpl');
//     var SelectbyImplFactory = MyAppImpl.getSelectbyImplFactory();
//     
//     var impl = SelectbyImplFactory.getImplementation('Segment/Entity','module_key');
//     if( impl ){
//         return imp;
//     }else{
//         return selectby_modules[module_key];
//     }
//     
//     

var selectbys = {};

var getImplementation = function(segment_entity,module_key){
	var key = segment_entity + '/' + module_key;
	return selectbys[key];
};

module.exports = {
	getImplementation : getImplementation
};

/*

var module_caches = {};

selectbys.__defineGetter__('key', function(){
	if( module_caches['key'] ){
		return module_caches['key'];
	}
	module_caches['key'] = require('./Segment/Entity/SelectbySomeCondition');
	return module_caches['key'];
});

*/


