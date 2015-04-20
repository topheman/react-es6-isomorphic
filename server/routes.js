'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var React = require('react');
var Router = require('react-router');
var clientSideRoutes = require('../src/routes.jsx');

/* GET users listing. */
router.get('/*', function(req, res, next) {
  //var router = Router.create({location: req.url, routes: clientSideRoutes});
  Router.run(clientSideRoutes, req.url, function(Handler, state) {
    console.log(req.url,state);
    var body = React.renderToString(<Handler/>)
    res.render(path.resolve(__dirname, 'views/body.ejs'), {
      layout: 'layout',
      body: body,
      env: req.app.get('env')
    });
  });
});

/* if no route matched, redirect home */
router.get('/*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;