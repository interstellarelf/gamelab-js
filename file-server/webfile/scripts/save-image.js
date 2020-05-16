


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

    //  console.log('len::' + matches[2].length);

      response.data = new Buffer(matches[2], 'base64');

      return response;
    }
  };



module.exports = {

  ensureExists:function(path, mask, cb){

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

  },

  createReplaceImage:function(relpath, dataString){

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

            //  console.log('DEBUG - feed:message: Saved to disk image attached by user:', relpath);

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

    }
  },

  save_image:function(pathname, dataString, callback){

    var fs = require('fs');

    var path =  pathname.split('/');

    var name = path.pop();

    var $MOD =this;

    var  fullPath = require('path').dirname(require.main.filename) + '/file-server/image-cache/' + pathname;

    var folder = fullPath.substring(0, fullPath.lastIndexOf('/'));

//    console.log('checking folder:' + folder);

    this.ensureExists(folder.substring(0, folder.lastIndexOf('/')), '0744', function(){

  //    console.log('1st folder level --exists');

          $MOD.ensureExists(folder, '0744', function(){

          //  console.log('Creating rendered image');

            $MOD.createReplaceImage(fullPath, dataString);

          });

    });




  }
};
