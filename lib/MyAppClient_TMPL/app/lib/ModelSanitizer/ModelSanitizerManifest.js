
// ModelSanitizerManifest

// Segment/Entity : relative path

var Manifest = { {{#Align_colon}}
{{#SegmentsDef}}
{{#Entities}}
	"{{segment}}/{{entity}}" : "./{{segment}}/{{entity}}",
{{/Entities}}
{{/SegmentsDef}}
{{/Align_colon}}
};

module.exports = Manifest;

