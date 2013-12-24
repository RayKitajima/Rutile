
// ModelSanitizerManifest

// Segment/Entity : relative path

var Manifest = {
{{#Align_colon}}
{{#Entities}}
	"{{segment}}/{{entity}}" : "./{{segment}}/{{entity}}"{{^last}},{{/last}}
{{/Entities}}
{{/Align_colon}}
};

module.exports = Manifest;

