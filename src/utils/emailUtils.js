require('dotenv').config();
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_LOGIN,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendPasswordResetCode(toEmail, verificationCode) {
  try {
    let info = await transporter.sendMail({
      from: 'noreply@flowblog.com',
      to: toEmail,
      subject: 'Reset your password',
      html: `<p>A password reset request has been sent from your account.</p>
               <p>Use this verification code to reset your password. It will expire in 10 minutes.</p>
               <p><strong>${verificationCode}</strong></p>
               <p>If you didn't request a password reset, ignore this email.</p>`,
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
}

async function confirmEmail(toEmail, verificationCode, link) {
  try {
    let info = await transporter.sendMail({
      from: 'noreply@flowblog.com',
      to: toEmail,
      subject: 'Verify Your Email',
      html: `
      <p>Your verification code is:</p>
      <p><strong>${verificationCode}</strong></p>
      <p>Click <a href="${link}">here</a> to verify your account.</p>`,
    });
  } catch (error) {
    console.error(error);
  }
}

module.exports = { sendPasswordResetCode, confirmEmail };
