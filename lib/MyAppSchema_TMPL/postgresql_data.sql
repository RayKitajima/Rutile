
-- 
-- database segment : {{segmentName}}
-- 

{{#Entities}}
{{#isEntity}}
-- {{#Uc_first}}{{entityName}}{{/Uc_first}}

{{#Data}}
insert into {{#Escape_reserved_raw}}{{#Lc_first}}{{entityName}}{{/Lc_first}}{{/Escape_reserved_raw}} values ( {{#values}}{{#rawvalue}}{{value}}{{/rawvalue}}{{#escvalue}}'{{value}}'{{/escvalue}}{{^last}}, {{/last}}{{/values}} );
{{/Data}}

{{/isEntity}}
{{/Entities}}

