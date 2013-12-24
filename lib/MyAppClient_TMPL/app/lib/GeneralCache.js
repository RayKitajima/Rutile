
// 
// general cache module
// 
// usage:
//     
//     var Cache = require('GeneralCache');
//     
//     // case: caching thumbnail and metadata of its original image
//     
//     // set
//     
//     var blob  = imageView.toImage();
//     var thumb = blob.imageAsThumbnail(thumb_size);
//     
//     var key = ['Thumbnail','Segment','Entity','primaryKey','field_name'].join('/');
//     var json = {
//         thumb  : Ti.Utils.base64encode(thumb),
//         width  : blob.width,
//         height : blob.height,
//         length : blbo.length
//     };
//     var data = JSON.stringify(json);
//     
//     Cache.set(key,data);
//     
//     // get
//     
//     var data = Cache.get(key);
//     var json = JSON.parse(data);
//     var blob = Ti.Utils.base64decode(json.thumb);
//     
//     var ImageView = Ti.UI.createImageView();
//     imageView.image = blob;
//     
//     console.log("original image size:"+json.width+"x"+json.height);
//     
//     

var db = Ti.Database.open('GeneralCache_DB');
db.execute('create table if not exists general_cache ( key text, data text )');

var get = function(key){
	var rows = db.execute('select data from general_cache where key=?',key);
	var data;
	while( rows.isValidRow() ){
		data = rows.data;
		rows.next();
	}
	return data;
};

var set = function(key,data){
	db.execute('insert into general_cache values (?,?)',key,data);
};

var remove = function(key){
	db.execute('delete from general_cache where key=?',key);
};

module.exports = {
	get    : get,
	set    : set,
	remove : remove,
};

