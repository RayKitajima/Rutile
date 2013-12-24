
// type : image

var self = exports;

var Notifier = require('NotificationCenter');
var ImageTools = require('ImageTools');

var changeHandler = function(){};
exports.putEventListener = function(event,callback){
	if( event === 'change' ){ changeHandler = callback; }
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var listeners = [];

exports.listen = function(eventName,callback){
	listeners.push({ name:eventName,callback:callback });
};

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

var args = arguments[0] || {};
var segment = args.segment;

var orig_color   = $.SelectedImage.borderColor;
var curr_color   = $.SelectedImage.borderColor;
var edited_color = '#d10404';

var orig_image; // base64 encoded, also used as a initialization checker
var prev_image; // base64 encoded
var curr_image; // base64 encoded

var editable = true;

var imageHandler = function(event){
	var picked_image_blob = event.media;
	
	// convert picked blob image data to base64
	var picked_image = ImageTools.getBase64StringFromImage(picked_image_blob);
	
	// make and cache thumbnail
	var thumb = ImageTools.makeThumbnailImage(picked_image_blob);
	
	if( !orig_image ){
		orig_image = picked_image;
		prev_image = picked_image;
		curr_image = picked_image;
	}
	
	if( picked_image != curr_image ){
		prev_image = curr_image;
		curr_image = picked_image;
		curr_color = edited_color;
	}
	if( curr_image == orig_image ){
		curr_color = orig_color;
	}
	
	$.SelectedImage.image = thumb;
	$.SelectedImage.borderColor = curr_color;
	
	for( var i=0; i<listeners.length; i++ ){
		var listener = listeners[i];
		if( listener.name == "imageSelected" ){
			listener.callback(picked_image_blob);
		}
	}
	
	changeHandler(curr_image);
};

function openImagePicker(e){
	if( !editable ){ return; }
	
	Ti.Media.openPhotoGallery({
		success      : function(event){ imageHandler(event); },
		cancel       : function(){},
		error        : function(){},
		allowEditing : false,
		mediaTypes   : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
}

// *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *

exports.setValue = function(new_image){ // argument new_image is base64 string
	if( !new_image ){
		new_image = Alloy.createController('Framework/DummyImageIcon').getView().toImage();
	}
	
	if( !orig_image ){
		orig_image = new_image;
		prev_image = new_image;
		curr_image = new_image;
	}
	
	prev_image = curr_image;
	curr_image = new_image;
	
	if( !curr_image ){
		showHintTexts();
	}else{
		var blob = Ti.Utils.base64decode(curr_image);
		var image = Ti.UI.createImageView({ image:blob }).toImage(); // marking blob as image...
		var thumb = ImageTools.makeThumbnailImage(image);
		$.SelectedImage.image = thumb;
	}
};

exports.getValue = function(){
	return curr_image; // base64 string
};

exports.getImage = function(){
	return curr_image; // base64 string
};

exports.clear = function(){
};

// hintText

var hintTexts = [];

var showHintTexts = function(){
//	$.SelectedImage = Alloy.createController('Framework/DummyImageIcon').getView();
	$.SelectedImage.borderColor = '#aaa';
};

var hideHintTexts = function(){
	$.SelectedImageView = Ti.UI.createImageView();
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

