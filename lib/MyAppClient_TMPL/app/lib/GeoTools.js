
// usage:
//     
//     var GeoTools = require('GeoTools');
//     
//     GeoTools.reverseGeocode(point,callback);
//     
//     

exports.__defineGetter__('DefaultRegion', function(){
	return Alloy.Globals.Rutile.CFG.GeoTools.DefaultRegion;
});

exports.__defineGetter__('DefaultLongitudeDelta', function(){
	return Alloy.Globals.Rutile.CFG.GeoTools.DefaultLongitudeDelta;
});

exports.__defineGetter__('DefaultLatitudeDelta', function(){
	return Alloy.Globals.Rutile.CFG.GeoTools.DefaultLatitudeDelta;
});

exports.reverseGeocode = function(point,callback){
	// This method maps to MapQuest Open Nominatim Search Service.
	// You should implemnet your own reverse geocoding with any comercial geocoding provider.
	Ti.Geolocation.reverseGeocoder(point.latitude,point.longitude,callback);
};

// decimal degree to meter, quick and dirty estimation
// return value is meter
exports.estimateDecimalDegreeToMeter_QuickAndDirty = function(latitude,latitudeDelta){
	var unit = 111000 * Math.cos(Math.PI*latitude/180);
	return Math.floor(unit * latitudeDelta);
};

