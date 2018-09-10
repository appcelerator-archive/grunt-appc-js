/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015-2017 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var source = [ 'Gruntfile.js', 'tasks/*.js', '<%= mocha_istanbul.coverage.src %>' ];

	// Project configuration.
	grunt.initConfig({
		eslint: {
			target: source
		},
		retire: {
			js: source,
			node: [ '.' ],
			options: {
				packageOnly: false,
				outputFile: 'retirejs.output.json'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: [ 'tmp', 'coverage' ]
		},

		// Unit tests.
		mocha_istanbul: {
			coverage: {
				src: [ 'test/*_test.js' ],
				options: {
					timeout: 3500,
					reporter: 'mocha-jenkins-reporter',
					reportFormats: [ 'lcov', 'cobertura' ],
					ignoreLeaks: false
				}
			}
		},

		bump: {
			options: {
				files: [ 'package.json' ],
				commitFiles: [  'package.json' ],
				pushTo: 'origin'
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', [ 'clean', 'mocha_istanbul' ]);

	grunt.registerTask('lint', [ 'eslint' ]);

	// By default, lint and run all tests.
	grunt.registerTask('default', [ 'lint', 'retire', 'test' ]);

};
