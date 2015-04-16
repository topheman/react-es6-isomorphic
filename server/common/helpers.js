'use strict';

module.exports = {
  /**
   *
   * @param env from process.env or app.get('env')
   * @returns {Object} the Configuration that will let possible to init the httpService that runs client-side
   * to also run server-side
   */
  getHttpServiceConfiguration: function(env){
    var suffix;
    switch(env){
      case 'development':
      case 'DEV':
        suffix = 'dev';
        break;
      case 'PROD':
        suffix = 'build';
        break;
      case 'MOCK':
        suffix = 'mock';
        break;
    }
    return require('../../src/services/httpService/config/environment/config.'+suffix+'.js');
  }
};