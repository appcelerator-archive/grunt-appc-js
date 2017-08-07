var grunt = require('grunt'),
	should = require('should'); // eslint-disable-line no-unused-vars

describe('grunt-appc-js', function () {

	it('should handle default options', function () {
		var actual = grunt.file.read('test/expected/default_options');
		var expected = grunt.file.read('test/expected/default_options');
		actual.should.equal(expected, 'should describe what the default behavior is.');
	});

	it('should handle custom options', function () {
		var actual = grunt.file.read('test/expected/custom_options');
		var expected = grunt.file.read('test/expected/custom_options');
		actual.should.equal(expected, 'should describe what the custom option(s) behavior is.');
	});
});
