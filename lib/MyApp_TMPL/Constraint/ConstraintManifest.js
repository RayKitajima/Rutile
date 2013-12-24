
// ConstraintManifest

// Segment/Entity : relative path

var Manifest = { {{#Align_colon}}
{{#Entities}}
{{^collection}}
	"{{segment}}/{{entity}}" : "./{{segment}}/{{entity}}SQLMaker"{{^last}},{{/last}}
{{/collection}}
{{/Entities}}
{{/Align_colon}}
};

module.exports = Manifest;

