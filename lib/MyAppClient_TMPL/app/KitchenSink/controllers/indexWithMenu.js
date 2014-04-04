
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

// configure SideMenu

var sideMenu = $.NavigationMenu;
sideMenu.setRootWindow($.index);

// menu:EntityList
var EntityList = Alloy.createController("/KitchenSink/EntityList");
var navi_entityLiest = sideMenu.addSideMenu({
	name      : 'Navigation.EntityList',
	firstpage : EntityList,
});

{{#ImplAuthLogic}}
{{#AuthPassword}}
// listener will be never called when it occurs authorization error.
// it should be caught by NotificationCenter with Error.AuthPassword.authorize event.
exports.listenAuthorized = function(result){
	if( result ){
		// got valid signed token
		Alloy.Globals.Rutile.token = result;
		sideMenu.showSideMenuOf('Navigation.EntityList');
	}
};
var AuthPassword = Alloy.createController("/Framework/AuthPassword");
AuthPassword.setListener(self);
// menu:AuthPassword
var navi_auth = sideMenu.addSideMenu({
	name      : 'Navigation.AuthPassword',
	firstpage : AuthPassword,
});

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
			sideMenu.showSideMenuOf('Navigation.AuthPassword');
		}
	});
	dialog.show();
});
{{/AuthPassword}}
{{/ImplAuthLogic}}

{{#ImplAuthLogic}}
{{#AuthPassword}}
sideMenu.showSideMenuOf('Navigation.AuthPassword');
{{/AuthPassword}}
{{/ImplAuthLogic}}
{{^ImplAuthLogic}}
sideMenu.showSideMenuOf('Navigation.EntityList');
{{/ImplAuthLogic}}

