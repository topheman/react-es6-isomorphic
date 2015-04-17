var express = require('express');
var router = express.Router();
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render(path.resolve(__dirname, 'views/body.ejs'), {
    layout: 'layout',
    body: '<p>Hello world!</p>',
    env: req.app.get('env')
  });
});

/* if no route matched, redirect home */
router.get('/*', function(req, res, next) {
  res.redirect('/');
});

module.exports = router;