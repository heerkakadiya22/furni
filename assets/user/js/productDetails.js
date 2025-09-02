const csrfToken = document.getElementById("csrfToken").value;
document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", async function (e) {
    const btn = e.target.closest(".wishlist-btn");
    if (!btn) return;

    if (!window.isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    const sku = btn.dataset.sku;

    try {
      const res = await fetch("/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ sku }),
      });

      if (res.ok) {
        const icon = btn.querySelector("i");
        if (icon) {
          icon.classList.remove("bi-heart");
          icon.classList.add("bi-heart-fill");
          icon.style.color = "red";
        }

        showWishlistNotification("Product added to wishlist!");
      } else {
        console.error("Failed to add to wishlist");
      }
    } catch (err) {
      console.error(err);
    }
  });

  function showWishlistNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#343a40";
    notification.style.color = "#fff";
    notification.style.padding = "10px 16px";
    notification.style.borderRadius = "8px";
    notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    notification.style.zIndex = 9999;
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = "1";
    }, 10);

    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
});
