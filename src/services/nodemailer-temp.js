/**
 * Sends email using a services account
 * This service is should NOT BE ACTIVE...use mail.js instead
 */
import nodemailer from "nodemailer";

const { EMAIL, EMAIL_PASSWORD } = process.env;

const forgotPassword = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Sending Email using Node.js",
    text: `Yo, I heard you like tokens, so I got you a token for your token ${token}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

const confirmationEmail = (email, confirmationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: EMAIL,
    to: email,
    subject: "Sending Email using Node.js",
    text: `Click the link to confirm your email localhost:3000/${email}/${confirmationToken}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};

export default { forgotPassword, confirmationEmail };
