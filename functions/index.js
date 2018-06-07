
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = 'Portfolio website';

exports.mail = functions.https.onRequest((req, res) => {
	
  const senderName 		= 	req.body.senderName;
  const senderEmail 	= 	req.body.senderEmail;
  const body 			=	req.body.body;
  console.log(`Mail function: {senderName: ${senderName}, senderEmail: ${senderEmail}}`);
  sendEmail(senderName, senderEmail, body);
  return res.status(200).send('Message sent!'); 

});




function sendEmail(senderName, senderEmail, emailContent) {
  const mailOptions = {
    from: `${APP_NAME} <$senderEmail>`,
    to: gmailEmail,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Message originating from ${APP_NAME}!`;
  mailOptions.text = `${senderName} posted the following on ${APP_NAME}:  \n${emailContent}`;
  return mailTransport.sendMail(mailOptions).then(() => {
	  return console.log(`Message sent from ${senderEmail} to ${gmailEmail} via ${APP_NAME}`);
  });
}