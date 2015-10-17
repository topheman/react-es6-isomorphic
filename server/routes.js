'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var debug = require('debug')('http');

var React = require('react');
var ReactDOMServer = require('react-dom/server');
var ReactRouter = require('react-router');
var RoutingContext = ReactRouter.RoutingContext;

var clientSideRoutes = require('../src/routes.jsx');

var github = require('../src/services/github');

/**
 * Helper that makes async request when needed to feed data to the router
 * for later rendering by react components
 *
 * @param {Object} req
 * @param {Object} renderProps (from react-router)
 * @param {Function} cb containing the application to serialize and pass in the params of the router
 */
var fetchDataByRoute = function(req, renderProps, cb){
  if(req.url.indexOf('/github/user/') > -1){
    var state = {
      data: {}
    };
    Promise.all([
      github.getUser(renderProps.params.username),
      github.getUserRepos(renderProps.params.username,{
        page: 1,
        sort: "updated",
        per_page: 15
      })
    ]).then(results => {
      state.username = renderProps.params.username;
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

/**
 * The server side-rendering works but there are caveats when rendering from dynamic data
 * using the new version of react-router.
 * Main reason: it doesn't seem to pass mutated routeInfos (renderProps).
 * This bug is a good oportunity to setup some flux-like implementation,
 * in order to have clearer management of state.
 */
router.get('/*', function(req, res, next) {
  ReactRouter.match({routes: clientSideRoutes, location: req.url}, function(err, redirectLocation, renderProps) {
    if(err){
      debug('[ReactRouter][Error]', req.url, err.message);
      return next(err);
    }
    else if(redirectLocation){
      debug('[ReactRouter][Redirection]', req.url, redirectLocation.pathname, redirectLocation.search);
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }
    else if(renderProps){
      debug('[ReactRouter][Found]', req.url);
      fetchDataByRoute(req, renderProps, function(appState){
        //pass the state of the app via the params, so that the router dispatches to the props of the right component
        Object.assign(renderProps.params, appState);
        var markup = ReactDOMServer.renderToString(<RoutingContext {...renderProps} />);
        //serialize the state of the app so that the client can catch up
        var serializedState = JSON.stringify(appState);
        return res.render(path.resolve(__dirname, 'views/markup.ejs'), {
          layout: 'layout',
          markup: markup,
          serializedState: serializedState,
          env: req.app.get('env')
        });
      });
    }
    else{
      //@todo correctly render errors
      console.log('[ReactRouter][Not Found]', req.url);
      var error404 = new Error('Not Found');
      error404.status = 404;
      next(error404);
    }
  });
})

/* if no route matched, redirect home */
router.get('/*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;