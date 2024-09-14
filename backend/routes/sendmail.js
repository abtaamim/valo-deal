const express = require('express')
const router = express.Router();

const nodemailer = require('nodemailer');
//hetg rbds foxh datr
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  //secure: false, // true for port 465, false for other ports
  auth: {
    user: "valodeal.bd@gmail.com",
    pass: "pjwv niyi omqn eoro",
  },
});
async function sendMail(to, sub, msg) {
  await transporter.sendMail({
    to: to,
    subject: sub,
    html: msg,
  });
}


router.post('/mail', async (req, res) => {
  try {
    const { to, subject, mailBody } = req.body;
    console.log(to, subject, mailBody);
    await sendMail(to, subject, mailBody);
    res.status(200).json({ message: 'Mail sent successfully' });
  } catch (e) {
    console.error(e);
  }
})

module.exports = router