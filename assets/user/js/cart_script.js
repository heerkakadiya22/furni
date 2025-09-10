// ===============================
// CART SCRIPT
// ===============================

// Quantity buttons inside cart table
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("qty-btn")) {
    const input = e.target
      .closest(".quantity-container")
      .querySelector(".qty-input");
    let value = parseInt(input.value) || 1;

    if (e.target.classList.contains("increase")) value++;
    else if (e.target.classList.contains("decrease"))
      value = Math.max(1, value - 1);

    input.value = value;

    // If we are on cart page (row exists)
    const row = e.target.closest("tr[data-id]");
    if (row) {
      const productId = row.dataset.id;
      const price = parseFloat(row.dataset.price);
      const csrfToken = document.getElementById("csrfToken").value;

      try {
        await updateCart(productId, value, csrfToken);
        row.querySelector(".row-subtotal").textContent = formatCurrency(
          price * value
        );
        recalcCartTotals();
      } catch (err) {
        console.error("Cart update failed:", err);
      }
    }
  }
});

// Input validation: only numbers allowed
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("qty-input")) {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value === "" || parseInt(value) < 1 ? 1 : value;
  }
});

// Add to Cart from product details page
const addBtn = document.getElementById("addToCartBtn");
if (addBtn) {
  addBtn.addEventListener("click", async () => {
    const csrfToken = document.getElementById("csrfToken").value;
    const container = addBtn.closest(".product-detail") || document;
    const qtyInput = container.querySelector(".qty-input");

    const productData = {
      productId: addBtn.dataset.id,
      quantity: parseInt(qtyInput.value) || 1,
    };

    try {
      const response = await fetch("/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        showCartNotification(`Added ${productData.quantity} item(s) to cart!`);
      } else {
        showCartNotification(result.message || "Failed to add item.");
      }
    } catch (err) {
      console.error("Add to cart ERROR:", err);
      showCartNotification("Something went wrong while adding product.");
    }
  });
}

// ===============================
// Helper Functions
// ===============================

// Send update request to backend
async function updateCart(productId, quantity, csrfToken) {
  try {
    const response = await fetch("/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const result = await response.json();
    if (result.success) {
      showCartNotification("Cart updated!");
    } else {
      showCartNotification(result.message || "Update failed");
    }
  } catch (err) {
    console.error("Cart update ERROR:", err);
    showCartNotification("Something went wrong while updating cart.");
  }
}


function recalcCartTotals() {
  let subtotal = 0;
  document.querySelectorAll("tr[data-id]").forEach((row) => {
    const price = parseFloat(row.dataset.price);
    const qty = parseInt(row.querySelector(".qty-input").value) || 1;
    subtotal += price * qty;
  });

  const total = subtotal;

  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = formatCurrency(total);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

// Show notification
function showCartNotification(message) {
  const audio = new Audio("/assets/user/images/sound/notification.mp3");
  audio.play().catch((err) => console.log("Audio play blocked:", err));

  const existing = document.querySelector(".cart-notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = "cart-notification";
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
  title.textContent = "Cart Update";

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
