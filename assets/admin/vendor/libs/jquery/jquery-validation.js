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
