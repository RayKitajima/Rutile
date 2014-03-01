
var generators = {
	
	controllers : {
		// Component/EditForm
		"Component/EditForm/Segment/Entity/PrimaryKey"     : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/PrimaryKey'),
		"Component/EditForm/Segment/Entity/Number"         : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Number'),
		"Component/EditForm/Segment/Entity/TextField"      : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/TextField'),
		"Component/EditForm/Segment/Entity/TextArea"       : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/TextArea'),
		"Component/EditForm/Segment/Entity/Date"           : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Date'),
		"Component/EditForm/Segment/Entity/Timestamp"      : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Timestamp'),
		"Component/EditForm/Segment/Entity/Extkey"         : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Extkey'),
		"Component/EditForm/Segment/Entity/Image"          : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Image'),
		"Component/EditForm/Segment/Entity/Geography"      : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Geography'),
		"Component/EditForm/Segment/Entity/Collection"     : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Collection'),
		"Component/EditForm/Segment/Entity/Collection_Img" : require('./MyAppClient_Gen/app/Component/controllers/EditForm/Segment/Entity/Collection_Img'),
		
		// Component/SearchForm
		"Component/SearchForm/Segment/Entity/SelectbyKey"       : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyKey'),
		"Component/SearchForm/Segment/Entity/SelectbyLike"      : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyLike'),
		"Component/SearchForm/Segment/Entity/SelectbyNum"       : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyNum'),
		"Component/SearchForm/Segment/Entity/SelectbyDate"      : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyDate'),
		"Component/SearchForm/Segment/Entity/SelectbyTimestamp" : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyTimestamp'),
		"Component/SearchForm/Segment/Entity/SelectbyArea"      : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyArea'),
		"Component/SearchForm/Segment/Entity/SelectbyNearby"    : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/SelectbyNearby'),
		"Component/SearchForm/Segment/Entity/Orderbys"          : require('./MyAppClient_Gen/app/Component/controllers/SearchForm/Segment/Entity/Orderbys'),
		
		// Framework
		"Framework" : require('./MyAppClient_Gen/app/Framework/controllers/Framework'), // static
		
		// KitchenSink
		"KitchenSink/index"                                    : require('./MyAppClient_Gen/app/KitchenSink/controllers/index'),
		"KitchenSink/EntityList"                               : require('./MyAppClient_Gen/app/KitchenSink/controllers/EntityList'),
//		"KitchenSink/Segment/Entity/Extkey/SearchForm"         : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Extkey/ExtkeySearchForm'),
//		"KitchenSink/Segment/Entity/Extkey/List"               : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Extkey/ExtkeyList'),
//		"KitchenSink/Segment/Entity/Extkey/NewForm"            : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Extkey/ExtkeyNewForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/SearchForm" : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection_Img/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/List"       : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection_Img/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection_Img/NewForm"    : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection_Img/CollectionNewForm'),
//		"KitchenSink/Segment/Entity/Collection/SearchForm"     : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection/List"           : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection/NewForm"        : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/Collection/CollectionNewForm'),
		"KitchenSink/Segment/Entity/EditForm"                  : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityEditForm'),
		"KitchenSink/Segment/Entity/EditFormReusable"          : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityEditFormReusable'),
		"KitchenSink/Segment/Entity/List"                      : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityList'),
		"KitchenSink/Segment/Entity/ListReusable"              : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityListReusable'),
		"KitchenSink/Segment/Entity/List_Img"                  : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityList_Img'),
		"KitchenSink/Segment/Entity/ListReusable_Img"          : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntityListReusable_Img'),
		"KitchenSink/Segment/Entity/SearchForm"                : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntitySearchForm'),
		"KitchenSink/Segment/Entity/SearchFormReusable"        : require('./MyAppClient_Gen/app/KitchenSink/controllers/Segment/Entity/EntitySearchFormReusable'),
	},
	styles : {
		// Component/EditForm
		"Component/EditForm/Segment/Entity/PrimaryKey"     : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/PrimaryKey'),
		"Component/EditForm/Segment/Entity/Number"         : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Number'),
		"Component/EditForm/Segment/Entity/TextField"      : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/TextField'),
		"Component/EditForm/Segment/Entity/TextArea"       : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/TextArea'),
		"Component/EditForm/Segment/Entity/Date"           : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Date'),
		"Component/EditForm/Segment/Entity/Timestamp"      : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Timestamp'),
		"Component/EditForm/Segment/Entity/Extkey"         : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Extkey'),
		"Component/EditForm/Segment/Entity/Image"          : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Image'),
		"Component/EditForm/Segment/Entity/Geography"      : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Geography'),
		"Component/EditForm/Segment/Entity/Collection"     : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Collection'),
		"Component/EditForm/Segment/Entity/Collection_Img" : require('./MyAppClient_Gen/app/Component/styles/EditForm/Segment/Entity/Collection_Img'),
		
		// Component/SearchForm
		"Component/SearchForm/Segment/Entity/SelectbyKey"       : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyKey'),
		"Component/SearchForm/Segment/Entity/SelectbyLike"      : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyLike'),
		"Component/SearchForm/Segment/Entity/SelectbyNum"       : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyNum'),
		"Component/SearchForm/Segment/Entity/SelectbyDate"      : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyDate'),
		"Component/SearchForm/Segment/Entity/SelectbyTimestamp" : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyTimestamp'),
		"Component/SearchForm/Segment/Entity/SelectbyArea"      : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyArea'),
		"Component/SearchForm/Segment/Entity/SelectbyNearby"    : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/SelectbyNearby'),
		"Component/SearchForm/Segment/Entity/Orderbys"          : require('./MyAppClient_Gen/app/Component/styles/SearchForm/Segment/Entity/Orderbys'),
		
		// Framework
		"Framework" : require('./MyAppClient_Gen/app/Framework/styles/Framework'), // static
		
		// KitchenSink (static)
		"KitchenSink/index"                                    : require('./MyAppClient_Gen/app/KitchenSink/styles/index'),
		"KitchenSink/EntityList"                               : require('./MyAppClient_Gen/app/KitchenSink/styles/EntityList'),
//		"KitchenSink/Segment/Entity/Extkey/SearchForm"         : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Extkey/ExtkeySearchForm'),
//		"KitchenSink/Segment/Entity/Extkey/List"               : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Extkey/ExtkeyList'),
//		"KitchenSink/Segment/Entity/Extkey/NewForm"            : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Extkey/ExtkeyNewForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/SearchForm" : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection_Img/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/List"       : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection_Img/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection_Img/NewForm"    : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection_Img/CollectionNewForm'),
//		"KitchenSink/Segment/Entity/Collection/SearchForm"     : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection/List"           : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection/NewForm"        : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/Collection/CollectionNewForm'),
		"KitchenSink/Segment/Entity/EditForm"                  : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityEditForm'),
		"KitchenSink/Segment/Entity/EditFormReusable"          : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityEditFormReusable'),
		"KitchenSink/Segment/Entity/List"                      : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityList'),
		"KitchenSink/Segment/Entity/ListReusable"              : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityListReusable'),
		"KitchenSink/Segment/Entity/List_Img"                  : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityList_Img'),
		"KitchenSink/Segment/Entity/ListReusable_Img"          : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntityListReusable_Img'),
		"KitchenSink/Segment/Entity/SearchForm"                : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntitySearchForm'),
		"KitchenSink/Segment/Entity/SearchFormReusable"        : require('./MyAppClient_Gen/app/KitchenSink/styles/Segment/Entity/EntitySearchFormReusable'),
	},
	views : {
		// Component/EditForm
		"Component/EditForm/Segment/Entity/PrimaryKey"     : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/PrimaryKey'),
		"Component/EditForm/Segment/Entity/Number"         : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Number'),
		"Component/EditForm/Segment/Entity/TextField"      : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/TextField'),
		"Component/EditForm/Segment/Entity/TextArea"       : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/TextArea'),
		"Component/EditForm/Segment/Entity/Date"           : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Date'),
		"Component/EditForm/Segment/Entity/Timestamp"      : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Timestamp'),
		"Component/EditForm/Segment/Entity/Extkey"         : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Extkey'),
		"Component/EditForm/Segment/Entity/Image"          : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Image'),
		"Component/EditForm/Segment/Entity/Geography"      : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Geography'),
		"Component/EditForm/Segment/Entity/Collection"     : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Collection'),
		"Component/EditForm/Segment/Entity/Collection_Img" : require('./MyAppClient_Gen/app/Component/views/EditForm/Segment/Entity/Collection_Img'),
		
		// Component/SearchForm
		"Component/SearchForm/Segment/Entity/SelectbyKey"       : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyKey'),
		"Component/SearchForm/Segment/Entity/SelectbyLike"      : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyLike'),
		"Component/SearchForm/Segment/Entity/SelectbyNum"       : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyNum'),
		"Component/SearchForm/Segment/Entity/SelectbyDate"      : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyDate'),
		"Component/SearchForm/Segment/Entity/SelectbyTimestamp" : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyTimestamp'),
		"Component/SearchForm/Segment/Entity/SelectbyArea"      : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyArea'),
		"Component/SearchForm/Segment/Entity/SelectbyNearby"    : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/SelectbyNearby'),
		"Component/SearchForm/Segment/Entity/Orderbys"          : require('./MyAppClient_Gen/app/Component/views/SearchForm/Segment/Entity/Orderbys'),
		
		// Framework
		"Framework" : require('./MyAppClient_Gen/app/Framework/views/Framework'), // static
		
		// KitchenSink
		"KitchenSink/index"                                    : require('./MyAppClient_Gen/app/KitchenSink/views/index'),
		"KitchenSink/EntityList"                               : require('./MyAppClient_Gen/app/KitchenSink/views/EntityList'),
//		"KitchenSink/Segment/Entity/Extkey/SearchForm"         : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Extkey/ExtkeySearchForm'),
//		"KitchenSink/Segment/Entity/Extkey/List"               : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Extkey/ExtkeyList'),
//		"KitchenSink/Segment/Entity/Extkey/NewForm"            : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Extkey/ExtkeyNewForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/SearchForm" : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection_Img/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection_Img/List"       : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection_Img/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection_Img/NewForm"    : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection_Img/CollectionNewForm'),
//		"KitchenSink/Segment/Entity/Collection/SearchForm"     : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection/CollectionSearchForm'),
//		"KitchenSink/Segment/Entity/Collection/List"           : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection/CollectionList'),
//		"KitchenSink/Segment/Entity/Collection/NewForm"        : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/Collection/CollectionNewForm'),
		"KitchenSink/Segment/Entity/EditForm"                  : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityEditForm'),
		"KitchenSink/Segment/Entity/EditFormReusable"          : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityEditFormReusable'),
		"KitchenSink/Segment/Entity/List"                      : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityList'),
		"KitchenSink/Segment/Entity/ListReusable"              : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityListReusable'),
		"KitchenSink/Segment/Entity/List_Img"                  : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityList_Img'),
		"KitchenSink/Segment/Entity/ListReusable_Img"          : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntityListReusable_Img'),
		"KitchenSink/Segment/Entity/SearchForm"                : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntitySearchForm'),
		"KitchenSink/Segment/Entity/SearchFormReusable"        : require('./MyAppClient_Gen/app/KitchenSink/views/Segment/Entity/EntitySearchFormReusable'),
	},
	common : {
		"i18n"                   : require('./MyAppClient_Gen/i18n/i18n'), // branches for each lang in it
		"lib"                    : require('./MyAppClient_Gen/app/lib/lib'),
		"lib/CentralDispatch"    : require('./MyAppClient_Gen/app/lib/CentralDispatch'),
		"ModelFactory"           : require('./MyAppClient_Gen/app/lib/Model/ModelFactory'),
		"ModelManifest"          : require('./MyAppClient_Gen/app/lib/Model/ModelManifest'),
		"Model/Entity"           : require('./MyAppClient_Gen/app/lib/Model/Segment/Entity'),
		"Model/Collection"       : require('./MyAppClient_Gen/app/lib/Model/Segment/Collection'),
		"ModelSanitizerFactory"  : require('./MyAppClient_Gen/app/lib/ModelSanitizer/ModelSanitizerFactory'),
		"ModelSanitizerManifest" : require('./MyAppClient_Gen/app/lib/ModelSanitizer/ModelSanitizerManifest'),
		"DummySanitizer"         : require('./MyAppClient_Gen/app/lib/ModelSanitizer/DummySanitizer'),
		"modules"                : require('./MyAppClient_Gen/modules/modules'),
		"Resources"              : require('./MyAppClient_Gen/Resources/Resources'),
		"setup"                  : require('./MyAppClient_Gen/setup/setup'),
		"tools/tiappmaker"       : require('./MyAppTools_Gen/tiappmaker'),
		"tools/tiappxmlfixer"    : require('./MyAppTools_Gen/tiappxmlfixer'),
	},
	
};

var generate = function(target,type,options){
	//console.log("[Generator] generate called target:"+target+',type:'+type);
	var type_generators = generators[type];
	var ConcreteGenerator = type_generators[target];
	ConcreteGenerator.generate(options);
};

module.exports = {
	generate : generate
};

