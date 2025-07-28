const authRepo = require("../repositories/authRepository");

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
