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

  //Wishlist remove (X button)
  document.body.addEventListener("click", async function (e) {
    const btn = e.target.closest(".remove-wishlist");
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
          btn.closest("tr").remove();
          showWishlistNotification(data.message);
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

    const button = document.createElement("button");
    button.textContent = "Learn More";
    button.style.padding = "8px 12px";
    button.style.background = "#ffffff";
    button.style.color = "#000000";
    button.style.border = "none";
    button.style.borderRadius = "8px";
    button.style.cursor = "pointer";
    button.style.fontSize = "13px";
    button.onclick = () => {
      window.location.href = "/wishlist";
    };

    notification.appendChild(header);
    notification.appendChild(msg);
    notification.appendChild(button);
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
