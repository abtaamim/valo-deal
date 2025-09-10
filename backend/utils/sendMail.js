
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "valodeal.bd@gmail.com",
    pass: "pjwv niyi omqn eoro", // app password
  },
});

async function sendMail(to, subject, msg) {
  return transporter.sendMail({
    from: '"ValoDeal" <valodeal.bd@gmail.com>', // sender name
    to,
    subject,
    html: msg,
  });
}

module.exports = sendMail;
