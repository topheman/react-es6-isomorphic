'use strict';

import React from 'react';
import Router from 'react-router';

var Link = Router.Link;

export default class About extends React.Component {
  render() {
    return (
      <div>
        <p>
          The difference is that any page you access <strong>directly</strong> will be <strong>server-side rendered</strong>.
          You can check that by accessing directly a page and displaying its source.<br/>
          Even if server-side rendered, the SPA keeps working as usual (front-end router, template rendering ...).
        </p>
        <p>
          But ... why bother about that ...?
        </p>
        <p>I won't go into specifics but here are two main upsides :</p>
        <ul>
          <li><strong>Initial load is faster</strong> : Since markup is present, no API request from the client nor re-rendering needed.</li>
          <li><strong>More SEO friendly</strong> : Since markup is present, crawlers can read your site.</li>
        </ul>
        <p>Learn more about that and this project on my <a href="http://dev.topheman.com/react-es6-isomorphic/" title="Makin a React ES6 Isomorphic app">blog post</a>.</p>
      </div>
    );
  }
};