$(document).ready(function () {
  $.validator.addMethod(
    "pattern",
    function (value, element, param) {
      return this.optional(element) || param.test(value);
    },
    "Invalid format."
  );

  $("#register-form").validate({
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 10,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      },
      confirmPassword: {
        required: true,
        equalTo: "#password",
      },
    },
    messages: {
      name: "Name is required.",
      email: {
        required: "Email is required.",
        email: "Invalid email format.",
      },
      password: {
        required: "Password is required.",
        minlength: "Min 6 characters.",
        maxlength: "Max 10 characters.",
        pattern: "Must include A-Z, a-z, 0-9, and symbol.",
      },
      confirmPassword: {
        required: "Please confirm password.",
        equalTo: "Passwords do not match.",
      },
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid");
    },
  });
});

$("#forgotPasswordForm").validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email address",
      email: "Please enter a valid email address",
    },
  },
});

$("#resetPasswordForm").validate({
  rules: {
    newPassword: {
      required: true,
      minlength: 6,
    },
    confirmNewPassword: {
      required: true,
      equalTo: "#password",
    },
  },
  messages: {
    newPassword: {
      required: "Enter a password",
      minlength: "Password must be at least 6 characters",
    },
    confirmNewPassword: {
      required: "Confirm your password",
      equalTo: "Passwords do not match",
    },
  },
  errorPlacement: function (error, element) {
    if (element.parent(".input-group").length) {
      error.insertAfter(element.parent()); // after input-group
    } else {
      error.insertAfter(element);
    }
  },
});
