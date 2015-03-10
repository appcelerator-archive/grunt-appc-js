# grunt-appc-js

> Linting and style checks for Appcelerator JavaScript
[![Build Status](https://travis-ci.org/ingo/grunt-appc-js.svg?branch=master)](https://travis-ci.org/ingo/grunt-appc-js)
[![Dependency Status](https://david-dm.org/ingo/grunt-appc-js.svg)](https://david-dm.org/ingo/grunt-appc-js)
[![devDependency Status](https://david-dm.org/ingo/grunt-appc-js/dev-status.svg)](https://david-dm.org/ingo/grunt-appc-js#info=devDependencies)
[![NPM version](https://badge.fury.io/js/grunt-appc-js.svg)](http://badge.fury.io/js/grunt-appc-js)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appc-js --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appc-js');
```

## The "appcJs" task

### Overview
In your project's Gruntfile, add a section named `appcJs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  appcJs: {
    src: ['paths', 'to', 'js', 'files'],
  }
});
```

### Options

## Contributing
Add unit tests for any new or changed functionality. Run npm test to ensure your added code matches existing style standards.
