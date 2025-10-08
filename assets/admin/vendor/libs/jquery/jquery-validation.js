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

$(function () {
  $("#categoryForm").validate({
    rules: {
      name: {
        required: true,
        minlength: 2,
      },
      description: {
        maxlength: 255,
      },
    },
    messages: {
      name: {
        required: "name is required.",
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
        element.closest(".form-group").find(".form-check").last().after(error);
      } else if (element.closest(".input-group").length > 0) {
        error.insertAfter(element.closest(".input-group"));
      } else {
        error.insertAfter(element);
      }
    },
  });
});

$(function () {
  $(".validation-form").validate({
    rules: {
      name: {
        required: true,
        pattern: "^[A-Za-z ]+$",
      },
      number: {
        digits: true,
        // minlength: 10,
        maxlength: 10,
      },
      no: {
        required: true,
      },
      street: {
        required: true,
      },
      city: {
        required: true,
      },
      state: {
        required: true,
      },
      zipCode: {
        digits: true,
        maxlength: 6,
      },
      country: {
        required: true,
      },
      type: {
        required: true,
      },
    },
    messages: {
      name: {
        required: "Name is required.",
        pattern: "Name must contain only letters.",
      },
      number: {
        digits: "Only digits allowed.",
        maxlength: "Number cannot exceed 10 digits.",
      },
      no: {
        required: "flat number is required.",
      },
      street: {
        required: "Fill the Street name.",
      },
      city: {
        required: "City name is required.",
      },
      state: {
        required: "State name is required.",
      },
      zipCode: {
        digits: "Only digits allowed.",
        maxlength: "Zip code cannot exceed 6 digits.",
      },
      country: {
        required: "Country name is required.",
      },
      type: {
        required: "Address type is required.",
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
      if (element.closest(".input-group").length > 0) {
        error.insertAfter(element.closest(".input-group"));
      } else {
        error.insertAfter(element);
      }
    },
  });
});

$(function () {
  $("#ChangePasswordForm").validate({
    rules: {
      currentPassword: {
        required: true,
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
      currentPassword: {
        required: "Current password is required.",
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
      if (element.closest(".form-control").last().after(error)) {
        element.parent().after(error);
      } else {
        error.insertAfter(element);
      }
    },
  });
});
