'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var React = require('react');
var Router = require('react-router');
var clientSideRoutes = require('../src/routes.jsx');

var github = require('../src/services/github');

var fetchDataByRoute = function(req, state, cb){
  if(req.url.indexOf('/github/user/') > -1){
    state.data = {};
    Promise.all([
      github.getUser(state.params.username),
      github.getUserRepos(state.params.username)
    ]).then(results => {
      state.data.profile = results[0];
      state.data.profile.pristineLogin = state.params.username;
      state.data.repositories = results[1];
      state.data.repositories.pristineLogin = state.params.username;
      cb();
    },() => {
      delete state.data;
      cb();
    });
  }
  else{
    cb();
  }
};

/* GET users listing. */
router.get('/*', function(req, res, next) {
  Router.run(clientSideRoutes, req.url, function(Handler, state) {
    fetchDataByRoute(req, state, function(){
      var body = React.renderToString(<Handler {...state}/>)
      res.render(path.resolve(__dirname, 'views/body.ejs'), {
        layout: 'layout',
        body: body,
        env: req.app.get('env')
      });
    });
  });
});

/* if no route matched, redirect home */
router.get('/*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;