
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

var entityList = Alloy.createController("/KitchenSink/EntityList");
navi.open(entityList);
