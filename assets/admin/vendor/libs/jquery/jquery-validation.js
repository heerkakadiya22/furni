$(function () {
  $("#roleForm").validate({
    rules: {
      rolename: {
        required: true,
        minlength: 2,
      },
      description: {
        maxlength: 255,
      },
    },
    messages: {
      rolename: {
        required: "Role name is required.",
        minlength: "Must be at least 2 characters.",
      },
      description: {
        maxlength: "Description must be less than 255 characters.",
      },
    },
    errorElement: "label",
    errorClass: "error",
    highlight: function (element) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid");
    },
    errorPlacement: function (error, element) {
      error.insertAfter(element);
    },
  });
});

// jQuery Validation for User Form
$.validator.addMethod(
  "pattern",
  function (value, element, param) {
    if (this.optional(element)) return true;
    if (typeof param === "string") {
      param = new RegExp(param);
    }
    return param.test(value);
  },
  "Invalid format."
);

$(function () {
  $(".validate-form").validate({
    rules: {
      name: {
        required: true,
        pattern: "^[A-Za-z ]+$",
      },
      email: {
        required: true,
        email: true,
      },
      phone: {
        digits: true,
        // minlength: 10,
        maxlength: 10,
      },
      address: {
        maxlength: 200,
      },
      username: {
        minlength: 4,
      },
      password: {
        required: true,
        minlength: 6,
        maxlength: 10,
        pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).+$",
      },
      confirmPassword: {
        required: true,
        equalTo: "#password",
      },
    },
    messages: {
      name: {
        required: "Name is required.",
        pattern: "Name must contain only letters.",
      },
      email: {
        required: "Email is required.",
        email: "Enter a valid email address.",
      },
      phone: {
        digits: "Only digits allowed.",
        // minlength: "phone cannot less 10 digits.",
        maxlength: "Phone cannot exceed 10 digits.",
      },
      address: {
        maxlength: "Address must be less than 200 characters.",
      },
      username: {
        minlength: "Username must be at least 4 characters",
      },
      password: {
        required: "Password is required.",
        minlength: "Minimum 6 characters.",
        maxlength: "Maximum 10 characters.",
        pattern: "Include upper, lower, digit, and special character.",
      },
      confirmPassword: {
        required: "Please confirm your password.",
        equalTo: "Passwords do not match.",
      },
    },
    errorElement: "label",
    errorClass: "error",
    highlight: function (element) {
      $(element).addClass("is-invalid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid");
    },
    errorPlacement: function (error, element) {
      if (element.attr("name") === "gender") {
        // Append error after the last radio button inside the same form-group
        element.closest(".form-group").find(".form-check").last().after(error);
      } else if (element.closest(".input-group").length > 0) {
        error.insertAfter(element.closest(".input-group"));
      } else {
        error.insertAfter(element);
      }
    },
  });
});
