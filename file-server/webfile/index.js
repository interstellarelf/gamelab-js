module.exports = function(options) {

  var fs = require('fs');

  function jstr(object) {
    return JSON.stringify(object, null, 2);
  };

  var cachepath = options.path || options.cachepath || './cache/';

  var projectpath = __dirname + '/files/';

  if (!(options && options.express)) {
    return console.error('Must have running instance of express in options --1st');
  }

  String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  };

  function isAlpha(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };


  var FileSystem = {

    folderName: function(name) {

      //replace spaces with dash ::
      name = name.replace(' ', '-');

      var alteredName = '';

      //replace all non-alphanumeric+non-dash with empty string
      for (var x = 0; x < name.length; x++) {

        var char = name[x] + '';

        if (isAlpha(char) || char == '-') {

        } else {
          char = char.replaceAt(0, '');
        }

        alteredName += char;
      }

      console.log('FolderName::' + alteredName);

      return alteredName;
    }


  };


  var WebFileConverter = {
    decodeBase64Image: function(dataString) {
      // Decoding base-64 image
      // Source: http://stackoverflow.com/questions/20267939/nodejs-write-base64-image-file

      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      response.type = matches[1];

      matches[2] = matches[2].replace(/^data:image\/png;base64,/, "");

      console.log('len::' + matches[2].length);

      response.data = new Buffer(matches[2], 'base64');

      return response;
    }
  };


  options.express.get('/webfile/api/file-system', function(req, res) {

    console.log('GET:: webfile/api/file-system');

    var basepath = process.cwd();

    res.end(jstr({
      error:false,
      sucess:true,
      message: 'webfile-api, operational',
      system:{
        basepath:basepath,
        typeRestrictions:[],
        fileTree:{}
      }
    }, null, 2));

  });


  function str_type_len(string, len) {
    return string && typeof string == 'string' &&
      string.length >= len;
  };

  function hasExt(string, ext) {
    return string.toLowerCase().endsWith(ext.toLowerCase())
  }


  function ensureExists(path, mask, cb) {

        var fs = require('fs');

        if (typeof mask == 'function') { // allow the `mask` parameter to be optional
            cb = mask;
            mask = 0777;
        }
        fs.mkdir(path, mask, function(err) {
            if (err) {
                if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
                else cb(err); // something else went wrong
            } else cb(null); // successfully created folder
        });

  };


  options.express.post('/webfile/api/text/js', function(req, res) {

    var FN = FileSystem.folderName;

    var data = req.body.data;

    res.send('not working');

    var content = data.content + "",
      filename = data.filename + "",
      type = data.type + "",
      foldername = data.foldername || '';


      console.log('--server, Recieved POST');

    var fullpath = projectpath + '/' + FN(foldername)  + '/' + FN(filename);

    console.log('fullpath:' + fullpath);

    var folders = fullpath.split('/');
    folders.pop(); //remove the last part w/ filename

    ensureExists(folders.join('/'), function() {

      console.log('--folder existed or was created');

      require('fs').writeFile(fullpath, content,
        function(err) {

          if (err) {
            return console.error(err);
          }

          console.log('DEBUG - feed:message: Saved to disk image attached by user:', fullpath);
          res.end(JSON.stringify({
            fullpath: fullpath,
            content: 'saved'
          }));
        });

    });

    console.log('user posted project::');
    console.log(jstr({
      filename: filename,
      type: type,
      contentLength: content.length
    }));

    res.end(jstr({
      message: "route-test complete"
    }));

  });


  options.express.post('/webfile/api/image/png', function(req, res) {

    var data = req.body.data;

    var dataString = data.content + "",
      filename = data.filename + "",

      type = data.type + "";

    var relpath = cachepath + filename;


    console.log('trying to save to:' + relpath);


    if (!(str_type_len(dataString, 8) && str_type_len(filename, 5) && hasExt(filename, '.png'))) {
      res.end(jstr({
        error: "needs content and filename"
      }));
      return;
    }


    // Save base64 image to disk
    try {
      // Regular expression for image type:
      // This regular image extracts the "png" from "image/png"
      var imageTypeRegularExpression = /\/(.*?)$/;

      // Generate random string
      var crypto = require('crypto');
      var seed = crypto.randomBytes(20);
      var uniqueSHA1String = crypto
        .createHash('sha1')
        .update(seed)
        .digest('hex');

      var base64Data = dataString;

      var imageBuffer = WebFileConverter.decodeBase64Image(base64Data);

      if (imageBuffer) {
        var userUploadedFeedMessagesLocation = '../img/upload/feed/';

        var uniqueRandomImageName = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        var imageTypeDetected = imageBuffer
          .type
          .match(imageTypeRegularExpression);

        var userUploadedImagePath = userUploadedFeedMessagesLocation +
          uniqueRandomImageName +
          '.' +
          imageTypeDetected[1];

        // Save decoded binary image to disk
        try {
          require('fs').writeFile(relpath, imageBuffer.data,
            function(err) {

              if (err) {
                return console.error(err);
              }

              console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);
              res.end(JSON.stringify({
                relpath: relpath,
                content: 'saved'
              }));
            });
        } catch (error) {
          console.log('ERROR:', error);
          res.end(jstr({
            error: "error"
          }));
        }
      }
    } catch (error) {
      console.log('ERROR:', error);
      res.end(jstr({
        error: "error"
      }));
    }


  });

  options.express.post('/webfile/api/image/jpg', function(req, res) {

    console.log(jstr(req.body));

    var dataString = req.body.content + "",
      filename = req.body.filename + "",

      type = req.body.type + "";

    var relpath = cachepath + filename;


    if (!(str_type_len(dataString, 8) && str_type_len(filename, 5) && hasExt(filename, '.jpg'))) {
      res.end(jstr({
        error: "needs content and filename"
      }));
      return;
    }


    // Save base64 image to disk
    try {
      // Regular expression for image type:
      // This regular image extracts the "jpeg" from "image/jpeg"
      var imageTypeRegularExpression = /\/(.*?)$/;

      // Generate random string
      var crypto = require('crypto');
      var seed = crypto.randomBytes(20);
      var uniqueSHA1String = crypto
        .createHash('sha1')
        .update(seed)
        .digest('hex');

      var base64Data = dataString;

      var imageBuffer = WebFileConverter.decodeBase64Image(base64Data);

      if (imageBuffer) {
        var userUploadedFeedMessagesLocation = '../img/upload/feed/';

        var uniqueRandomImageName = 'image-' + uniqueSHA1String;
        // This variable is actually an array which has 5 values,
        // The [1] value is the real image extension
        var imageTypeDetected = imageBuffer
          .type
          .match(imageTypeRegularExpression);

        var userUploadedImagePath = userUploadedFeedMessagesLocation +
          uniqueRandomImageName +
          '.' +
          imageTypeDetected[1];

        // Save decoded binary image to disk
        try {
          require('fs').writeFile(relpath, imageBuffer.data,
            function(err) {

              if (err) {
                return console.error(err);
              }

              console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);
              res.end(JSON.stringify({
                relpath: relpath,
                content: 'saved'
              }));
            });
        } catch (error) {
          console.log('ERROR:', error);
          res.end(jstr({
            error: "error"
          }));
        }
      }
    } catch (error) {
      console.log('ERROR:', error);
      res.end(jstr({
        error: "error"
      }));
    }


  });








  options.express.post('/webfile/api/sound/mp3', function(req, res) {

    var dataString = req.body.content,
      filename = req.body.filename,

      type = req.body.type;

    var relpath = cachepath + filename;

    if (!(filename && filename.toLowerCase().endsWith('.mp3'))) {
      res.end({
        error: "parameter filename must be present in request and must end with '.mp3'"
      });
    }

    var response = {};
    response.data = new Buffer(dataString, 'base64');
    response.type = "audo/mp3";

    // Save decoded binary image to disk
    try {
      require('fs').writeFile(relpath, response.data,
        function() {
          console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);

          res.end(JSON.stringify({
            relpath: relpath,
            content: content
          }));

        });
    } catch (error) {
      console.log('ERROR:', error);

      res.end('save-file: error:' + error);
    }

  });

  options.express.post('/webfile/api/project', function(req, res) {

    console.log(jstr(req.body));

    var project = req.body.project;


  });



              var RenderSaveModule = require('./scripts/save-image.js');


            options.express.post('/save-render', function(req, res) {

              //    console.log('post /render-save');

                  //get body.data

                  var data = req.body.data;




                  var name = data.name, time = data.time, imgdata = data.imageData;

                  console.log('--saving image @' + name + '_' + time + '.png');

                  RenderSaveModule.save_image(name + '_' + time + '.png', imgdata, function(){

                //    console.log('1 image saved as:' + name + '-' + time + '.png');

                  });


                  res.send(JSON.stringify({status:'--recieved request'}));
                });




  options.express.get('/cache/:filename', function(req, res) {

    console.log('GOT CACHE REQ');

    var filename = req.params.filename;

    res.sendFile(cachepath + filename);

  });


};
