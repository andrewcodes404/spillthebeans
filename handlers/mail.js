const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');

//here we create a transport using the login details from vriables.env
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// / if you want a to chekc this works then use this tryout mail and stick This
// / --> require('./handlers/mail');
// in start.js and it will send on the load of any page

// transport.sendMail({
//   from: 'grizle <andrewcodes404@gmail.com>',
//   to: 'clive@aol.com',
//   subject: 'Clive this is a test',
//   html: 'a true test in mailtrap',
//   text: 'a true test in mailtrap'
// });

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    from: `grizle <noreply@grizle.com>`,
    to: options.user.email,
    subject: options.subject,
    html,
    text
  };
  const sendMail = promisify(transport.sendMail, transport);
  return sendMail(mailOptions);
};
