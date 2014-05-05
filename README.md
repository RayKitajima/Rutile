
# Rutile

Factory automation for Mobile Enterprise.


## Summary

Rutile is a comprehensive generator for enterprise mobile applications based on MDA (Model Driven Architecture).
Once you define your business entities, Rutile automatically generates both Node.js server and Titanium client application for iOS.

Generated server fully covers SCRUD, search, create, read, update and delete for your data.
Every possibility of search pattern is also preliminarily generated. 
Generated client app also fully covers SCRUD.
UI for all search patterns are also created even if the data is a geographical data.

Both are your KitchenSink.
All you have to do is just select a packages you need.
Of course, those can be run as is.


## Background and target

Traditional business application like sales management system requires strict transaction management.
And companies using like these application usually not mind C10K problem.
So usually, Node.js is not the best solution for such a system.

But, JavaScript is very easy to learn, and Node.js is widely accepted, so its community makes many usable modules.
Additionally, Titanium is also very easy to write apps, and is rapidly improving.
JavaScript is all that needed, while you are in Node.js and Titanium. (And PL/v8 is for DB)

If you can accept synchronous data access in Node.js, and you can select iOS app for your enterprise application,
large part of application development will be done by Rutile.

Rutile is for small/medium scale Mobile Enterprise, or for ultra rapid prototyping.


## Architecture

In server side, data persistent layer is built on PostgreSQL or PostGIS, and object cache layer is on Redis.
Rutile provides traditional container based on them.

```
               [JWT]
+--------+       :         +----------------+
| Ti App |---(wss|https)---| Node.js Server |....[ Logic ]
+--------+                 +-------+--------+
                                   |
                           +-------+--------+
                           |    Container   |....[ Model ]....[ Constraint ]
                           +----+------+----+
                      obj cache |      | persist
                         +------+-+  +-+------------------+
                         | Redist |  | PostgreSQL/PostGIS |
                         +--------+  +--------------------+
```

Client application is built on Alloy MVC framework for Titanium.

```
+-----------------+
|   KitchenSink   | Generated App covering all Components
+-----------------+
| Component/Model | Generated UI components and Models
+-----------------+
|    Framework    | Rutile client framework
+-----------------+
|      Alloy      |
+-----------------+

* Generated Model is not Alloy's model
```


## Prerequisites and installation

Confirmed stable version:

* Node.js 0.11.10
* Titanium SDK 3.2.3.GA
* Titanium CLI 3.2.3
* Alloy 1.3.1

Bleeding edge:

* [Node.js 0.8, 0.10, 0.11+](http://nodejs.org/dist/)
* [PostgreSQL](http://www.postgresql.org) or [PostGIS](http://postgis.net)
* [pg-sync](https://github.com/RayKitajima/pg-sync) synchronous postgresql binding for node.js.
* [redis](http://redis.io)
* [hiredis C library](https://github.com/redis/hiredis)
* [hiredis-simple](https://github.com/RayKitajima/hiredis-simple) synchronous redis binding for node.js.
* bleeding edge of [Titanium SDK](http://builds.appcelerator.com.s3.amazonaws.com/index.html#master) and [Titanium CLI](https://github.com/appcelerator/titanium)
* bleeding edge of [Alloy](https://github.com/appcelerator/alloy)
* [XCode5](https://developer.apple.com/xcode/index.php)

Quick guide to setup your Mavericks is available in [docs/env.md](https://github.com/RayKitajima/rutile/blob/master/docs/env.md).

Rutile itself can be installed by usual practice.

```
sudo npm install rutile -g
```

## Documentation

You can try and look inside the automation by using sample configuration.

```
git clone https://github.com/RayKitajima/rutile_kickstart.git
```

The *1st_step* example is very simple structure.
And others are more complex.
See also [rutile_kickstart/README.md](https://github.com/RayKitajima/rutile_kickstart/blob/master/README.md).

Here is brief overview for using Rutile.

* [How to set up Rutile runnable environment in Mavericks](https://github.com/RayKitajima/Rutile/blob/master/docs/env.md)
* [Config Markdown](https://github.com/RayKitajima/Rutile/blob/master/docs/config_markdown.md)
* [Schema Markdown](https://github.com/RayKitajima/Rutile/blob/master/docs/schema_markdown.md)
* [Specification](https://github.com/RayKitajima/Rutile/blob/master/docs/specification.md)


## Gist of generate

```
// at first, write your Config.txt (see the section of "Gist of config")

// compile config
rutile md2config ./Config.txt

// generate server with the compiled config
rutile generate server ./Config.js

// generate client modules
rutile generate client ./Config.js

// build tiapp
rutile build tiapp ./Config.js

// run server
export NODE_PATH=$NODE_PATH:./DemoShopServer; node ./DemoShopServer/server.js &

// bring up tiapp
titanium build -p ios -d ./DemoShopApp
```

That's all.


## Gist of config

The entry point of automation is Config.txt.
Here, you will define a bit of application information.

```
APP_NAME : DemoShop

SelectAllLimit : 1000
DefaultLanguage : en

// using predefined region for Ti.Map
Map : Tokyo

// import db segment files
@Product.txt
```

The last line imports database definition named Product.txt in the same directory of the Config.txt itself.

Detail of its format will be found in [docs/config_markdown.md](https://github.com/RayKitajima/rutile/blob/master/docs/config_markdown.md).

```
=== Product (Product) ===

# Product (Product)
sequence:productSeq(1000)

	field*				type*		name*			search*				valid*			tags
	-------------------+-----------+---------------+-------------------+---------------+-------------------------
	productID			int4		ProductID		key					notNull			
	productName(*)		text		Product Name	like,orderby		notNull			
	price				int2		Price			num,orderby			positiveValue	
	depositoryID		int			DepositoryID	key,join			-				helper:Product/Depository
	registerDate		timestamp	Date			timestamp,orderby	timestampString	

# Depository (Product depository)
sequence:depositorySeq(1000)

	field*				type*		name*			search*				valid*			tags
	-------------------+-----------+---------------+-------------------+---------------+-------------------------
	depositoryID		int4		Depository ID	key					notNull
	depositoryName(*)	text		Name			like,orderby		notNull
	location			geography	GeoLocation		area				geographyPoint

```

Database segment should be formatted in Rutile Schema Markdown style.
It is simple tab separated text file, looks like you do in very early phase of development for business application.

Detail of format will be found in [docs/schema_markdown.md](https://github.com/RayKitajima/rutile/blob/master/docs/schema_markdown.md).

And supported entity relation and database design pattern will be found in [docs/specification.md](https://github.com/RayKitajima/rutile/blob/master/docs/specification.md).

When you generate server, SQL files to initialize your database are also generated. 
Just run this if you need it.

```
psql -f ./Schema/Product.sql -d product
```


## Gist of server

```javascript
var DemoShop = require('DemoShop'); // generated package having all server side components

var container = DemoShop.getContainer('Product');
container.connect();

var tx = container.getTransaction();
tx.begin();

var ModelFactory = DemoShop.getModelFactory();
var ProductModel = ModelFactory.getModel('Product/Product');

var ids = ProductModel.search(query);
var product = ProductModel.instance(ids[0]);

product.price = 100;

product.save();

tx.commit();
```

In the beginning, getting container for your data, and starting transaction.
Then, getting a product instance, modifying its price, and persisting the product data.
At the end, committing transaction.


## Gist of client

```xml
<Alloy>
	<Require 
		src="Component/SearchForm/Product/Depository/SelectbyDepositoryDepositoryNameLike" 
		id="DepositoryNameLike"/>
	<Require 
		src="Component/SearchForm/Product/Depository/SelectbyDepositoryLocationArea" 
		id="LocationArea"/>
	<Require 
		src="Component/SearchForm/Product/Depository/Orderbys" 
		id="SearchForm_Orderbys"/>
	<Require 
		src="Framework/SearchFormSubmit" 
		id="SearchForm_Submit">
</Alloy>
```

In the *view*, making search form for *Depository* table in the *Product* database.
Components in Alloy *src* are auto generated one.

```javascript
var SearchFormGroup = require('SearchFormGroup'); // provided by Rutile framework

var group = SearchFormGroup.makeGroup({
	'name'    : "Product/Depository",
	'segment' : "Product",
	'entity'  : "Depository",
});
group.addElements([
	$.DepositoryNameLike,
	$.LocationArea
]);
group.setOrderbys($.SearchForm_Orderbys);
group.setSubmitAction({
	form    : $.SearchForm_Submit,
	handler : function(){
		var controller = Alloy.createController('KitchenSink/Product/Product/Depository/List');
		controller.setQuery(formGroup.getQuery());
		Alloy.Globals.navigationControllerStack[0].open(controller);
	}
});

exports.viewDidLoad = function(){
	formGroup.init();
};
```

In the controller, initializing form elements when the view did load. (The timing is provided by Rutile framework.)
Those search form is for *like search* of text field named as *depositoryName*, and for *area search* of geolocation field named as *location*.
When user click *$.SearchForm_Submit*, auto generated listing interface in the KitchenSink directory will be shown.

```javascript
var Dispatch = require('CentralDispatch');

Dispatch.sync({
	apptag:"Product/Depository.search",
	params:{
		"constraint" : {
			"Depository.depositoryName(like)" : { "values":["Ginza","Shibuya"], "logic":"OR" },
			"Depository.location(area)" : 'POLYGON((139.599362 35.676362, 139.746351 35.676362, 
			                               139.746351 35.624477, 139.599362 35.624477,
										   139.599362 35.676362))',
		},
		"logic" : "OR",
		"orderby" : { "depositoryName":"desc" }
	},
	callback : function(depositories){
		depositories.map( function(instance){console.log(instance);} );
	}
});

var batch_name = "DeletingSomeDepositories";
Dispatch.push(batch_name,{ apptag:"Product/Depository.remove", params:[1,2] });
Dispatch.push(batch_name,{ apptag:"Product/Depository.remove", params:[3,4] });
Dispatch.sync(batch_name);
```

Here is an another aspect of client coding.

*CentralDispatch* provides request encapsulation, that is defined in Rutile client framework.
The first block, searching depository by name, or being in the specific geographical area.
And getting results ordering by its name.
The second block, removing several depository entries.
Those requests are executed in the order you coded.


Enjoy automation!


## License of Rutile

Copyright (c) 2013 Rei Kitajima <rei.kitajima@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


## License of included softwares

### tipm-socket.io

tipm-socket.io is tipm packaged version of sokect.io by LearnBoost <dev@learnboost.com>.
tipm packaging is done by Christian Sullivan <cs@euforic.co>.

Copyright(c) 2011 LearnBoost <dev@learnboost.com>

MIT License

### TiWS

Native WebSocket support for Titanium done by jordi domenech.

Copyright 2012 jordi domenech jordi@iamyellow.net.

Apache License, Version 2.0

see also: https://github.com/iamyellow/tiws

#### TiWS includes, Socket.IO

Copyright(c) 2011 LearnBoost dev@learnboost.com

MIT License

#### TiWS includes, Now.js

Copyright (C) 2011 by Flotype Inc. team@nowjs.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

### TiIconicFont

TiIconicFont is Iconic font charcode wrapping library for Titanium Mobile.

Copyright (c) 2012 Kosuke Isobe <isobe@k0suke.be>

Apache License, Version 2.0

see also: https://github.com/k0sukey/TiIconicFont

### Font Awesome

"Font Awesome by Dave Gandy - http://fontawesome.io".

SIL OFL 1.1 Lisence

see also: http://fontawesome.io/license/

### Titanium CLI

tiappxmlfixer.js is ported version of https://github.com/appcelerator/titanium/blob/master/lib/titanium.js

Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.

Licensed under the terms of the Apache Public License

see also: https://github.com/appcelerator/titanium/blob/master/LICENSE

see also: https://github.com/appcelerator/titanium




