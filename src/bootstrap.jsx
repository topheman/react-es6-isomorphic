'use strict';

import React from 'react';
import Router from 'react-router';
import routes from './routes.jsx';

//init httpService config
import httpServiceConfiguration from 'httpServiceConfiguration';
import httpService from './services/httpService.js';
httpService.getInstance(httpServiceConfiguration);//will keep config in singleton
//this way, instead of using resolve.alias of webpack (and having the require of module messed up by webpack when they'll be executed server-side)
//I use dependency injection, in the one place that won't be executed in node : the client side bootstrap

Router.run(routes, Router.HistoryLocation, function(Handler, state){
  if(window.__DATA__){
    state = window.__DATA__;
    window.__DATA__ = null;//only use at first render to sync up
  }
  React.render(<Handler {...state}/>, document.body);
});