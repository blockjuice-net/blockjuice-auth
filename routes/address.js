var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
var moment    = require('moment');
var axios     = require('axios');
const path    = require('path');

var dotenv  = require('dotenv');
dotenv.config();

var database, purestack;

router.use(function (req, res, next) {  
  database = req.app.locals.firebase.database();
  purestack = req.app.locals.purestack;
  next();
});

router.get('/:uid', (req, res,next) => {

  var uid = req.params.uid;

  return database.ref('/users/' + uid).once('value').then((snapshot) => {
    var address = (snapshot.val() && snapshot.val().address) || '';
    log('info', 'address: ' + address);
    res.send(address);
  });

});

router.post('/add', (req, res, next) => {
 
  var uid = req.body.uid;

  log('info', 'create address for user ' + uid);

  purestack.create_account((error, account) => {

    if (error == null) {
      // send mail
      database.ref('users/' + uid).set({
        uid: uid,
        address: account.address,
        secret: secretKeyMnemonic,
        enabled : true,
        created_ts: moment.utc().format(),
        level: 0
      });
  
      res.send({
        account: account.address,
        secret: account.secretKeyMnemonic
      });

    } else {
      res.status(400).send({
        account: '',
        secret: ''
      })
    };

  });

  /*
  purestack.create_account().then(account => {

    // send mail

    database.ref('users/' + uid).set({
      uid: uid,
      address: account.address,
      enabled : true,
      created_ts: moment.utc().format(),
      level: 0
    });

    res.send(account.secretKeyMnemonic);

  });
  */

});

router.post('/recovery', (req, res, next) => {
  
  var mnemonic = req.body.mnemonnic;

  purestack.recovery(mnemonic).then(address => {
    res.send(address)
  }).catch(e => {
    res.status(400).send(e)
  })

});

module.exports = router;