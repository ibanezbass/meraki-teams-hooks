const express = require('express');
const port = process.env.PORT || 8080;
const expressStaticGzip = require('express-static-gzip');
const compression = require('compression');
const path = require('path');


//api setup
const routes = require('./api/routes');


//app setup
var app = express();
app.use(compression());
app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({limit: '20mb', extended: false}));

app.use('/api', routes);

app.listen(port);

