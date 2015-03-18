/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

var extendGruntPlugin = require('extend-grunt-plugin');

module.exports = function (grunt) {

	grunt.registerMultiTask('appcJs', 'Linting and style checks for Appcelerator JavaScript', function () {

		// there is likely a better way to specify the path to the files
		var optionsJscs = {
			src: this.data,
			options: this.options({config: 'node_modules/grunt-appc-js/.jscsrc'})
		};

		var optionsJsHint = {
			src: this.data,
			options: this.options({jshintrc: 'node_modules/grunt-appc-js/.jshintrc'})
		};

		// have to require the specific task, as there is no "main" in package.json
		var jscs = require('grunt-jscs/tasks/jscs');
		var jshint = require('grunt-contrib-jshint/tasks/jshint');

		// Creates a target on grunt, that can be run later
		extendGruntPlugin(grunt, jscs, {
			'jscs.src' : optionsJscs
		});

		extendGruntPlugin(grunt, jshint, {
			'jshint.src' : optionsJsHint
		});

		// Runs the subtasks
		grunt.task.run('jshint:src', 'jscs:src');

	});

};
