var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();


router.get('/', (req, res, next) => {
  
  // let message = 'Start login flow using /login route. Try it like this: {http://yourserver:port}/login/facebook';
  // return res.status(200).send(message);
  log('info', 'API HOME ...')
  res.render('index', { 
    title: '_clementineOS' 
  });
});

module.exports = router;
