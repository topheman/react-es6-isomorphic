'use strict';

function projectIsGitManaged(){
  var fs = require('fs');
  var path = require('path');
  try {
    // Query the entry
    var stats = fs.lstatSync(path.join(__dirname,'.git'));

    // Is it a directory?
    if (stats.isDirectory()) {
      return true;
    }
    return false;
  }
  catch (e) {
    return false;
  }
}

/**
 * Return the git revision if the project is git managed
 * Also returns the git revision for a project just shipped to heroku at compile time
 * If no git involved, returns null
 * @param {String} mode 'short'|'long'
 * @returns {String|null}
 */
function getGitRevision(mode){
  var gitRev = require('git-rev-sync');
  mode = mode || 'long';
  if(['short','long'].indexOf(mode) === -1){
    throw new Error("Only accepts 'short' or 'long' as argument");
  }
  if(projectIsGitManaged()){
    return gitRev[mode]();
  }
  //case we are on heroku, process.env.SOURCE_VERSION contains the hash of the git revision (only at compile time)
  else if(process.env.SOURCE_VERSION){
    if(mode === 'short'){
      return process.env.SOURCE_VERSION.slice(0,7);
    }
    return process.env.SOURCE_VERSION
  }
  return;
}

function getInfos(){
  var moment = require('moment');
  var pkg = require('./package.json');
  var infos = {
    pkg: pkg,
    today: moment(new Date()).format('DD/MM/YYYY'),
    year: new Date().toISOString().substr(0, 4),
    gitRevisionShort: getGitRevision('short'),
    gitRevisionLong: getGitRevision('long'),
    urlToCommit: undefined
  };
  infos.urlToCommit = infos.gitRevisionLong ? _getUrlToCommit(pkg, infos.gitRevisionLong) : undefined;
  return infos;
}

/**
 * Called in default mode by webpack (will format it correctly in comments)
 * Called in formatted mode by gulp (for html comments)
 * @param {String} mode default/formatted
 * @param {Object} overrideInfos pass an object to override the properties to render
 * @returns {String}
 */
function getBanner(mode, overrideInfos){
  overrideInfos = overrideInfos || {};
  var _ = require('lodash');
  var infos = _.extend(getInfos(), overrideInfos);
  var compiled = _.template([
    '<%= pkg.name %>',
    '',
    '<%= pkg.description %>',
    '',
    '@version v<%= pkg.version %> - <%= today %>',
    '<% if(gitRevisionShort) { %>@revision #<%= gitRevisionShort %><% if (urlToCommit) { %> - <%= urlToCommit %><% } %><% } %>',
    '@author <%= (pkg.author && pkg.author.name) ? pkg.author.name : pkg.author %>',
    '@copyright <%= year %>(c) <%= (pkg.author && pkg.author.name) ? pkg.author.name : pkg.author %>',
    '@license <%= pkg.license %>',
    ''
  ].join(mode === 'formatted' ? '\n * ' : '\n'));
  return compiled(infos);
}

function getBannerHtml(overrideInfos){
  overrideInfos = overrideInfos || {};
  return '<!--\n * \n * ' + getBanner('formatted', overrideInfos) + '\n-->\n';
}

function _getUrlToCommit(pkg, gitRevisionLong){
  var urlToCommit;
  //retrieve and reformat repo url from package.json
  if (typeof(pkg.repository) === 'string') {
    urlToCommit = pkg.repository;
  }
  else if (typeof(pkg.repository.url) === 'string') {
    urlToCommit = pkg.repository.url;
  }
  //check that there is a git repo specified in package.json & it is a github one
  if (urlToCommit && /^https:\/\/github.com/.test(urlToCommit)) {
    urlToCommit = urlToCommit.replace(/.git$/, '/tree/' + gitRevisionLong);//remove the .git at the end
  }
  return urlToCommit;
}

module.exports.getInfos = getInfos;
module.exports.getBanner = getBanner;
module.exports.getBannerHtml = getBannerHtml;