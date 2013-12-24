
// ContianerManifest

// Segment : container name

var Manifest = {
{{#Align_colon}}{{#Segments}}
	"{{segment}}" : "{{segment}}"{{^last}},{{/last}}
{{/Segments}}
{{/Align_colon}}
};

module.exports = Manifest;

