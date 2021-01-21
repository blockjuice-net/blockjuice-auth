var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
var moment    = require('moment');
var axios     = require('axios');
const path    = require('path');
const mail    = require('../mail');

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

  purestack.create_account().then(account => {

    // https://github.com/bdcorps/candymail /info/uid

    // axios get

    

    /*

    

    {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    }

    */

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

// ---------------------------------
let sendMail = (destination) => {

  axios.get('/user/info/' + uid).then(response => {
  // handle success
  // console.log(response);
  const mailconfig = path.resolve('mailconfig.json');
  log('info', JSON.stringify(mailconfig)); // !! HIDE. ONLY FOR DEBUG

  var email = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: destination, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };

  

  }).catch(error => {
  // handle error
  console.log(error);
  });

}

module.exports = router;