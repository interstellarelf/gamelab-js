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

  //include in docs all examples from gamelab.demo
  var exampleFolders = [
    'gamelab.demo'
  ];

  grunt.initConfig({

    jsdoc: {
      dist: {
        src: ['src/gamelab/README.md', 'src/__concat/gamelab.js'],
        jsdoc: './node_modules/.bin/jsdoc',
        options: {
          destination: './docs',
          configure: './node_modules/gamelab-docstrap/jsdoc.conf.json',
          template: './node_modules/gamelab-docstrap'
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
          dest: '../gamelab-tools/gamelab-tools/sprite-builder/Resources/Shared/libraries'
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
