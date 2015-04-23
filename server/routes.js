'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var React = require('react');
var Router = require('react-router');
var clientSideRoutes = require('../src/routes.jsx');

var github = require('../src/services/github');

/**
 * If any async request needs to be done, makes it and feeds the state, then calls the callback
 * (preventing rendering before async data returns)
 */
var fetchDataByRoute = function(req, state, cb){
  if(req.url.indexOf('/github/user/') > -1){
    state.data = {};
    Promise.all([
      github.getUser(state.params.username),
      github.getUserRepos(state.params.username,{
        page: 1,
        sort: "updated",
        per_page: 15
      })
    ]).then(results => {
      state.username = state.params.username;
      state.data.profile = results[0];
      state.data.repositories = results[1];
      cb(state);
    },() => {
      delete state.data;
      cb(state);
    });
  }
  else{
    cb(state);
  }
};

/* GET users listing. */
router.get('/*', function(req, res, next) {
  Router.run(clientSideRoutes, req.url, function(Handler, state) {
    fetchDataByRoute(req, state, function(populatedState){
      var body = React.renderToString(<Handler {...populatedState}/>);
      var serializedState = JSON.stringify(populatedState);
      res.render(path.resolve(__dirname, 'views/body.ejs'), {
        layout: 'layout',
        body: body,
        serializedState: serializedState,
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