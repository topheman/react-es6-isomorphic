'use strict';

import React from 'react';
import Router from 'react-router';

var Link = Router.Link;

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <p>
          This POC is the result of a <strong>three steps project</strong> I set in motion a few weeks earlier.
          The endgoal was to <strong>make an isomorphic app</strong>, using <strong>React</strong> and <strong>ES6</strong>, displaying some dynamic data from a backend.
          Here are the previous steps :
        </p>
        <ul>
          <li>
            <a href="https://github.com/topheman/topheman-apis-proxy" title="topheman-apis-proxy on Github">topheman-apis-proxy</a> : the backend that proxies public APIs
          </li>
          <li>
            <a href="http://dev.topheman.com/playing-with-es6-and-react/" title="topheman/react-es6 blog post - client-side part">topheman/react-es6</a> : front-end part of the app, previously developed only using es6 and isomorphic libraries such as superagent, to be reused "as is" for the version you're seeing
          </li>
        </ul>
        <p><strong>TLDR;</strong> : click on the button to try it !</p>
        <p className="text-center"><Link className="btn btn-default btn-primary btn-lg" to="github">TRY the DAMN thing !</Link></p>
        <p><strong>Isomorphic</strong>, you say ? Take a quick look a the <strong><Link to="about">about page</Link></strong> if you don't see the difference with the previous version.</p>
        <p>You can also checkout the source code on github at : <a href="https://github.com/topheman/react-es6-isomorphic" title="topheman/react-es6-isomorphic on Github">topheman/react-es6-isomorphic</a></p>
      </div>
    );
  }
};