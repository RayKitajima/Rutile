
// ConstraintManifest

var Manifest = {
	// field(type) : relative path
	"selectby" : 
	{ {{#Align_colon}}
		"selectAll" : "./{{entity}}/SelectAll", // special
{{#Selectbys}}
		"{{search_segment}}/{{search_entity}}.{{search_field}}({{search_type}})" : "./{{entity}}/Selectby{{search_entity}}{{#Uc_first}}{{search_field}}{{/Uc_first}}{{#Uc_first}}{{search_type}}{{/Uc_first}}"{{^last}},{{/last}}
{{/Selectbys}}
{{/Align_colon}}
	},
	
	// field : relative path
	"orderby" : 
	{ {{#Align_colon}}
{{#Orderbys}}
		"{{field}}" : "./{{entity}}/Orderby{{#Uc_first}}{{field}}{{/Uc_first}}",
		"{{field}}WithLimit" : "./{{entity}}/Orderby{{#Uc_first}}{{field}}{{/Uc_first}}WithLimit"{{^last}},{{/last}}
{{/Orderbys}}
{{/Align_colon}}
	},
	
	"limit" : "./{{entity}}/Limit", // special
};

module.exports = Manifest;

