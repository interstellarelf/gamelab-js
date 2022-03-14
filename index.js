var serverModule = require('./file-server/index.js');
console.log('file-server --running');

var expressApp = require('express')();
var blogModule = require('./www/');

blogModule.start(expressApp);
expressApp.listen(3000);

var serveStatic = require('./scripts/serve-static.js')();
