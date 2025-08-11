function confirmDeleteIcon(platform) {
  swal({
    title: `Delete ${platform}?`,
    text: "This will remove the data from settings.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      const generalFields = [
        "email",
        "phone",
        "location",
        "sitename_logo",
        "logo",
      ];
      const isGeneral = generalFields.includes(platform);
      const endpoint = isGeneral
        ? `/setting/general/${platform}`
        : `/setting/icon/${platform}`;

      fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            swal("Deleted!", {
              icon: "success",
            }).then(() => location.reload());
          } else {
            swal("Error", data.error || "Failed to delete.", "error");
          }
        })
        .catch((err) => {
          console.error(err);
          swal("Error", "Server error occurred.", "error");
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  new FroalaEditor(".rich-editor", {
    height: 300,
    toolbarSticky: true,
    toolbarButtons: [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "|",
      "formatUL",
      "formatOL",
      "|",
      "insertLink",
      "insertImage",
      "|",
      "undo",
      "redo",
      "html",
    ],
  });
});

function confirmDeleteTermsField(field) {
  swal({
    title: `Delete ${field}?`,
    text: "This will permanently remove the content for this field.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      fetch(`/setting/terms-privacy/${field}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .content,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            swal("Deleted!", data.message, "success").then(() =>
              location.reload()
            );
          } else {
            swal("Error", data.error || "Something went wrong.", "error");
          }
        })
        .catch((err) => {
          swal("Error", err.message, "error");
        });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const picker = document.getElementById("themeColorPicker");
  const preview = document.querySelector(".modal-body #themeColorPreview");
  const valueText = document.getElementById("themeColorValue");

  if (picker) {
    picker.addEventListener("input", function () {
      preview.style.backgroundColor = picker.value;
      valueText.textContent = picker.value;
    });
  }
});
