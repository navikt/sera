'use strict'
const path = require('path')
const http = require('http')
const fs = require('fs')
const express = require('express')
const app = require('./api')
const config = require('./api/config/config')
const webpackConfig = require('./webpack.config.dev.js')
const webpack = require('webpack')
const logger = require('./api/logger')
const prometheus = require('prom-client')



const serverOptions = {
    quiet: false,
    noInfo: false,  
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    stats: {colors: true},
    historyApiFallback: true
};

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static(__dirname + "/dist"));

app.get("/isready", (req, res) => {
    res.sendStatus(200)
});

app.get("/isalive", (req, res) => {
    res.sendStatus(200)
});

app.get('/metrics', (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
});

app.listen(config.port, function () {
    logger.info('==> Up and running @ %s', config.port)
});

module.exports = app;