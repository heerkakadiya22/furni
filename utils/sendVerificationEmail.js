const nodemailer = require("nodemailer");
const CONFIG =
  require("../config/config")[process.env.NODE_ENV || "development"];

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CONFIG.emailUser,
    pass: CONFIG.emailPass,
  },
});

module.exports = async (email, token) => {
  const PORT = process.env.PORT || 3000;
  const link = `http://localhost:${PORT}/verify-email?email=${encodeURIComponent(
    email
  )}&token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Welcome to Furni.com 🎉</h2>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
      <a href="${link}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
      ">Verify Email</a>
      <p style="margin-top: 20px;">⚠️ This link will expire in 1 day.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"MyApp" <${CONFIG.emailUser}>`,
    to: email,
    subject: "Verify Your Email",
    html,
  });
};
