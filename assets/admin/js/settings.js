document.addEventListener("DOMContentLoaded", function () {
  const csrfToken = document.getElementById("csrfToken")?.value;

  document.querySelectorAll(".delete-social").forEach((button) => {
    button.addEventListener("click", function () {
      const platform = button.getAttribute("data-platform");

      swal({
        title: "Are you sure?",
        text: `This will remove the ${platform} social icon.`,
        icon: "warning",
        buttons: ["Cancel", "Yes, delete it!"],
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          fetch(`/settings/social/${platform}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "CSRF-Token": csrfToken,
            },
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.message) {
                swal("Deleted!", data.message, "success").then(() => {
                  // Option 1: Reload to update view
                  location.reload();

                  // Option 2 (optional): remove icon block without reload
                  // button.closest(".d-flex.mb-3.mt-4").remove();
                });
              } else {
                swal("Error!", data.error || "Something went wrong", "error");
              }
            })
            .catch((err) => {
              console.error("Delete error:", err);
              swal("Error!", "Failed to delete the social icon.", "error");
            });
        }
      });
    });
  });
});

document.getElementById("addSocialBtn").addEventListener("click", () => {
  document.getElementById("socialForm").action = "/settings/social";
  document.getElementById("platform").disabled = false;
  document.getElementById("platform").value = "facebook";
  document.getElementById("platformHidden").value = "facebook";
  document.getElementById("iconClass").value = "";
  document.getElementById("link").value = "";
  document.getElementById("submitSocialBtn").textContent = "Add";
});
