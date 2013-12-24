
-- 
-- database segment : {{segmentName}}
-- 

{{#Entities}}
{{#isEntity}}
create table {{#Escape_reserved_raw}}{{#Lc_first}}{{entityName}}{{/Lc_first}}{{/Escape_reserved_raw}} ({{#Fields}}
	{{#Escape_reserved_raw}}{{fieldName}}{{/Escape_reserved_raw}} {{type}},{{/Fields}}
	unique({{#Escape_reserved_raw}}{{primary_key}}{{/Escape_reserved_raw}})
);
{{#sequenceName}}
create sequence {{sequenceName}}{{#start}} start {{start}}{{/start}};
{{/sequenceName}}
{{/isEntity}}
{{#isCollection}}
create table {{#Escape_reserved_raw}}{{#Lc_first}}{{entityName}}{{/Lc_first}}{{/Escape_reserved_raw}} (
	{{#Escape_reserved_raw}}{{collector_primary_key}}{{/Escape_reserved_raw}} int4,
	{{#Escape_reserved_raw}}{{collected_primary_key}}{{/Escape_reserved_raw}} int4
);
{{/isCollection}}

{{/Entities}}

