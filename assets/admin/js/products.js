$(document).ready(function () {
  $.ajax({
    url: "/getproducts",
    method: "GET",
    dataType: "json",
    success: function (products) {
      products.sort((a, b) => b.id - a.id);
      let rows = "";

      if (products.length > 0) {
        products.forEach((product, index) => {
          const category = product.category?.name || "N/A";
          const descriptionText = product.description || "N/A";
          const oldPrice = product.oldPrice ? `₹${product.oldPrice}` : "N/A";
          const newPrice = product.newPrice ? `₹${product.newPrice}` : "N/A";
          const color = product.color || "N/A";
          const tags = product.tags || "N/A";
          const isActive = product.isActive
            ? '<i class="fas fa-check text-success"></i>'
            : '<i class="fas fa-times text-danger"></i>';

          const mainImgTag = product.main_img
            ? `<img src="/assets/admin/img/products/${product.main_img}" class="product-img" alt="main" height="40px" width="40px" />`
            : `<span class="text-muted">No image</span>`;
          // const subImgTag = product.sub_img
          //   ? `<img src="${product.sub_img}" class="product-img" alt="sub" />`
          //   : `<span class="text-muted">No image</span>`;
          rows += `
  <tr>
    <td>${index + 1}</td>
    <td>${category}</td>
    <td><strong>${product.name || "N/A"}</strong></td>
    <td>
  ${
    product.description
      ? `
        <div class="product-description" id="desc-${product.id}">
          ${descriptionText}
        </div>
        ${
          descriptionText.length > 100
            ? `<a href="javascript:void(0);" class="toggle-desc text-primary" data-id="${product.id}">Show more</a>`
            : ""
        }
      `
      : `<span class="text-muted">N/A</span>`
  }
</td>

    <td>${mainImgTag}</td>
    <td>${oldPrice}</td>
    <td>${newPrice}</td>
    <td>${color}</td>
    <td>${tags}</td>
    <td>${isActive}</td>
    <td>
      <a class="btn btn-sm btn-info" href="/products/${product.id}/edit" >
        <i class="fas fa-pencil-alt"></i> Edit
      </a>
      <button class="btn btn-sm btn-danger btn-delete-product" data-id="${
        product.id
      }">
        <i class="fas fa-trash"></i> Delete
      </button>
    </td>
  </tr>
`;
        });
      } else {
        rows = `<tr><td colspan="11" class="text-center text-muted">No products found.</td></tr>`;
      }

      $("#productTableBody").html(rows);

      const table = $("#productTable").DataTable({
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
          searchPlaceholder: "Search products...",
          emptyTable: "No products found.",
        },
        dom:
          "<'d-flex align-items-center justify-content-between flex-wrap mb-2 mt-2 m-3'<'custom-title'><'d-flex align-items-center ml-auto' f l <'custom-addproduct'>>>" +
          "rt" +
          "<'row'<'col-md-6'i><'col-md-6'p>>",
      });

      $("#productTable_wrapper .custom-title").html(
        '<h5 class="card-title m-3">All Products</h5>'
      );
      $("#productTable_wrapper .custom-addproduct").html(`
        <a href="/addproduct" class="btn btn-primary mr-4 mt-2 mb-2">
          <i class="nav-icon fas fa-plus"></i> Add Product
        </a>
      `);
    },
  });
});

$(document).on("click", ".toggle-desc", function () {
  const id = $(this).data("id");
  const descDiv = $(`#desc-${id}`);

  if (descDiv.hasClass("expanded")) {
    descDiv.removeClass("expanded");
    $(this).text("Show more");
  } else {
    descDiv.addClass("expanded");
    $(this).text("Show less");
  }
});

//delete handle
const csrfToken = document.getElementById("csrfToken").value;

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-delete-product");
  if (!btn) return;

  const productId = btn.dataset.id;
  const confirm = await swal({
    title: "Delete product?",
    text: "This action cannot be undone!",
    icon: "warning",
    buttons: ["Cancel", "Yes"],
    dangerMode: true,
  });

  if (!confirm) return;

  try {
    const res = await fetch(`/products/${productId}`, {
      method: "DELETE",
      headers: { "CSRF-Token": csrfToken },
    });

    const data = await res.json();

    swal(
      data.success ? "Deleted!" : "Error!",
      data.message,
      data.success ? "success" : "error"
    ).then(() => data.success && btn.closest("tr").remove());
  } catch {
    swal("Error!", "Failed to delete product.", "error");
  }
});
