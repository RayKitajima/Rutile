
// usage:
//     
//     var ImageTools = require('ImageTools');
//     
//     var thumb = ImageTools.makeSquareImage(blob);
//     
//     

var DEFAULT_THUMBNAIL_SIZE = 40;

exports.thumbnailSize = function(){
	return DEFAULT_THUMBNAIL_SIZE;
};

exports.makeThumbnailImage = function(blob,size){
	if( !size ){ size = DEFAULT_THUMBNAIL_SIZE; }
	return blob.imageAsThumbnail(size);
};

exports.makeSquareImage = function(blob){
	var width = blob.width;
	var height = blob.height;
	var square_size;
	var x_offset = 0;
	var y_offset = 0;
	if( height > width ){
		square_size = width;
		y_offset = ( height - width ) / 2;
	}else{
		square_size = height;
		x_offset = ( width - height ) / 2;
	}
	return blob.imageAsCropped({
		x      : x_offset,
		y      : y_offset,
		width  : square_size,
		height : square_size,
	});
};

exports.getBase64StringFromImage = function(blob){
	return Ti.Utils.base64encode(blob).toString();
};

exports.getImageFromBase64String = function(string){
	var blob = Ti.Utils.base64decode(string);
	var tmp_view = Ti.UI.createImageView({image:blob});
	return tmp_view.toImage();
};

