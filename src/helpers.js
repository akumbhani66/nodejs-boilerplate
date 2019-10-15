import nodemailer from 'nodemailer';

export const mailTo = (async (To, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL, // sender address
    to: To, // list of receivers
    subject: subject, // Subject line
    html: html// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      return {
        status: false,
        error: err
      }
    } else {
      return {
        status: false,
        info
      }
    }
  });
});