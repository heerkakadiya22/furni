// Function to handle required fields in role forms
$(function () {
  var requiredFields = ["name"];

  requiredFields.forEach(function (fieldName) {
    var $field = $("#roleForm, #categoryForm").find(
      "[name='" + fieldName + "']"
    );
    var id = $field.attr("id");

    if (id) {
      // Create the asterisk span
      var $asterisk = $(
        '<span class="required-star" style="color:red; margin-left:3px">*</span>'
      );

      // Append it to the label
      $("label[for='" + id + "']").append($asterisk);

      // Show or hide based on initial value
      if ($field.val().trim() !== "") {
        $asterisk.hide();
      }

      // Listen to input changes
      $field.on("input change", function () {
        if ($field.val().trim() === "") {
          $asterisk.fadeIn();
        } else {
          $asterisk.fadeOut();
        }
      });
    }
  });
});

// Function to handle required fields in user forms
$(function () {
  var requiredFields = [
    "name",
    "email",
    "username",
    "password",
    "confirmPassword",
  ];

  requiredFields.forEach(function (fieldName) {
    var $field = $("#userForm, #editProfileForm").find(
      "[name='" + fieldName + "']"
    );
    var id = $field.attr("id");

    if (id) {
      // Create the asterisk span
      var $asterisk = $(
        '<span class="required-star" style="color:red; margin-left:3px">*</span>'
      );

      // Append it to the label
      $("label[for='" + id + "']").append($asterisk);

      // Show or hide based on initial value
      if ($field.val().trim() !== "") {
        $asterisk.hide();
      }

      // Listen to input changes
      $field.on("input change", function () {
        if ($field.val().trim() === "") {
          $asterisk.fadeIn();
        } else {
          $asterisk.fadeOut();
        }
      });
    }
  });
});

// Function to handle image upload and preview
document.getElementById("imageUpload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("previewImg").src = e.target.result;
  };
  reader.readAsDataURL(this.files[0]);
});

// Function to remove alert after 5 seconds
setTimeout(() => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.classList.remove("show");
    alert.classList.add("fade");

    setTimeout(() => {
      alert.remove();
    }, 300);
  }
}, 5000);

// Function to toggle password visibility
function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}


