var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
var moment    = require('moment');

var dotenv  = require('dotenv');
dotenv.config();

var database, purestack;

router.use(function (req, res, next) {  
  database = req.app.locals.firebase.database();
  purestack = req.app.locals.purestack;
  next();
});

router.post('/add', (req, res, next) => {
 
  var uid = req.body.uid;

  log('info', 'create address for user ' + uid);

  purestack.create_account().then(account => {

    database.ref('users/' + uid).set({
      uid: uid,
      address: account.address,
      enabled : true,
      created_ts: moment.utc().format(),
      level: 0
    });

    res.send(account.secretKeyMnemonic);

  });

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