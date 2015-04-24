'use strict';

import React from 'react';

export default class TwitterButton extends React.Component {
  render(){
    return (
      <a href="https://twitter.com/share" className="twitter-share-button" data-text="Isomorphic #reactjs app in #es6 using Github API" data-via="topheman" data-size="large" data-count="none" data-url="https://topheman-react-es6-isomorphic.herokuapp.com/">Tweet</a>
    );
  }
}