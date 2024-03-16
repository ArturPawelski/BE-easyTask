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

async function sendPasswordResetCode(toEmail, verificationCode, resetLink) {
  try {
    let info = await transporter.sendMail({
      from: 'noreply@flowblog.com',
      to: toEmail,
      subject: 'Reset your password',
      html: `<p>We received a request to reset the password for your account.</p>
      <p>To reset your password, please follow the link below:</p>
      <p><a href="${resetLink}" target="_blank">Reset My Password</a></p>
      <p>After clicking the link, you will be prompted to enter the verification code and your new password.</p>
      <p>Your Verification Code is: <strong>${verificationCode}</strong></p>
      <p>This verification code will expire in 5 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>`,
    });
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
