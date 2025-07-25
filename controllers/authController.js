const { validationResult } = require("express-validator");
const registerRepo = require("../repositories/authRepository");
const { v4: uuidv4 } = require("uuid");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

exports.renderAuth = (req, res) => {
  const error = req.session.error || null;
  const success = req.session.success || null;
  const registerFormData = req.session.registerFormData || {};
  const loginFormData = req.session.loginFormData || {};

  const showLogin = req.query.show === "login";

  req.session.error = null;
  req.session.success = null;
  req.session.registerFormData = null;
  req.session.loginFormData = null;

  res.render("auth", {
    currentPage: "auth",
    title: showLogin ? "Login" : "Sign Up",
    csrfToken: req.csrfToken(),
    error,
    success,
    showLogin,
    formData: showLogin ? loginFormData : registerFormData,
  });
};

exports.handleRegister = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    req.session.formData = { name, email };
    req.session.showLogin = false;
    return req.session.save(() => {
      return res.redirect("/auth");
    });
  }

  try {
    const existingUser = await registerRepo.findByEmail(email);

    if (existingUser) {
      req.session.error = "Email already exists";
      req.session.registerFormData = { name, email };
      req.session.showLogin = false;
      return req.session.save(() => {
        return res.redirect("/auth?show=register");
      });
    }

    const token = uuidv4();
    const email_expired = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await registerRepo.createUser({
      name,
      email,
      password,
      verifiedAt: null,
      email_expired,
    });

    // Store token in session
    req.session.emailVerification = {
      token,
      email,
      expiresAt: email_expired,
    };

    await sendVerificationEmail(email, token);

    req.session.success = "Registered! Please check your email to verify.";
    req.session.showLogin = true;
    return req.session.save(() => {
      return res.redirect("/auth?show=login");
    });
  } catch (err) {
    console.error("Registration error:", err);
    req.session.error = "Registration failed.";
    req.session.registerFormData = { name, email };
    req.session.showLogin = false;
    return req.session.save(() => {
      return res.redirect("/auth?show=register");
    });
  }
};

exports.handleLogin = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    req.session.error = errors.array()[0].msg;
    req.session.loginFormData = { email };
    req.session.showLogin = true;
    return req.session.save(() => res.redirect("/auth?show=login"));
  }

  try {
    const user = await registerRepo.findByEmail(email);

    if (!user || user.password !== password) {
      req.session.error = "Invalid credentials";
      req.session.loginFormData = { email };
      req.session.showLogin = true;
      return req.session.save(() => res.redirect("/auth?show=login"));
    }

    // Check if the user has verified their email
    if (!user.verifiedAt) {
      const now = new Date();
      if (user.email_expired && new Date(user.email_expired) < now) {
        req.session.error = "Verification link expired. Please register again.";
      } else {
        req.session.error = "Please verify your email to continue.";
      }

      req.session.loginFormData = { email };
      req.session.showLogin = true;
      return req.session.save(() => res.redirect("/auth?show=login"));
    }

    // Login success
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
    };

    if (user.roleId === 1) {
      // Admin: open dashboard in new tab, redirect index in current
      return req.session.save(() => {
        return res.send(`
          <html>
            <head>
              <script>
                window.open('/dashboard', '_blank');
                window.location.href = '/';  
              </script>
            </head>
            <body>
              Redirecting...
            </body>
          </html>
        `);
      });
    } else {
      // Non-admin user: redirect to index only
      return req.session.save(() => res.redirect("/"));
    }
  } catch (err) {
    console.error("Login error:", err);
    req.session.error = "Login failed. Try again.";
    req.session.loginFormData = { email };
    req.session.showLogin = true;
    return req.session.save(() => res.redirect("/auth?show=login"));
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      req.session.error = "Logout failed. Try again.";
      return res.redirect("/dashboard");
    }
    res.redirect("/");
  });
};
