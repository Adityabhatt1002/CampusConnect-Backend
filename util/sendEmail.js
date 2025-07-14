const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     secure: false, // use TLS not SSL
    tls: {
      rejectUnauthorized: false, // 👈 this fixes the self-signed error
    },
  });

  const info = await transporter.sendMail({
    from: `"CampusConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent:", info.messageId);
};

module.exports = sendEmail;
