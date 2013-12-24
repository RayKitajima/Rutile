
/**
 * Main entry point for the Titanium CLI. Responsible for loading the CLI
 * configuration, initializing the i18n system, wiring up analytics, defining
 * global options and flags, and running the main CLI logic.
 *
 * @module titanium
 *
 * @copyright
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * @requires colors
 * @requires node-appc
 * @requires semver
 */

/**
 * Quick and dirty tiapp.xml editor for automatically generated app.
 * Original code can be found in https://github.com/appcelerator/titanium/blob/master/lib/titanium.js
 * 
 * usage:
 *     $ <APP_NAME>Tools/tiappxmlfixer.js ./<APP_NAME>Client ./<APP_NAME>App
 *
 * this editor requires titanium cli being installed in the following location:
 */

var fs = require('fs');
var path = require('path');

var ti_loc = require.resolve('titanium');
//console.log('ti_loc:'+ti_loc);
var titanium_cli_path = path.resolve(path.dirname(ti_loc),'..');
//console.log('titanium_cli_path:'+titanium_cli_path);

var tiappxml_file = process.argv[2];

var pkgJson = require(path.resolve(titanium_cli_path,'package.json'));

// read the locale and bootstrap the CLI as necessary
(function() {
	var configFilePath = path.join(process.env['HOME'], '.titanium', 'config.json');

	function detectLocale(callback) {
		var exec = require('child_process').exec;
		exec('locale', function (err, stdout, stderr) {
			callback(stdout.split('\n').shift().replace(/(LANG=["']?([^\."']+).*)/m, '$2'));
		});
	}

	if (fs.existsSync(configFilePath)) {
		try {
			var config = JSON.parse(fs.readFileSync(configFilePath));
			if (config && config.user && config.user.locale) {
				run(config.user.locale);
				return;
			}
		} catch(e) {}
	}
	detectLocale(run);
}());

function getArg(name) {
	var p = process.argv.indexOf(name);
	if (p != -1 && p + 1 < process.argv.length) {
		return process.argv[p + 1];
	}
	return null;
}

function run(locale) {
	// try to load the config file
	var appc = require('node-appc'),
		config = require(path.resolve(titanium_cli_path,'lib','config'));

	process.env.locale = locale;
	config.setDefault('user.locale', locale);

	try {
		config.load(getArg('--config-file'));
	} catch (ex) {
		console.error(('FATAL ERROR: ' + ex.toString().trim()).red + '\n');
		process.exit(1);
	}

	// if there's a --config, mix it into our config
	try {
		var json = eval('(' + getArg('--config') + ')');
		if (json && typeof json == 'object') {
			appc.util.mixObj(config, json);
		}
	} catch (ex) {
		console.log(ex);
	}

	var __ = appc.i18n(__dirname).__,
		env = appc.environ,
		afs = appc.fs,
		logger = require(path.resolve(titanium_cli_path,'lib','logger')),
		pkginfo = appc.pkginfo.package(module, 'version', 'about'),
		defaultInstallLocation = config.get('sdk.defaultInstallLocation'),
		sdkPaths = config.get('paths.sdks');

	// find all Titanium sdks
	env.detectTitaniumSDKs(sdkPaths);

	// fix tiappxml for your generated tiapp
	
	var version = Object.keys(env.sdks).sort().pop();
	var sdk_path = env.sdks[version].path;
	console.log("sdk path:"+sdk_path);

	var ti_sdk = require(path.resolve(sdk_path,'node_modules','titanium-sdk'));
	var tiapp = new ti_sdk.tiappxml(tiappxml_file);
	
	var installed_modules = {};
	tiapp.modules.map( function(m){ installed_modules[m.id]++; } );
	if( !installed_modules["net.iamyellow.tiws"] ){ tiapp.modules.push({"id":"net.iamyellow.tiws","version":"0.3"}); }
	if( !installed_modules["tipm-socket.io"]     ){ tiapp.modules.push({"id":"tipm-socket.io","version":"0.9.10"});  }
	if( !installed_modules["ti.map"]             ){ tiapp.modules.push({"id":"ti.map","version":"2.0.0"});           }
	
	if( !tiapp['ios'] ){
		tiapp['ios'] = {"plist":{"UIStatusBarStyle":"UIStatusBarStyleLightContent","UIViewControllerBasedStatusBarAppearance":false}};
	}
	
	fs.writeFileSync(tiappxml_file,tiapp.toString('xml'));
}

