$(document).ready(function () {
  $.ajax({
    url: "/getusers",
    method: "GET",
    dataType: "json",
    success: function (users) {
      users.sort((a, b) => b.id - a.id);
      let rows = "";

      if (users.length > 0) {
        users.forEach((user, index) => {
          const gender = user.gender ? user.gender : "N/A";
          const dob = user.dob
            ? new Date(user.dob).toLocaleDateString()
            : "N/A";
          const hobby = user.hobby || "N/A";
          const role = user.role?.rolename || "N/A";
          const emailPhone = `${user.email || "N/A"}<br>
          <small>${user.phone || ""}</small>`;
          const imageTag = `<img src="${user.image}" class="user-img" alt="profile" />`;

          rows += `
            <tr>
              <td>${index + 1}</td>
              <td>
                ${imageTag}
                <strong>${user.name || "N/A"}</strong>
              </td>
              <td>${emailPhone}</td>
              <td>${user.username || "N/A"}</td>
              <td>${dob}<br><small>${gender}</small></td>
              <td>${hobby}</td>
              <td>${role}</td>
              <td>
                <a class="btn btn-sm btn-info" href="/users/${user.id}/edit">
                  <i class="fas fa-pencil-alt"></i> Edit
                </a>
                <button class="btn btn-sm btn-danger btn-delete-user" data-id="${
                  user.id
                }">
                  <i class="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          `;
        });
      } else {
        rows = `<tr><td colspan="8" class="text-center text-muted">No users found.</td></tr>`;
      }

      $("#usersTableBody").html(rows);

      // Initialize DataTable
      const table = $("#usersTable").DataTable({
        destroy: true,
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: false,
        order: [[0, "asc"]],
        info: true,
        autoWidth: false,
        responsive: true,
        pageLength: 5,
        lengthMenu: [
          [5, 10, 25, 50],
          [5, 10, 25, 50],
        ],
        language: {
          lengthMenu: "_MENU_",
          searchPlaceholder: "Search users...",
        },
        dom:
          "<'d-flex align-items-center justify-content-between flex-wrap mb-2 mt-2 m-3'<'custom-title'><'d-flex align-items-center ml-auto' f l <'custom-adduser'>>>" +
          "rt" +
          "<'row'<'col-md-6'i><'col-md-6'p>>",
      });

      // Custom title and Add User button
      $("#usersTable_wrapper .custom-title").html(
        '<h5 class="card-title m-3">All Users</h5>'
      );
      $("#usersTable_wrapper .custom-adduser").html(`
        <a href="/adduser" class="btn btn-primary mr-4 mt-2 mb-2">
          <i class="nav-icon fas fa-plus"></i> Add User
        </a>
      `);
    },
    error: function () {
      $("#usersTableBody").html(
        `<tr><td colspan="8" class="text-center text-danger">Error loading users.</td></tr>`
      );
    },
  });
});

// Handle Delete
const csrfToken = document.getElementById("csrfToken").value;

document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-delete-user")) {
    const button = e.target.closest(".btn-delete-user");
    const userId = button.getAttribute("data-id");

    swal({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      buttons: ["Cancel", "Yes, delete it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              swal("Deleted!", data.message, "success").then(() => {
                button.closest("tr").remove();
              });
            } else {
              swal("Error!", data.message, "error");
            }
          })
          .catch((err) => {
            console.error("Delete failed:", err);
            swal("Error!", "Failed to delete user.", "error");
          });
      }
    });
  }
});