
var self = exports;

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

var GeoTools = require('GeoTools');

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var orig_color   = $.FormElementLocation.color;
var curr_color   = $.FormElementLocation.color;
var edited_color = '#d10404';

var orig_location; // also used as a initialization checker
var prev_location;
var curr_location;

var last_region;

var editable = true;

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
			
			$.FormElementLocation.text  = centroid_text;
			$.FormElementLocation.color = curr_color;
		}
	}
};

exports.listenLocationPicker = function(region){
	last_region = region;
	var centroid = {};
	centroid.longitude = region.longitude;
	centroid.latitude  = region.latitude;
	
	if( !orig_location ){
		orig_location = centroid;
		prev_location = centroid;
		curr_location = centroid;
	}
	
	if( (centroid.longitude != curr_location.longitude) || (centroid.latitude != curr_location.latitude) ){
		prev_location = curr_location;
		curr_location = centroid;
		curr_color    = edited_color;
	}
	if( (curr_location.longitude == orig_location.longitude) && (curr_location.latitude == orig_location.latitude) ){
		curr_color = orig_color;
	}
	
	GeoTools.reverseGeocode(centroid,updateCentroidView);
	
	changeHandler(curr_location);
};

function openLocationPicker(e){
	if( !editable ){ return; }
	
	// prep region
	var region = {};
	if( curr_location && !last_region ){
		region = {
			longitudeDelta : GeoTools.DefaultLongitudeDelta,
			latitudeDelta  : GeoTools.DefaultLatitudeDelta,
			longitude      : curr_location.longitude,
			latitude       : curr_location.latitude,
		};
	}else if( curr_location && last_region ){
		region = last_region;
	}else{
		region = GeoTools.DefaultRegion;
	}
	
	var controller = Alloy.createController('Framework/LocationPicker');
	controller.setListener(self);
	controller.setRegion(region);
	
	var modalWindow = Alloy.createController('Framework/ModalWindow');
	modalWindow.getView().open();
	modalWindow.navigationGroup.open(controller);
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

// get and set Location object

exports.setValue = function(new_location){ // argument should be pgsql point expression 'POINT(lon,lat)'
	if( !new_location ){
		if( !orig_location ){
			// start with no location
			orig_color = edited_color;
		}
		$.FormElementLocation.text = '';
		prev_location = curr_location;
		curr_location = '';
		showHintTexts();
		return;
	}
	
	var matches = new_location.match(/POINT\(([\d\.]*) ([\d\.]*)\)/);
	var centroid = {}; // { longitude:, latitude: }
	centroid.longitude = matches[1];
	centroid.latitude  = matches[2];
	
	if( !orig_location ){
		orig_location = centroid;
		prev_location = centroid;
		curr_location = centroid;
	}
	
	prev_location = curr_location;
	curr_location = centroid;
	
	GeoTools.reverseGeocode(centroid,updateCentroidView);
};

exports.getValue = function(){
	if( !curr_location ){ return null; }
	var point_format = 'POINT(%f %f)'; // pgsql point expression
	var point = String.format(point_format,curr_location.longitude,curr_location.latitude);
	return point;
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
	$.FormElementLocation.text = hintTexts.join(' ');
	$.FormElementLocation.color = '#aaa';
};

var hideHintTexts = function(){
	$.FormElementLocation.hintText = '';
};

exports.setHintTexts = function(texts){
	hintTexts = texts;
};

// enable and disable editing

exports.enableEditing = function(){
	editable = true;
	$.ClearButton.getView().visible = true;
};

exports.disableEditing = function(){
	editable = false;
	$.ClearButton.getView().visible = false;
};

// clear field

exports.setClearButtonHandler = function(handler){
	$.ClearButton.setButtonHandler(handler);
};

