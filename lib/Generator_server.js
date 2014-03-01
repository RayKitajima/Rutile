
var generators = {
	"MyApp"   : require('./MyApp_Gen/MyApp'),
	"package" : require('./MyApp_Gen/package'),
	
	// Container
	"Container/ContainerFactory"  : require('./MyApp_Gen/Container/ContainerFactory'),
	"Container/ContainerManifest" : require('./MyApp_Gen/Container/ContainerManifest'),
	"Container/Container"         : require('./MyApp_Gen/Container/Container'),
	"Container/Transaction"       : require('./MyApp_Gen/Container/Transaction'),
	"Container/ContainerFacade"   : require('./MyApp_Gen/Container/ContainerFacade'),
	"Container/TransactionFacade" : require('./MyApp_Gen/Container/TransactionFacade'),
	
	// Model
	"Model/ModelFactory"       : require('./MyApp_Gen/Model/ModelFactory'),
	"Model/ModelManifest"      : require('./MyApp_Gen/Model/ModelManifest'),
	"Model/Segment"            : require('./MyApp_Gen/Model/Segment'), // just create segment folders
	"Model/Segment/Entity"     : require('./MyApp_Gen/Model/Segment/Entity'),
	"Model/Segment/Collection" : require('./MyApp_Gen/Model/Segment/Collection'),
	
	// ModelSanitizer
	"ModelSanitizer/ModelSanitizerFactory"  : require('./MyApp_Gen/ModelSanitizer/ModelSanitizerFactory'),
	"ModelSanitizer/ModelSanitizerManifest" : require('./MyApp_Gen/ModelSanitizer/ModelSanitizerManifest'),
	"ModelSanitizer/GenericSanitizer"       : require('./MyApp_Gen/ModelSanitizer/GenericSanitizer'),
	"ModelSanitizer/Segment"                : require('./MyApp_Gen/ModelSanitizer/Segment'), // just create folders
	"ModelSanitizer/Segment/Entity"         : require('./MyApp_Gen/ModelSanitizer/Segment/Entity'),
	"ModelSanitizer/Segment/Collection"     : require('./MyApp_Gen/ModelSanitizer/Segment/Collection'),
	
	// ModelValidator
	"ModelValidator/ModelValidatorFactory"  : require('./MyApp_Gen/ModelValidator/ModelValidatorFactory'),
	"ModelValidator/ModelValidatorManifest" : require('./MyApp_Gen/ModelValidator/ModelValidatorManifest'),
	"ModelValidator/GenericValidator"       : require('./MyApp_Gen/ModelValidator/GenericValidator'),
	"ModelValidator/Segment"                : require('./MyApp_Gen/ModelValidator/Segment'), // just create folders
	"ModelValidator/Segment/Entity"         : require('./MyApp_Gen/ModelValidator/Segment/Entity'),
	"ModelValidator/Segment/Collection"     : require('./MyApp_Gen/ModelValidator/Segment/Collection'),
	
	// Constraint
	"Constraint/ConstraintFactory"                               : require('./MyApp_Gen/Constraint/ConstraintFactory'),
	"Constraint/ConstraintManifest"                              : require('./MyApp_Gen/Constraint/ConstraintManifest'),
	"Constraint/Segment"                                         : require('./MyApp_Gen/Constraint/Segment'), // just create folders
	"Constraint/Entity"                                          : require('./MyApp_Gen/Constraint/Entity'), // just create folders
	"Constraint/Segment/EntitySQLMaker"                          : require('./MyApp_Gen/Constraint/Segment/EntitySQLMaker'),
	"Constraint/Segment/EntityManifest"                          : require('./MyApp_Gen/Constraint/Segment/EntityManifest'),
	"Constraint/Segment/Entity/SelectAll"                        : require('./MyApp_Gen/Constraint/Segment/Entity/SelectAll'),
	"Constraint/Segment/Entity/SelectbyField_Key"                : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Key'),
	"Constraint/Segment/Entity/SelectbyField_Key_join"           : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Key_join'),
	"Constraint/Segment/Entity/SelectbyField_Key_join_ext"       : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Key_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Key_jnx"            : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Key_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Key_jnx_ext"        : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Key_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Num"                : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Num'),
	"Constraint/Segment/Entity/SelectbyField_Num_join"           : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Num_join'),
	"Constraint/Segment/Entity/SelectbyField_Num_join_ext"       : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Num_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Num_jnx"            : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Num_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Num_jnx_ext"        : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Num_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Like"               : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Like'),
	"Constraint/Segment/Entity/SelectbyField_Like_join"          : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Like_join'),
	"Constraint/Segment/Entity/SelectbyField_Like_join_ext"      : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Like_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Like_jnx"           : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Like_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Like_jnx_ext"       : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Like_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Date"               : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Date'),
	"Constraint/Segment/Entity/SelectbyField_Date_join"          : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Date_join'),
	"Constraint/Segment/Entity/SelectbyField_Date_join_ext"      : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Date_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Date_jnx"           : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Date_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Date_jnx_ext"       : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Date_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Timestamp"          : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Timestamp'),
	"Constraint/Segment/Entity/SelectbyField_Timestamp_join"     : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Timestamp_join'),
	"Constraint/Segment/Entity/SelectbyField_Timestamp_join_ext" : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Timestamp_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Timestamp_jnx"      : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Timestamp_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Timestamp_jnx_ext"  : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Timestamp_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Nearby"             : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Nearby'),
	"Constraint/Segment/Entity/SelectbyField_Nearby_join"        : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Nearby_join'),
	"Constraint/Segment/Entity/SelectbyField_Nearby_join_ext"    : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Nearby_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Nearby_jnx"         : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Nearby_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Nearby_jnx_ext"     : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Nearby_jnx_ext'),
	"Constraint/Segment/Entity/SelectbyField_Area"               : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Area'),
	"Constraint/Segment/Entity/SelectbyField_Area_join"          : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Area_join'),
	"Constraint/Segment/Entity/SelectbyField_Area_join_ext"      : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Area_join_ext'),
	"Constraint/Segment/Entity/SelectbyField_Area_jnx"           : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Area_jnx'),
	"Constraint/Segment/Entity/SelectbyField_Area_jnx_ext"       : require('./MyApp_Gen/Constraint/Segment/Entity/SelectbyField_Area_jnx_ext'),
	"Constraint/Segment/Entity/OrderbyField"                     : require('./MyApp_Gen/Constraint/Segment/Entity/OrderbyField'),
	"Constraint/Segment/Entity/OrderbyField_join"                : require('./MyApp_Gen/Constraint/Segment/Entity/OrderbyField_join'),
	
	// Logic
	"Logic/LogicFactory"       : require('./MyApp_Gen/Logic/LogicFactory'),
	"Logic/LogicManifest"      : require('./MyApp_Gen/Logic/LogicManifest'),
	"Logic/Segment"            : require('./MyApp_Gen/Logic/Segment'), // just create folders
	"Logic/Segment/Entity"     : require('./MyApp_Gen/Logic/Segment/Entity'),
	"Logic/Segment/Collection" : require('./MyApp_Gen/Logic/Segment/Collection'),
	
	// Utils
	"Utils/Utils" : require('./MyApp_Gen/Utils/Utils'), // just write out Utils.js
	
	// Implementations
	"MyAppImpl"                                    : require('./MyAppImpl_Gen/MyAppImpl'),
	"MyAppImpl/package"                            : require('./MyAppImpl_Gen/package'),
	"ModelImpl/ModelImplFactory"                   : require('./MyAppImpl_Gen/Model/ModelImplFactory'),
	"ModelSanitizerImpl/ModelSanitizerImplFactory" : require('./MyAppImpl_Gen/ModelSanitizer/ModelSanitizerImplFactory'),
	"ModelValidatorImpl/ModelValidatorImplFactory" : require('./MyAppImpl_Gen/ModelValidator/ModelValidatorImplFactory'),
	"ConstraintImpl/ConstraintImplFactory"         : require('./MyAppImpl_Gen/Constraint/ConstraintImplFactory'),
	"ConstraintImpl/SelectbyImplFactory"           : require('./MyAppImpl_Gen/Constraint/SelectbyImplFactory'),
	"ConstraintImpl/OrderbyImplFactory"            : require('./MyAppImpl_Gen/Constraint/OrderbyImplFactory'),
	"LogicImpl/LogicImplFactory"                   : require('./MyAppImpl_Gen/Logic/LogicImplFactory'),
	"LogicImpl/LogicImplManifest"                  : require('./MyAppImpl_Gen/Logic/LogicImplManifest'),
	"LogicImpl/AuthPassword"                       : require('./MyAppImpl_Gen/Logic/AuthPassword'),
	"LogicImpl/Segment"                            : require('./MyAppImpl_Gen/Logic/Segment'),
	"LogicImpl/Segment/Entity"                     : require('./MyAppImpl_Gen/Logic/Segment/Entity'),
	"LogicImpl/Segment/Collection"                 : require('./MyAppImpl_Gen/Logic/Segment/Collection'),
	
	// config
	"MyAppConfig"                : require('./MyAppConfig_Gen/MyAppConfig'),
	"MyAppConfig/package"        : require('./MyAppConfig_Gen/package'),
	"MyAppConfig/README"         : require('./MyAppConfig_Gen/README'),
	"MyAppConfig/SSLDefaultCert" : require('./MyAppConfig_Gen/SSLDefaultCert'),
	"MyAppConfig/JWSDefaultCert" : require('./MyAppConfig_Gen/JWSDefaultCert'),
	
	// schema
	"schema/postgresql" : require('./MyAppSchema_Gen/postgresql'),
	
	// server
	"Server" : require('./MyAppServer_Gen/server'),
};

var generate = function(target,options){
	//console.log("[Generator] generate called:"+target);
	var ConcreteGenerator = generators[target];
	ConcreteGenerator.generate(options);
};

module.exports = {
	generate : generate
};

