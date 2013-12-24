
// ContainerFactory

// usage:
//     
//     var ContainerFactory = require('ContainerFactory');
//     var segment_container = ContainerFactory.getContainer('Segment');
//     
//     // or quick container for simple application
//     var container = ContainerFactory.getContainer('SegmentA','SegmentB');
//     
//     

var ContainerManifest = require('./ContainerManifest');
var ContainerModule = require('./Container');

var segments = {};

var getContainerForSegment = function(segment){
	if( segments[segment] ){
		return segments[segment];
	}else{
		var containerName = ContainerManifest[segment];
		var container;
		if( containerName ){
			container = new ContainerModule(containerName);
		}else{
			return false;
		}
		segments[segment] = container;
		return segments[segment];
	}
};

var getContainer = function(){
	if( arguments.length > 1 ){
		var containers = [];
		for( var i=0; i<arguments.length; i++ ){
			var container = getContainerForSegment(arguments[i]);
			if( container ){
				containers.push(container);
			}
		}
		var ContainerFacade = require('./ContainerFacade');
		return new ContainerFacade(containers);
	}else{
		return getContainerForSegment(arguments[0]);
	}
};

module.exports = {
	getContainer : getContainer
};

