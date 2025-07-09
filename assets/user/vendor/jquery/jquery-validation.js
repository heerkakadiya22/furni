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
