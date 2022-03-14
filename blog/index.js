var BlogLinks = [],
  MainLinks = [];

function Blog(name, path) {
  return {
    name,
    path
  };
};


function Link(name, path) {
  return {
    name,
    path
  };
};

function jstr(object) {
  return JSON.stringify(object, null, 2);
}

var fs = require('fs'),
  glob = require('glob');


var gamelabUrl = 'www.gamelab.com/';

//Add a handful of other links to navigate from the blog-page:
MainLinks.push(new Link('javascript downloads', gamelabUrl + '/docs/index.html'));
MainLinks.push(new Link('github project', gamelabUrl + '/docs/index.html'));
MainLinks.push(new Link('our graphics store', gamelabUrl + '/docs/index.html'));
MainLinks.push(new Link('about Morning Star', gamelabUrl + '/docs/index.html'));
MainLinks.push(new Link('gamelab docs', gamelabUrl + '/docs/index.html'));

glob(__dirname + '/index.html', {}, function(err, files) {

  if (err) {
    return console.error(err);
  }

  for (var x = 0; x < files.length; x++) {
    var name = 'Blog-Introduction',
      file = files[x];

    var watchPathString = '/www/';

    //name is file-name up to first (.)

    var relpath = file.split(watchPathString).pop();

    //relpath has entire uri

    BlogLinks.push(new Blog(name, relpath));
  }

  getChildBlogs(function() {

    console.log('--got child blogs');

  });

});

function getChildBlogs(callback) {

  glob(__dirname + '/blog/*', {}, function(err, files) {

    if (err) {
      return console.error(err);
    }

    for (var x = 0; x < files.length; x++) {

      console.log('processing:' + files[x]);

      var file = files[x];

      if (fs.lstatSync(file).isDirectory()) {

        console.log('directory:' + files[x]);

        while (file.indexOf('\\') >= 0)
          file = file.replace('\\', '/');

        var watchPathString = '/www/';

        var name = file.split('/').pop().split('.')[0];
        //name is file-name up to first (.)

        var relpath = file.split(watchPathString).pop();

        if (fs.existsSync(file + '/index.html')) {

          //expect the blog to be index.html
          BlogLinks.push(new Blog(name, relpath + '/index.html'));
        }
      }
    }

    if (callback) {
      callback();
    }
  });

};


//module.exports::
//attach api-call / get-request to expressApp
module.exports = {

  start: function(expressApp) {

    var express = require('express');

    expressApp.use(express.static(__dirname))

    if (!expressApp) {
      return console.error('no expressApp (1st argument)');
    }
    expressApp.get('/blogs/all', function(req, res) {
      res.send(jstr({
        error: false,
        blogs: BlogLinks,
        main: MainLinks
      }));
    });
  }

};