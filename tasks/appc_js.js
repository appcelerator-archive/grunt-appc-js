/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015-2017 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

var extendGruntPlugin = require('extend-grunt-plugin');
var path = require('path');
var fs = require('fs');
var ourEslintRc = path.join(__dirname, '..', '.eslintrc');

module.exports = function (grunt) {

	grunt.registerMultiTask('appcJs', 'Linting and style checks for Appcelerator JavaScript', function (lintOnly, fix) {
		var that = this;
		var source = this.data;
		if (this.data.src) {
			source = this.data.src;
		}

		initializeEslintPlugin();
		if (lintOnly) {
			grunt.task.run('eslint:src');
		} else {
			initializeContinuePlugin();
			initializeRetirePlugin();
			grunt.task.run('eslint:src', 'continue:on', 'retire', 'continue:off');
		}

		/**
		 * Initializes the eslint plugin
		 *
		 * @return {void}
		 */
		function initializeEslintPlugin() {
			var theirEslintRc = '.eslintrc',
				optionsEslint = {
					src: source,
					options: {}
				},
				eslint = require('grunt-eslint/tasks/eslint'),
				config = theirEslintRc; // there is likely a better way to specify the path to the files
			if (!fs.existsSync(theirEslintRc)) {
				// Try to use a .eslintrc in root of target project, if that doesn't exist, use the one in this project!
				config = ourEslintRc;
			}
			optionsEslint.options = that.options({
				configFile: config,
				fix
			});

			extendGruntPlugin(grunt, eslint, {
				'eslint.src' : optionsEslint
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
				node: [ '.' ],
				options: that.options({
					packageOnly: false,
					outputFile: 'retirejs.output.json'
				})
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
