/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {
  // Project configuration.

  var fs = require('fs');

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({

    jsdoc: {
      dist: {
        src: ['src/gamestack/README.md', 'src/__concat/gamestack.js'],
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: './docs',
          configure: './node_modules/gamestack-docstrap/jsdoc.conf.json',
          template: './node_modules/gamestack-docstrap'
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
          src: ['gamestack.js'],
          dest: 'dist/gamestack'
        }]
      },

            game_lib_TOOLS_COPY: {
              files: [{
                expand: true,
                cwd: 'src/__concat',
                src: ['gamestack.js'],
                dest: '../gamestack-tools/sprite-builder/Resources/Shared/libraries'
              }]
            },

      dfx_lib_combined: {
        files: [{
          expand: true,
          cwd: 'src/__concat',
          src: ['domfx.js'],
          dest: 'dist/domfx'
        }]

      },

      renderstack_lib_combined: {
        files: [{
          expand: true,
          cwd: 'src/__concat',
          src: ['renderstack.js'],
          dest: 'dist/renderstack'
        }]

      }
    },


    concat: {
      options: {
        separator: ';',
      },

      game_lib: {
        src: ['src/gamestack/gamestack.main.js',
          'src/gamestack/meta/*.js',
          'src/gamestack/core/*.js',
          'src/gamestack/objects/**/*.js',
          'src/gamestack/gamestack.modifiers.js',
          'src/gamestack/stand-alone/*.js',

          'src/gamestack/Canvas.js',
          'src/gamestack/class/**/*.js',
          'src/gamestack/third-party/*.js',
          'src/gamestack/outro.js'
        ],
        dest: 'src/__concat/gamestack.js'
      },

      dfx_lib: {
        src: ['src/domfx/domfx.js',
        'src/domfx/dfx.domhtml.js',
          'src/domfx/dfx.magicdom.js',
          'src/domfx/dom/*.js',
          'src/domfx/dom/async/timing.js',
          'src/domfx/geometry/easing.js'
        ],
        dest: 'src/__concat/domfx.js'
      },

      renderstack_lib: {
        src: ['src/renderstack/RenderStack.js'
        ],
        dest: 'src/__concat/renderstack.js'
      }

    }
  });

  grunt.registerTask('build', ['concat', 'babel']);

  grunt.registerTask('default', ['concat', 'babel']);

  grunt.registerTask('doc', ['jsdoc']);
    grunt.registerTask('docs', ['jsdoc']);

  grunt.registerTask('hint', ['jshint']);

  grunt.registerTask('jshint', ['jshint']);

  grunt.registerTask('all', ['concat', 'babel']);

};
