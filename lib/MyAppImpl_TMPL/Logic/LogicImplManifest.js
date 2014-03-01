
// LogicImplManifest

// Segment/Entity : relative path

var Manifest = {
{{#hasAutoLogicImpl}}{{#Align_colon}}
{{#ImplAuthLogic}}{{#AuthPassword}}
	"AuthPassword" : "./AuthPassword",
{{/AuthPassword}}{{/ImplAuthLogic}}
{{#Entities}}
	"{{segment}}/{{entity}}" : "./{{segment}}/{{entity}}"{{^last}},{{/last}}
{{/Entities}}
{{/Align_colon}}{{/hasAutoLogicImpl}}
}

module.exports = Manifest;

