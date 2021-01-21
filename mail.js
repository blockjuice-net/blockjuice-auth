const nodemailer = require('nodemailer');
const log        = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();


// async..await is not allowed in global scope, must use a wrapper
let send = async (config, mail, callback) => {

  let transporter = nodemailer.createTransport(config);

  // send mail with defined transport object
  // let info = await transporter.sendMail(mail);

  log('info', JSON.stringify(mail))

  await transporter.sendMail(mail, err => {

    // log('info', 'Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // log('info', "Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    callback(err);

  });
  
};


// assuming top-level await for brevity
/*
import { SMTPClient } from 'emailjs';

let send = async (config, mail, callback) => {

  const client = new SMTPClient(config);

  try {
    const message = await client.sendAsync(mail);
    console.log(message);
  } catch (err) {
    console.error(err);
  }
}
*/

module.exports = send