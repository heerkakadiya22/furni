$(function () {
  // Define the fields you want to target
  var requiredFields = ["name"];

  requiredFields.forEach(function (fieldName) {
    var $field = $("#roleForm").find("[name='" + fieldName + "']");
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
