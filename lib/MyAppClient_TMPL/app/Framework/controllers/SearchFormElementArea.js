
var self = exports;
var index;

var centroid = null; // should be { latitude:0, longitude:0 };
var area     = null; // should be { latitude_lefttop:0, longitude_lefttop:0, latitude_rightbottom:0, longitude_rightbottom:0 };
var width    = 0;    // estimated meter of longitudeDelta
var last_region; 

var centroid_text = '';

var GeoTools = require('GeoTools');

// argument is Ti abstract type object ReverseGeocodeResponse
var updateInfoView = function(reverseGeocodeResponse){
	if( reverseGeocodeResponse.success ){
		var places = reverseGeocodeResponse.places;
		if( Array.isArray(places) ){
			// 
			// places is array of GeocodedAddress, Ti abstract type object, having:
			//     address, city, country, countryCode, country_code, displayAddress,
			//     latitude, longitude, postalCode, region1, region2, street, street1, zipcode
			// 
			var addresses = places[0].address.split(',');
			var address_texts = [];
			for( var i=0; i<addresses.length; i++ ){
				if( i > 2 ){ break; }
				var address = addresses[i];
				var text = address.replace(/(\(.*\))/g,'').replace(/\s/g,'');
				address_texts.push(text);
			}
			centroid_text = address_texts.reverse().join('');
			$.AreaInfo.text = String.format(L('FrameworkTextExpSearchTypeAreaCentroidWidth'),centroid_text,String(width));
			$.AreaInfo.color = '#55c';
		}
	}
};

// argument is Titanium abstract type def MapRegionType:{ latitude, latitudeDelta, longitude, longitudeDelta }
// latitudeDelta  : The amount of north-to-south distance displayed on the map, measured in decimal degrees.
// longitudeDelta : The amount of east-to-west distance displayed on the map, measured in decimal degrees.
exports.listenLocationPicker = function(region){
	last_region = region;
	centroid = {};
	centroid.latitude  = region.latitude;
	centroid.longitude = region.longitude;
	
	area = {};
	area.latitude_lefttop      = centroid.latitude  - ( region.latitudeDelta  / 2 );
	area.longitude_lefttop     = centroid.longitude + ( region.longitudeDelta / 2 );
	area.latitude_rightbottom  = centroid.latitude  + ( region.latitudeDelta  / 2 );
	area.longitude_rightbottom = centroid.longitude - ( region.longitudeDelta / 2 );
	
	$.AreaInfo.text = L('FrameworkGeolocationUnderReverseGeocoding');
	
	width = GeoTools.estimateDecimalDegreeToMeter_QuickAndDirty(centroid.latitude,region.longitudeDelta);
	GeoTools.reverseGeocode(centroid,updateInfoView);
};

function openAreaPicker(e){
	var controller = Alloy.createController('Framework/AreaPicker');
	controller.setListener(self);
	var target_region = last_region ? last_region : GeoTools.DefaultRegion;
	controller.setRegion(target_region);
	
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.open(controller);
};

exports.initForm = function(){
	area = null;
	centroid = null;
	centroid_text = null;
	width = 0;
	$.AreaInfo.text = L('FrameworkSearchFormElementArea');
	$.AreaInfo.color = '#aaa';
};

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.getTextExpression = function(){
	if( !area ){ return ''; }
	return String.format(Ti.Locale.getString('FrameworkTextExpSearchTypeNearbyCentroidDistance'),centroid_text,width);
};

exports.getValue = function(){
	if( !area ){ return null; }
	var area_polygon_format = 'POLYGON((%f %f, %f %f, %f %f, %f %f, %f %f))'; // pgsql polygon expression
	var area_polygon = String.format(
		area_polygon_format,
		area.longitude_lefttop,     area.latitude_lefttop, 
		area.longitude_rightbottom, area.latitude_lefttop, 
		area.longitude_rightbottom, area.latitude_rightbottom, 
		area.longitude_lefttop,     area.latitude_rightbottom, 
		area.longitude_lefttop,     area.latitude_lefttop
	);
	return { "polygon":area_polygon };
};

// usage: 
// 
// searchElementNearby.setValue({
//     area : { latitude_lefttop:A, longitude_lefttop:B, latitude_rightbottom:C, longitude_rightbottom:D };
// });
// 
exports.setValue = function(value){
	area = value.area;
	width = value.width;
	centroid.latitude  = (area.latitude_rightbottom + area.latitude_lefttop)/2;
	centroid.longitude = (area.longitude_rightbottom + area.longitude_lefttop)/2;
	if( centroid ){
		$.Centroid.text = L('FrameworkGeolocationUnderReverseGeocoding');
		GeoTools.reverseGeocode(centroid,updateCentroidView);
	}
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};


