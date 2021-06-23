'use strict'
//Librerías.
const express = require('express');
const bodyParser = require('body-parser');
const app= express();
app.use(express.json());

const helmet = require("helmet");
require('./models/index.js');

//Rutas
const api = require("./routes");
var cors = require('cors');

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ 
    extended: false
}));
app.use(express.json()); // permite peticiones con mensaje JSON.

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/api", api);

module.exports = app