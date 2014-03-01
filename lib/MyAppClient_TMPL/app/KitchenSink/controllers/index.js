
var self = exports;

{{#GeoTools}}
Alloy.Globals.Rutile = {
	"CFG" : {
		GeoTools : { 
			DefaultRegion         : {"longitudeDelta":{{GeoTools_DefaultRegion_longitudeDelta}},"longitude":{{GeoTools_DefaultRegion_longitude}},"latitude":{{GeoTools_DefaultRegion_latitude}},"latitudeDelta":{{GeoTools_DefaultRegion_latitudeDelta}}},
			DefaultLongitudeDelta : {{GeoTools_DefaultLongitudeDelta}},
			DefaultLatitudeDelta  : {{GeoTools_DefaultLatitudeDelta}},
		}
	}
};
{{/GeoTools}}

Ti.UI.setBackgroundColor('#000');

$.index.open();

var navi = $.NavigationGroup;
navi.setRootWindow($.index);
navi.enableBackButton();

{{#ImplAuthLogic}}

{{#AuthPassword}}
// listener will be never called when it occurs authorization error.
// it should be caught by NotificationCenter with Error.AuthPassword.authorize event.
exports.listenAuthorized = function(result){
	if( result ){
		// got valid signed token
		Alloy.Globals.Rutile.token = result;
		var entityList = Alloy.createController("/KitchenSink/EntityList");
		navi.init();
		navi.open(entityList);
	}
};
var AuthPassword = Alloy.createController("/Framework/AuthPassword");
AuthPassword.setListener(self);
navi.open(AuthPassword);

var Notifier = require('NotificationCenter');
Notifier.listen('Error.AuthPassword.authorize',function(Error){
	var dialog = Ti.UI.createAlertDialog({
		title       : L('FrameworkMessageAuthorizationFailed'),
		message     : L('FrameworkMessageAuthorizationFailedMessage'),
		buttonNames : [L('FrameworkMessageClose')],
		cancel      : 0,
	});
	dialog.addEventListener('click', function(e){
		if( e.index == 0 ){
			return;
		}
	});
	dialog.show();
});
Notifier.listen('Error.AuthPassword.authenticate',function(Error){
	var dialog = Ti.UI.createAlertDialog({
		title       : L('FrameworkMessageAuthenticationFailed'),
		message     : L('FrameworkMessageAuthenticationFailedMessage'),
		buttonNames : [L('FrameworkMessageClose')],
		cancel      : 0,
	});
	dialog.addEventListener('click', function(e){
		if( e.index == 0 ){
			var AuthPassword = Alloy.createController("/Framework/AuthPassword");
			AuthPassword.setListener(self);
			navi.init();
			navi.open(AuthPassword);
		}
	});
	dialog.show();
});
{{/AuthPassword}}

{{/ImplAuthLogic}}

{{^ImplAuthLogic}}
var entityList = Alloy.createController("/KitchenSink/EntityList");
navi.open(entityList);
{{/ImplAuthLogic}}

