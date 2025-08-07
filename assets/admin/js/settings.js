function confirmDeleteIcon(platform) {
  swal({
    title: `Delete ${platform} icon?`,
    text: "This will remove the icon from settings.",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content");

      fetch(`/setting/icon/${platform}`, {
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
