document.addEventListener("DOMContentLoaded", function () {
  const csrfToken = document.getElementById("csrfToken").value;

  //Wishlist toggle
  document.body.addEventListener("click", async function (e) {
    const btn = e.target.closest(".wishlist-btn");
    if (btn) {
      e.preventDefault();

      if (!window.isLoggedIn) {
        window.location.href = "/auth";
        return;
      }

      const sku = btn.dataset.sku;

      try {
        const res = await fetch("/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ sku }),
        });

        if (res.ok) {
          const data = await res.json();
          const icon = btn.querySelector("i");

          if (data.action === "added") {
            icon.classList.remove("bi-heart");
            icon.classList.add("bi-heart-fill");
            icon.style.color = "#3b5d50";
            showWishlistNotification("Product added to wishlist!");
          } else {
            icon.classList.remove("bi-heart-fill");
            icon.classList.add("bi-heart");
            icon.style.color = "";
            showWishlistNotification("Product removed from wishlist!");
          }
        } else {
          console.error("Failed to toggle wishlist");
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Remove from wishlist page
  document.body.addEventListener("click", async function (e) {
    const btn = e.target.closest([".remove-wishlist", ".add-to-cart"]);
    if (btn) {
      e.preventDefault();

      const sku = btn.dataset.sku;

      try {
        const res = await fetch(`/wishlist/${sku}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": csrfToken,
          },
        });

        const data = await res.json();

        if (res.ok) {
          const row = btn.closest("tr");
          const wishlistTable = document.querySelector("#wishlistTable");

          row.remove();

          if (wishlistTable.querySelectorAll("tr").length === 0) {
            wishlistTable.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              Product not found in wishlist
            </td>
          </tr>
        `;
          }

          if (btn.classList.contains("add-to-cart")) {
            showWishlistNotification("Added to cart!");
          } else {
            showWishlistNotification(data.message);
          }
        } else {
          alert(data.message || "Failed to remove product");
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  //Notification function
  function showWishlistNotification(message) {
    const audio = new Audio("/assets/user/images/sound/notification.mp3");
    audio.play().catch((err) => console.log("Audio play blocked:", err));

    const existing = document.querySelector(".wishlist-notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = "wishlist-notification";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.width = "280px";
    notification.style.background = "#3b5d50";
    notification.style.color = "#fff";
    notification.style.padding = "16px";
    notification.style.borderRadius = "12px";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    notification.style.zIndex = "9999";
    notification.style.display = "flex";
    notification.style.flexDirection = "column";
    notification.style.gap = "10px";
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";

    const title = document.createElement("span");
    title.style.fontWeight = "bold";
    title.style.fontSize = "14px";
    title.textContent = "Wishlist Update";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => notification.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);

    const msg = document.createElement("div");
    msg.style.fontSize = "13px";
    msg.textContent = message;

    notification.appendChild(header);
    notification.appendChild(msg);
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
});

// Shop page filtering
document.addEventListener("DOMContentLoaded", () => {
  const searchBox = document.getElementById("searchBox");
  const categoryBtn = document.getElementById("categoryBtn");
  const categoryMenu = document.getElementById("categoryMenu");
  const filterBtn = document.getElementById("filterBtn");
  const products = document.querySelectorAll(".product-item-wrapper");

  if (
    searchBox &&
    categoryBtn &&
    categoryMenu &&
    filterBtn &&
    products.length > 0
  ) {
    let selectedCategory = "all";

    categoryMenu.addEventListener("click", (e) => {
      if (e.target.dataset.category) {
        selectedCategory = e.target.dataset.category.toLowerCase();
        categoryBtn.textContent = e.target.textContent;
      }
    });

    function filterProducts() {
      const searchValue = searchBox.value.toLowerCase();

      products.forEach((product) => {
        const name = product.dataset.name.toLowerCase();
        const category = product.dataset.category?.toLowerCase();

        const matchesSearch = name.includes(searchValue);
        const matchesCategory =
          selectedCategory === "all" || category === selectedCategory;

        product.style.display =
          matchesSearch && matchesCategory ? "block" : "none";
      });
    }

    filterBtn.addEventListener("click", filterProducts);
    searchBox.addEventListener("input", filterProducts);
  }
});
