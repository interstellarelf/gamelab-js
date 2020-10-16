/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {
  // Project configuration.

  var fs = require('fs');

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  var fsExtra = require('node-fs-extra'),
    glob = require('glob');

  var folders = {
    'gamelab-examples': 'gamelab-examples',
    'gamelab-tools': 'gamelab-tools',
    'gamelab-builders': 'gamelab-builders',
    'gamelab-games': 'gamelab-games'
  };

  grunt.initConfig({

    jsdoc: {
      dist: {
        src: ['src/README.md', 'src/__concat/gamelab.js'],
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: './docs',
          configure: './node_modules/docula-jsdoc/jsdoc.conf.json',
          template: './node_modules/docula-jsdoc'
        }
      }
    },

    jshint: {
      all: ['src/**/*.js'],
      options: {
        esversion: 6
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['babel-preset-es2015']
      },

      game_lib_combined: {
        files: [{
          expand: true,
          cwd: 'src/__concat',
          src: ['gamelab.js'],
          dest: 'dist/gamelab'
        }]
      },

      //Developer's machine only:: build into specified folder on dev-machine
      game_lib_TOOLS_COPY: {
        files: [{
          expand: true,
          cwd: 'src/__concat',
          src: ['gamelab.js'],
          dest: '../msi-gamelab/Resources/Shared/libraries'
        }]
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      game_lib: {
        src: ['src/gamelab/jsHelper/*.js',
          'src/gamelab/gamelab.main.js',
          'src/gamelab/gamelab.config.js',
          'src/gamelab/meta/*.js',
          'src/gamelab/core/*.js',
          'src/gamelab/objects/**/*.js',
          'src/gamelab/gamelab.modifiers.js',
          'src/gamelab/filters/**/*.js',
          'src/gamelab/Canvas.js',
          'src/gamelab/libs/*.js',
          'src/gamelab/outro.js'
        ],
        dest: 'src/__concat/gamelab.js'
      }
    }
  });


  //Register Custom Task:: Copy the game-lib into gamelab-tools
  grunt.registerTask('copy-to-gamelab-tools', function() {
    var done = this.async();
    var source = __dirname + '/dist/gamelab/gamelab.js',
      target = __dirname + '/../gamelab-tools/gamelab-tools/sprite-builder/Resources/Shared/libraries/gamelab.js';

    fsExtra.copy(source, target, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("success at copying::" + target);
      }
      done();
    }); //copies directory, even if it has subdirectories or files
  });


  //Register Custom Task:: Copy all examples, tools, games, builders into the docs folder
  grunt.registerTask('doc-copy-files', function() {

    var done = this.async();

    for (var x in folders) {
      var last = folders[Object.keys(folders).pop()];
      var folder = folders[x];
      var source = __dirname + '/' + folder,
        target = __dirname + '/docs/' + x + '/' + 'html';

      console.log('Copying::' + source + '--to--' + target);
      var tasks = {
        first: 0,
        last: 1
      };
      var jobIndex = 0;
      fsExtra.copy(source, target, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success at copying::" + folder);
        }

        if (folder == last) {
          console.log('Done --first copy');
          jobIndex += 1;
          if (jobIndex >= 3) {
            done();
          }
        }
      }); //copies directory, even if it has subdirectories or files

      var res_source = __dirname + '/res',
        res_target = __dirname + '/docs/' + x + '/' + 'res';
      fsExtra.copy(res_source, res_target, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success at copying::" + folder);
        }

        if (folder == last) {
          console.log('Done --2nd copy');
          jobIndex += 1;
          if (jobIndex >= 3) {
            done();
          }
        }
      }); //copies directory, even if it has subdirectories or files

      var dist_source = __dirname + '/dist',
        dist_target = __dirname + '/docs/' + x + '/' + 'dist';
      fsExtra.copy(dist_source, dist_target, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("success at copying::" + folder);
        }

        if (folder == last) {
          console.log('Done --3rd/ last copy');
          jobIndex += 1;
          if (jobIndex >= 3) {
            done();
          }
        }
      }); //copies directory, even if it has subdirectories or files
    }


  });


  var folderFiles = {
    'gamelab-examples': [],
    'gamelab-tools': [],
    'gamelab-games': [],
    'gamelab-builders': []
  };

  function CreateExample(path) {
    return {
      path: path
    }
  };


  var examples = [];

  //Register Custom Task:: Record and list all examples on a single json-file
  grunt.registerTask('doc-list-files', function() {

    var done = this.async();

    var last = folders[Object.keys(folders).pop()];
    var examplesFolder = 'gamelab-examples';
    var source = __dirname + '/' + examplesFolder,
      target = __dirname + '/docs/' + examplesFolder + '/' + 'html';

    glob(__dirname + '/docs/gamelab-examples/html' + '/*.html', {}, function(err, files) {

      console.log(JSON.stringify(files));
      files.forEach(function(f) {
        if (f.endsWith('.dev.html')) {
          console.log('--Excluding file with .dev.html extension::' + f);
          return;
        }
        console.log('FullPath --' + f);
        console.log('__dirname --' + __dirname);
        while (f.indexOf('/') >= 0) {
          f = f.replace('/', '\\');
        }
        var relpath = f.replace(__dirname + '\\docs\\', './');
        while (relpath.indexOf('\\') >= 0) {
          console.log('--path-fix');
          relpath = relpath.replace('\\', '/');
        }
        console.log('got example::  --' + relpath);
        examples.push(CreateExample(relpath));
      });

      console.log('All done copying');
      fs.writeFile(__dirname + '/docs/' + examplesFolder + '/' + examplesFolder + '.json', JSON.stringify(examples, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
        console.log('ALL DONE!!!');
        done();
      });
    });
  });


  grunt.registerTask('build', ['concat', 'babel', 'copy-to-gamelab-tools']);
  grunt.registerTask('default', ['concat', 'babel', 'copy-to-gamelab-tools']);
  grunt.registerTask('doc', ['doc-copy-files', 'doc-list-files', 'jsdoc']);
  grunt.registerTask('docs', ['doc-copy-files', 'doc-list-files', 'jsdoc']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('jshint', ['jshint']);
  grunt.registerTask('all', ['concat', 'babel']);

};