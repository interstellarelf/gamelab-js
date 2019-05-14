/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
module.exports = function(grunt) {
  // Project configuration.

  var fs = require('fs');

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks


  var fsExtra = require('node-fs-extra'), glob = require('glob');

  var exampleFolders = [

    'gamestack.sprite',

    'gamestack.multisprite',

    'gamestack.display',

    'gamestack.effect'

  ];

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
          'src/gamestack/filters/**/*.js',
          'src/gamestack/Canvas.js',
          'src/gamestack/class/**/*.js',
          'src/gamestack/libs/*.js',
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
        src: ['src/renderstack/RenderStack.js'],
        dest: 'src/__concat/renderstack.js'
      }

    }
  });


  //Register Custom Task:: Copy all examples into the docs folder
  grunt.registerTask('doc-copy-examples', function() {

       var done = this.async();

       var last = exampleFolders[exampleFolders.length -1];

       exampleFolders.forEach(function(folder) {

         var source = __dirname + '/' + folder, target = __dirname +  '/docs/examples/' + folder;

         console.log('Copying::' + source + '--to--' + target);

         var tasks = {
           first:0,
           last:1
         };

         var jobIndex = 0;

         fsExtra.copy(source, target, function (err) {
           if (err) {
             console.error(err);
           } else {
             console.log("success at copying::" + folder);
           }

           if(folder == last)
           {
             console.log('Done --first copy');
             jobIndex += 1;
             if(jobIndex >= 3)
             {
               done();
             }
           }

         }); //copies directory, even if it has subdirectories or files


        var res_source = __dirname + '/res', res_target =  __dirname +  '/docs/examples/res';

        fsExtra.copy(res_source, res_target, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("success at copying::" + folder);
          }

          if(folder == last)
          {
            console.log('Done --2nd copy');
            jobIndex += 1;
            if(jobIndex >= 3)
            {
              done();
            }
          }

        }); //copies directory, even if it has subdirectories or files


        var dist_source = __dirname + '/dist', dist_target =  __dirname +  '/docs/examples/dist';

        fsExtra.copy(dist_source, dist_target, function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log("success at copying::" + folder);
          }

          if(folder == last)
          {
            console.log('Done --3rd/ last copy');
            jobIndex += 1;
            if(jobIndex >= 3)
            {
              done();
            }
          }

        }); //copies directory, even if it has subdirectories or files



       });
   });


   var Examples = [];

   function CreateExample(path){
     return {path:path}
   };

   //Register Custom Task:: Record and list all examples on a single json-file
   grunt.registerTask('doc-list-examples', function() {

        var done = this.async();

        var last = exampleFolders[exampleFolders.length -1];

        exampleFolders.forEach(function(folder) {

          glob(__dirname + '/docs/examples/' + folder + '/**/*.html', { }, function(err, files){

            console.log(JSON.stringify(files));

            files.forEach(function(f){

              if(f.endsWith('.dev.html'))
              {
                console.log('--Excluding file with .dev.html extension::' + f);
                return;
              }

              console.log('FullPath --' + f);
                console.log('__dirname --' + __dirname);

                while(f.indexOf('/') >= 0)
                {
                    f = f.replace('/', '\\');
                }

                var relpath = f.replace(__dirname + '\\docs\\', './');

                while(relpath.indexOf('\\') >= 0)
                {
                  console.log('--path-fix');
                  relpath = relpath.replace('\\', '/');

                }

              console.log('got example::  --' + relpath);

              Examples.push(CreateExample(relpath));

            });

            if(folder == last)
            {
              console.log('All done copying');

              fs.writeFile(__dirname + '/docs/examples/examples.json', JSON.stringify(Examples, null, 2), (err) => {
                  if (err) throw err;
                  console.log('Data written to file');
                  done();
              });

            }

          });

        });
    });



grunt.registerTask('build', ['concat', 'babel']);

grunt.registerTask('default', ['concat', 'babel']);

grunt.registerTask('doc', ['doc-copy-examples', 'doc-list-examples', 'jsdoc']);
grunt.registerTask('docs', ['doc-copy-examples', 'doc-list-examples', 'jsdoc']);

grunt.registerTask('hint', ['jshint']);

grunt.registerTask('jshint', ['jshint']);

grunt.registerTask('all', ['concat', 'babel']);

};
