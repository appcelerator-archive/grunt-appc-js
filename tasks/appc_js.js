/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

var extendGruntPlugin = require('extend-grunt-plugin');
var packpath = require('packpath');
var path = require('path');
var _ = require('lodash');

module.exports = function (grunt) {

	grunt.registerMultiTask('appcJs', 'Linting and style checks for Appcelerator JavaScript', function () {

		var that = this;
		var source = this.data;
		if (this.data.src) {
			source = this.data.src;
		}

		initializeJscsPlugin();
		initializeJshintPlugin();
		initializeContinuePlugin();
		initializeRetirePlugin();

		grunt.task.run('jshint:src', 'jscs:src', 'continue:on', 'retire', 'continue:off');

		/**
		 * Initializes the jscs plugin
		 *
		 * @return {void}
		 */
		function initializeJscsPlugin() {
			// there is likely a better way to specify the path to the files
			var optionsJscs = {
				src: source,
				options: _.omit(that.options({
					config: path.join(__dirname, '..', '.jscsrc'),
					reporter: require('jscs-stylish').path,
				}), 'globals')
			};

			var jscs = require('grunt-jscs/tasks/jscs');
			extendGruntPlugin(grunt, jscs, {
				'jscs.src' : optionsJscs
			});
		}

		/**
		 * Initializes the jshint plugin
		 *
		 * @return {void}
		 */
		function initializeJshintPlugin() {
			var jsHintConfig = {
				browser: true,
				curly: true,
				eqeqeq: true,
				eqnull: true,
				expr: true,
				immed: true,
				indent: 4,
				latedef: false,
				newcap: true,
				noarg: true,
				nonew: true,
				undef: true,
				unused: false,
				trailing: true,
				loopfunc: true,
				proto: true,
				node: true,
				'-W104': true,
				'-W068': true,
				globals: {
					after      : false,
					afterEach  : false,
					before     : false,
					beforeEach : false,
					describe   : false,
					it         : false,
					Titanium   : false,
					Ti         : false
				}
			};

			var optionsJsHint = {
				src: source,
				options: _.omit(_.merge(that.options(),
					{reporter: require('jshint-stylish')},
					jsHintConfig), 'fix')
			};

			var jshint = require('grunt-contrib-jshint/tasks/jshint');
			extendGruntPlugin(grunt, jshint, {
				'jshint.src' : optionsJsHint
			});
		}

		/**
		 * Initializes the retire.js plugin
		 *
		 * The way the retire plugin works is not compatible with extendGruntPlugin
		 * so we simply add the config manually.
		 *
		 * @return {void}
		 */
		function initializeRetirePlugin() {
			var optionsRetire = {
				js: source,
				node: ['.'],
				options: {
					packageOnly: false
				}
			};

			var retire = require('grunt-retire/tasks/retire');
			retire(grunt);
			grunt.config.set('retire', optionsRetire);
		}

		/**
		 * Initializes the continue plugin
		 *
		 * This plugin allows us to temporarily set the --force flag so retire.js
		 * wont't fail our build. Should be removed after a certain transition
		 * period.
		 *
		 * @return {void}
		 */
		function initializeContinuePlugin() {
			var gruntContinue = require('grunt-continue/tasks/continue');
			gruntContinue(grunt);
		}
	});

};
