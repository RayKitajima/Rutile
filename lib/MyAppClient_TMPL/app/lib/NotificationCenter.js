
// usage:
//     
//     var Notifier = require('NotificationCenter');
//     
//     // source
//     
//     Notifier.notify('Segment/Entity.event',message);
//     
//     // listener
//     
//     Notifier.listen('Segment/Entity.event',method);
//     Notifier.once('Segment/Entity.event',method);
//     
//     var method = function(message){
//     };
//     
//     

var EventListeners = {};

var add = function(event,listener){
	if( !EventListeners[event] ){
		EventListeners[event] = { listeners:{}, serial:1 };
	}
	var listeners = EventListeners[event].listeners;
	var serial = EventListeners[event].serial++;
	listeners[serial] = listener;
};

var listen = function(event,method){
	var listener = { method:method, once:false };
	add(event,listener);
};

var once = function(event,method){
	var listener = { method:method, once:true };
	add(event,listener);
};

var notify = function(event,obj){
	if( !EventListeners[event] ){ return; }
	var listeners = EventListeners[event].listeners;
	var serials = Object.keys(listeners);
	var removes = [];
	for( var i=0; i<serials.length; i++ ){
		var serial   = serials[i];
		var listener = listeners[serial];
		var method   = listener.method;
		method(obj);
		if( listener.once ){
			removes.push(serial);
		}
	}
	for( var i=0; i<removes.length; i++ ){
		delete listeners[removes[i]];
	}
};

var remove = function(event,method){
	if( !EventListeners[event] ){ return; }
	var listeners = EventListeners[event].listeners;
	var serials = Object.keys(listeners);
	var removes = [];
	for( var i=0; i<serials.length; i++ ){
		var serial   = serials[i];
		var listener = listeners[serial];
		if( listener == method ){
			removes.push(serial);
		}
	}
	for( var i=0; i<removes.length; i++ ){
		delete listeners[removes[i]];
	}
};

module.exports = {
	notify : notify,
	listen : listen,
	once   : once,
	remove : remove,
};

