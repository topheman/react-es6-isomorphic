'use strict';

require('babel/register');//to be able to mix and match ES5 CommonJS / ES6 modules / jsx
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helpers = require('./common/helpers');

var routes = require('./routes');

var app = express();
var expressLayouts = require('express-ejs-layouts');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set the layout part
app.set('layout', 'layout');
app.use(expressLayouts);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname ,'../public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// available vars in all templates
app.locals.hash = '';
app.locals.bannerHtml = require('../common').getBannerHtml( app.get('env') === 'PROD' ? require('../build/bannerInfos.json') : {});

//@note don't really need to serve /public since every assets are bundle with webpack
//app.use(express.static(path.join(__dirname, 'public'))); //keeping it if any assets come out
if (app.get('env') === 'PROD') {
  app.use(express.static(path.join(__dirname, '../build')));
  try{
    app.locals.hash = '-' + require('../build/stats.json').hash;
    console.log('Using hash:', app.locals.hash);
  }
  catch(e){
    throw new Error("Couldn't retrieve hash from /build/stats.json, please rebuild", e);
  }
}

// catch 404 and forward to error handler (must be before routes declaration which catches all)
app.use('/:url(assets)/*',function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use('/', routes);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') !== 'PROD') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err, err.message);
    res.render(path.join(__dirname,'views/error.ejs'), {
      layout: 'layout',
      message: err.message,
      status: err.status || 500,
      error: err,
      env: req.app.get('env')
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render(path.join(__dirname,'views/error.ejs'), {
    layout: 'layout',
    message: err.message,
    status: err.status || 500,
    error: {},
    env: req.app.get('env')
  });
});

/** httpService init - also runs client side with the same code, both in ES6 */
var httpServiceConfiguration = helpers.getHttpServiceConfiguration(app.get('env'));
var httpService = require('../src/services/httpService').getInstance(httpServiceConfiguration);

module.exports = app;
