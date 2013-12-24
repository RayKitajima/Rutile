
// ModelManifest

// Segment/Entity : relative path

var Manifest = { {{#Align_colon}}
{{#SegmentsDef}}{{#Entities}}
	"{{segment}}/{{entity}}" : "Model/{{segment}}/{{entity}}"{{^lastOfSegmentedEntities}},{{/lastOfSegmentedEntities}}
{{/Entities}}{{/SegmentsDef}}
{{/Align_colon}}};

module.exports = Manifest;

