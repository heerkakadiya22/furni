const authRepo = require("../repositories/authRepository");
const { v4: uuidv4 } = require("uuid");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

exports.verifyEmail = async (req, res) => {
  const { email, token } = req.query;

  if (!email || !token) {
    return res.send("⚠️ Invalid verification link.");
  }

  try {
    // Step 1: Fetch user
    const user = await authRepo.findByEmail(email);
    console.log("🔍 User fetched:", {
      email: user?.email,
      verifiedAt: user?.verifiedAt,
      email_expired: user?.email_expired,
    });

    if (!user) return res.send("User not found.");

    if (user.verifiedAt) {
      return res.send("✅ Email already verified.");
    }

    const now = new Date();
    if (user.email_expired && new Date(user.email_expired) < now) {
      return res.send("❌ Verification link expired.");
    }

    // Step 2: Update verifiedAt
    const updateResult = await authRepo.update(user.id, {
      verifiedAt: new Date(),
    });
    console.log("🛠️ Update result:", updateResult);

    // Step 3: Confirm update
    const updatedUser = await authRepo.findByEmail(email);
    console.log("✅ After update:", {
      verifiedAt: updatedUser?.verifiedAt,
    });

    return res.redirect("/auth?show=login&verified=1");
  } catch (err) {
    console.error("❌ Email verify error:", err);
    return res.send("❌ Verification failed.");
  }
};

exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    req.session.error = "Email is required to resend.";
    return res.redirect("/auth?show=login");
  }

  try {
    const user = await authRepo.findByEmail(email);
    if (!user || user.verifiedAt) {
      req.session.error = "User not found or already verified.";
      return res.redirect("/auth?show=login");
    }

    const token = uuidv4();
    const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // Update only the `email_expired` field
    await authRepo.update(user.id, { email_expired: newExpiry });

    // Store the new token in session
    req.session.emailVerification = {
      token,
      email,
      expiresAt: newExpiry,
    };

    // Resend email
    await sendVerificationEmail(email, token);

    req.session.success = "Verification email has been resent!";
    return req.session.save(() => res.redirect("/auth?show=login"));
  } catch (err) {
    console.error("🔁 Resend verification error:", err);
    req.session.error = "Something went wrong. Try again later.";
    return res.redirect("/auth?show=login");
  }
};
  