const { validationResult } = require("express-validator");
const registerRepo = require("../repositories/authRepository");

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
        return res.redirect("/auth");
      });
    }

    await registerRepo.createUser({ name, email, password });

    req.session.success = "Registration successful! Please log in.";
    req.session.showLogin = true;
    return req.session.save(() => {
      return res.redirect("/auth?show=login");
    });
  } catch (err) {
    console.error("Registration error:", err);
    req.session.error = "Something went wrong. Try again.";
    req.session.registerFormData = { name, email };
    req.session.showLogin = false;
    return req.session.save(() => {
      return res.redirect("/auth");
    });
  }
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerRepo.findByEmail(email);

    if (!user || user.password !== password) {
      req.session.error = "Invalid credentials";
      req.session.loginFormData = { email };
      req.session.showLogin = true;
      return req.session.save(() => {
        return res.redirect("/auth?show=login");
      });
    }

    // You can set user session here if login is successful
    req.session.user = user;

    req.session.success = "Login successful!";
    return req.session.save(() => {
      return res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Login error:", err);
    req.session.error = "Login failed. Try again.";
    req.session.loginFormData = { email };
    req.session.showLogin = true;
    return req.session.save(() => {
      return res.redirect("/auth?show=login");
    });
  }
};
