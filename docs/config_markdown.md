
# Config.txt

Config.txt is the entry point of auto generation.

## Sample

```
APP_NAME : DemoShop

SelectAllLimit : 1000
DefaultLanguage : en

Map : Tokyo

GeoTools_DefaultRegion_longitude      : 139.78317260742188
GeoTools_DefaultRegion_latitude       : 35.65126037597656
GeoTools_DefaultRegion_longitudeDelta : 0.439453125
GeoTools_DefaultRegion_latitudeDelta  : 0.46421724557876587

GeoTools_DefaultLongitudeDelta : 0.003433227539
GeoTools_DefaultLatitudeDelta  : 0.003635423956

@Product.txt
@Order.txt
```

## Abstract

| keyword                               | summary                                         |
|:------------------------------------- |:------------------------------------------------|
| APP_NAME                              | Application Name                                |
| SelectAllLimit                        | Num of limit when 'select *'                    |
| DefaultLanguage                       | ISO639 style language definition                |
| Map                                   | Predefined location for Ti.Map                  |
| GeoTools_DefaultRegion_longitude      | Default region for Ti.Map                      |
| GeoTools_DefaultRegion_latitude       | ditto                                           |
| GeoTools_DefaultRegion_longitudeDelta | ditto                                           |
| GeoTools_DefaultRegion_latitudeDelta  | ditto                                           |
| GeoTools_DefaultLongitudeDelta        | Delta option for Ti.Map calling with a location |
| GeoTools_DefaultLatitudeDelta         | ditto                                           |
| @FILE                                 | Importing schema file                           |
| //                                    | comment                                         |

## Detail

Each line should be start with keyword defined in the above abstract.
Its value should be defined after **:**, with the exception of schema file importing by @FILE.

White space will be allowed in the around of separator **:**.

Comment will be started with double slash.

### APP_NAME

Your application name.

Rutile generates components according to this name.

* Your server package will be generated with suffix Server, like DemoShopServer.
* Your server-side main package will be generated as this name, like DemoShop.
* Your toolkit for generating Titanium app will be generated with suffix Tools, like DemoShopTools.
* Your client component package will be generated with suffix Client, like DemoShopClient.
* Your Titanium app will be generated with suffix App, like DemoShopApp.

### SelectAllLimit

Define a limitation number for **select all**.

When you call search logic without any constraint, server will create select all query.
Add a limit for this function.

### DefaultLanguage

ISO639 style language definition.
Rutile will generate i18n file for your Titanium app according to this language.

Currently en(English) and ja(Japanese) is supported.

If you would like to make other language i18n file for your app, 
at first, generate by supported language,
then copy it and edit for your language.

### Map

When you define geographical data in you business entity, 
Rutile will generate UI for search and edit its location.
This functionality is based on Ti.Map module.

Map and GeoTools_DefaultRegion* defines Ti.Map's default region.
Defined later overrides previous definition.

Predefined location can be used by setting Map value.
Otherwise, you have to define GeoTools_DefaultRegion*, described in the following sections.

Available predefined location is London, Warsaw, NewYork and Tokyo.

### GeoTools

#### GeoTools_DefaultRegion

###### GeoTools_DefaultRegion_longitude

'longitude' option for Ti.Map module's default region.

###### GeoTools_DefaultRegion_latitude

'latitude' option for Ti.Map module's default region.

###### GeoTools_DefaultRegion_longitudeDelta

'longitudeDelta' option for Ti.Map module's default region.

###### GeoTools_DefaultRegion_latitudeDelta

'latitudeDelta' option for Ti.Map module's default region.

#### GeoTools_DefaultLongitudeDelta

'longitudeDelta' option for creating Ti.Map view for the specific location.

#### GeoTools_DefaultLatitudeDelta

'latitudeDelta' option for creating Ti.Map view for the specific location.

### @File

Importing schema definition file.

Its format is defined in [docs/schema_markdown.md](https://github.com/RayKitajima/Rutile/blob/master/docs/schema_markdown.md).

### Authentication

#### AuthPassword

Automatically implemnent password base user authentication logic.
Define id and password field to be used, like SEGMENT/ENTITY.ID_FIELD,PASS_FIELD.

#### TokenLifetime

Define JSON Web Token lifetime as second.
This will be evaluated ad JavaScript in config compiler. So you can define mathmatical expression, like 60*60*24.


