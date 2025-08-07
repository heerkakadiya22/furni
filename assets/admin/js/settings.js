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
