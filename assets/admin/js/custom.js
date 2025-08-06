$(document).ready(function () {
  $.ajax({
    url: "/getroles",
    method: "GET",
    dataType: "json",
    success: function (roles) {
      roles.sort((a, b) => b.id - a.id);
      let rows = "";
      if (roles.length > 0) {
        roles.forEach((role, index) => {
          const isActive = role.active
            ? '<i class="fas fa-check text-success"></i>'
            : '<i class="fas fa-times text-danger"></i>';
          rows += `
            <tr>
              <td>${index + 1}</td>
              <td>${role.rolename || "N/A"}</td>
              <td>${isActive}</td>
              <td>${role.description || "N/A"}</td>
              <td>
                <a class="btn btn-sm btn-info" href="/roles/${role.id}/edit">
                  <i class="fas fa-pencil-alt"></i> Edit
                </a>
             <button class="btn btn-sm btn-danger btn-delete" data-type="roles" data-id="${
               role.id
             }">
             <i class="fas fa-trash"></i> Delete
             </button>
              </td>
            </tr>
          `;
        });
      } else {
        rows = `<tr><td colspan="5" class="text-center text-muted">No roles found.</td></tr>`;
      }

      // Inject table rows
      $("#rolesTableBody").html(rows);

      // Initialize DataTable
      const table = $("#rolesTable").DataTable({
        destroy: true,
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
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
          searchPlaceholder: "Search roles...",
        },
        dom:
          "<'d-flex align-items-center justify-content-between flex-wrap mb-2 mt-2 m-3'<'custom-title'><'d-flex align-items-center ml-auto' f l <'custom-addrole'>>>" +
          "rt" +
          "<'row'<'col-md-6'i><'col-md-6'p>>",
      });

      // Custom title and Add Role button
      $("#rolesTable_wrapper .custom-title").html(
        '<h5 class="card-title m-3">All Roles</h5>'
      );
      $("#rolesTable_wrapper .custom-addrole").html(`
        <a href="/addrole" class="btn btn-primary mr-4 mt-2 mb-2">
          <i class="nav-icon fas fa-plus"></i> Add Role
        </a>
      `);
    },
    error: function () {
      $("#rolesTableBody").html(
        `<tr><td colspan="5" class="text-center text-danger">Error loading roles.</td></tr>`
      );
    },
  });
});

$(document).ready(function () {
  $.ajax({
    url: "/getCategory",
    method: "GET",
    dataType: "json",
    success: function (categories) {
      categories.sort((a, b) => b.id - a.id);
      let rows = "";
      if (categories.length > 0) {
        categories.forEach((category, index) => {
          const active = !!category.isActive
            ? '<i class="fas fa-check text-success"></i>'
            : '<i class="fas fa-times text-danger"></i>';
          rows += `
            <tr>
              <td>${index + 1}</td>
              <td>${category.name || "N/A"}</td>
              <td>${active}</td>
              <td>${category.description || "N/A"}</td>
              <td>
                <a class="btn btn-sm btn-info" href="/categories/${
                  category.id
                }/edit">
                  <i class="fas fa-pencil-alt"></i> Edit
                </a>
              <button class="btn btn-sm btn-danger btn-delete" data-type="categories" data-id="${
                category.id
              }">
              <i class="fas fa-trash"></i> Delete
              </button>
              </td>
            </tr>
          `;
        });
      } else {
        rows = `<tr><td colspan="5" class="text-center text-muted">No categories found.</td></tr>`;
      }

      // Inject table rows
      $("#categoryTableBody").html(rows);
      $("#categoryTableBody tr").each(function () {
        console.log("TD count:", $(this).find("td").length);
      });

      if ($.fn.DataTable.isDataTable("#categoryTable")) {
        $("#categoryTable").DataTable().clear().destroy();
      }

      // Initialize DataTable
      const table = $("#categoryTable").DataTable({
        destroy: true,
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
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
          searchPlaceholder: "Search category...",
        },
        dom:
          "<'d-flex align-items-center justify-content-between flex-wrap mb-2 mt-2 m-3'<'custom-title'><'d-flex align-items-center ml-auto' f l <'custom-addcategory'>>>" +
          "rt" +
          "<'row'<'col-md-6'i><'col-md-6'p>>",
      });

      // Custom title and Add category button
      $("#categoryTable_wrapper .custom-title").html(
        '<h5 class="card-title m-3">All Category</h5>'
      );
      $("#categoryTable_wrapper .custom-addcategory").html(`
        <a href="/addcategory" class="btn btn-primary mr-4 mt-2 mb-2">
          <i class="nav-icon fas fa-plus"></i> Add Category
        </a>
      `);
    },
    error: function () {
      $("#categoryTableBody").html(
        `<tr><td colspan="5" class="text-center text-danger">Error loading category.</td></tr>`
      );
    },
  });
});

const csrfToken = document.getElementById("csrfToken").value;

document.addEventListener("click", function (e) {
  const button = e.target.closest(".btn-delete");
  if (button) {
    const type = button.getAttribute("data-type"); 
    const id = button.getAttribute("data-id");

    swal({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      buttons: ["Cancel", "Yes, delete it!"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`/${type}/${id}`, {
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
            swal("Error!", "Failed to delete item.", "error");
          });
      }
    });
  }
});
