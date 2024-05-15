import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  requireTLS: true,
  logger: true,
  debug: true,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_EMAIL_PWD,
  },
});

export default transporter;
