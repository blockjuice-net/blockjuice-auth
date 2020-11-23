var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

var typeform;
var form;

router.param('login', function (req, res, next, login) {
  
  form = login;

  if (login == 'signin') {
    typeform = 'Sign In';
  } else if (login == 'signup') {
    typeform = 'Sign Up';
  };

  log('info', 'Start Form: ' + typeform);

  next();
})

router.get('/:login', (req, res, next) => {

  res.render(form, { 
    title: process.env.TITLE,
    typeform: typeform,
    error: '',
    message: ''
  });

});

module.exports = router;
