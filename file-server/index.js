
    var PORT = 4200;

    const express = require('express');

    console.log("Initializing...");

    var cors = require('cors')

    const app = express();

    app.use(cors());

    var bodyParser = require('body-parser')

    app.use(bodyParser.json({
      parameterLimit: 100000,
      limit: '50mb',
      extended: true
    }));

    app.use(express.static('./'))

    app.port = PORT;

    require('./webfile/')({express:app});

    app.listen(PORT);
