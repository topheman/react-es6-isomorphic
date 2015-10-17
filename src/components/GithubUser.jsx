'use strict';

import React from 'react';
import update from 'react-addons-update';

import github from '../services/github.js';
import Spinner from './common/Spinner.jsx';
import Profile from './githubUser/Profile.jsx';
import Repos from './githubUser/Repos.jsx';

const ORIGINAL_REPOS_PER_PAGE = 15;

export default class GithubUser extends React.Component {
  constructor(props){

    super(props);

    //init context bindings - due to diff between React.createClass and ES6 class
    this._getInitialState = this._getInitialState.bind(this);
    this.reposGotoPage = this.reposGotoPage.bind(this);
    this.init = this.init.bind(this);
    this.componentWillMount = this.componentWillMount.bind(this);

    //init state
    this.state = this._getInitialState();

    //init state client-side - when the page was already rendered server-side, to share the state (passed serialized)
    if(typeof __DATA__ !== 'undefined' && __DATA__ !== null){
      this.state = __DATA__.data;
      __DATA__ = null;
    }

    //init state server-side - to render based on data previously retrieved and passed through the router params
    if(props.params.data){
      this.state.profile = props.params.data.profile;
      this.state.profile.pristineLogin = props.params.username;
      this.state.repositories = props.params.data.repositories;
      this.state.repositories.pristineLogin = props.params.username;
    }

  }

  /**
   * If the component's state not yet initialized with data (from server-side rendering),
   * will trigger an xhr, a state change and a re-render
   *
   * Should never be triggered on server-side rendering (even if componentDidMount only fires on client,
   * this one fires before the first render - see http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods )
   */
  componentWillMount(){
    if(!this.state.profile.data) {
      this.init(this.state.profile.pristineLogin);
    }
  }
  _getInitialState(){
    return{
      profile: {
        pristineLogin: this.props.params.username
      },
      repositories: {
        pristineLogin: this.props.params.username
      }
    };
  }
  init(userName){
    //init the state as fetching
    var newState = update(this.state,{
      profile:{
        fetching: {$set: true}
      },
      repositories:{
        fetching: {$set: true}
      }
    });
    this.setState(newState);
    //client-side fetching of the profile via xhr based on username
    github.getUser(userName)
      .then((result) => {
        this.setState({
          profile: {
            data: result.data,
            fetching: false
          }
        });
      })
      .catch((error) => {
        this.setState({
          profile: {
            error : error.humanMessage,
            fetching: false
          }
        });
      });
    //client-side fetching of the repositories via xhr based on the username
    github.getUserRepos(userName,{
      page: 1,
      sort: "updated",
      per_page: ORIGINAL_REPOS_PER_PAGE
    })
      .then((result) => {
        this.setState({
          repositories: {
            pristineLogin: userName,//pass again (since it was erased)
            data: result.data,
            infos: result.infos,
            fetching: false
          }
        });
      })
      .catch((error) => {
        this.setState({
          repositories: {
            error : error.humanMessage,
            fetching: false
          }
        });
      });
  }
  reposGotoPage(pageNum){
    //client-side fetching of the repositories via xhr based on the username
    var newState = update(this.state,{
      repositories:{
        fetching: {$set: true}
      }
    });
    this.setState(newState);
    github.getUserRepos(this.state.repositories.pristineLogin,{
      page: pageNum,
      sort: "updated",
      per_page: this.state.repositories.infos.per_page
    })
      .then((result) => {
        this.setState({
          repositories: {
            pristineLogin: this.state.repositories.pristineLogin,//pass again (since it was erased)
            data: result.data,
            infos: result.infos,
            fetching: false
          }
        });
      })
      .catch((error) => {
        this.setState({
          repositories: {
            error : error.humanMessage,
            fetching: false
          }
        });
      });
  }
  reposChangePerPage(perPage){

  }
  render(){
    var profile = this.state.profile;
    var repositories = this.state.repositories;
    return (
      <div>
        <Profile profile={profile}/>
        <Repos repositories={repositories} reposGotoPage={this.reposGotoPage}/>
      </div>
    );
  }
}