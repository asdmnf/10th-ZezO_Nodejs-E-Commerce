const nodemailer = require('nodemailer')


// nodemailer
exports.sendingEmail = async (options) => {
  const transporter = nodemailer.createTransport({ 

    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT, 
    secure: true,
    auth: { 
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    }
  })
  await transporter.sendMail({ 
    from: `ZezOoo E-Commerce <${process.env.EMAIL_USER}>`,
    to: options.to, 
    subject: options.subject,
    text: options.text,
  })
}