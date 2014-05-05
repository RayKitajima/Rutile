
var self = exports;
var index; // DEPRECATED

var centroid = null; // should be { latitude:0, longitude:0 }
var distance = 0;
var last_region;

var centroid_text = null;

var GeoTools = require('GeoTools');

function closeKeyboard(e) {
	e.source.blur();
}

// argument is Ti abstract type object ReverseGeocodeResponse
var updateCentroidView = function(reverseGeocodeResponse){
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
			$.Centroid.text = String.format(L('FrameworkTextExpSearchTypeNearbyCentroid'),centroid_text);
			$.Centroid.color = '#55c';
		}
	}
};

// argument is Titanium abstract type def MapRegionType:{ latitude, latitudeDelta, longitude, longitudeDelta }
exports.listenLocationPicker = function(region){
	last_region = region;
	centroid = {};
	centroid.longitude = region.longitude;
	centroid.latitude  = region.latitude;
	$.Centroid.text = L('FrameworkGeolocationUnderReverseGeocoding');
	GeoTools.reverseGeocode(centroid,updateCentroidView);
};

function openLocationPicker(e){
	var controller = Alloy.createController('Framework/LocationPicker');
	controller.setListener(self);
	var target_region = last_region ? last_region : GeoTools.DefaultRegion;
	controller.setRegion(target_region);
	
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.open(controller);
};

exports.initForm = function(){
	centroid = null;
	centroid_text = null;
	distance = 0;
	$.Centroid.text = L('FrameworkSearchFormElementNearbyCentroid');
	$.Centroid.color = '#aaa';
	$.Distance.value = '';
	$.Distance.color = '#aaa';
};

exports.setIndex = function(idx){
	index = idx;
};

exports.getIndex = function(){
	return index;
};

exports.getTextExpression = function(){
	if( !centroid ){ return ''; }
	var centroid_text = $.Centroid.text;
	var distance_text = distance;
	return String.format(Ti.Locale.getString('FrameworkTextExpSearchTypeNearbyCentroidDistance'),centroid_text,distance_text);
};

exports.getValue = function(){
	if( !centroid ){ return null; }
	var centroid_point_format = 'POINT(%f %f)'; // pgsql point expression
	var centroid_point = String.format(centroid_point_format,centroid.longitude,centroid.latitude);
	return { "centroid":centroid_point, "distance":$.Distance.value };
};

// usage: 
// 
// searchElementNearby.setValue({
//     centroid : {latitude:LAT,longitude:LON},
//     distance : DIST
// });
// 
exports.setValue = function(value){
	centroid = value.centroid;
	distance = value.distance;
	if( centroid ){
		$.Centroid.text = L('FrameworkGeolocationUnderReverseGeocoding');
		GeoTools.reverseGeocode(centroid,updateCentroidView);
	}
};

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

