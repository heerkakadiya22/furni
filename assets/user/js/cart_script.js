// Quantity selector
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("qty-btn")) {
    const container = e.target.closest(".quantity-container");
    const input = container.querySelector(".qty-input");
    let value = parseInt(input.value) || 1;

    if (e.target.classList.contains("increase")) value++;
    else if (e.target.classList.contains("decrease"))
      value = Math.max(1, value - 1);

    input.value = value;
  }
});

// Input validation
document.addEventListener("input", function (e) {
  if (e.target.classList.contains("qty-input")) {
    let value = e.target.value.replace(/\D/g, "");
    e.target.value = value === "" || parseInt(value) < 1 ? 1 : value;
  }
});

// Notification function
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

// Add to Cart
document.getElementById("addToCartBtn").addEventListener("click", async () => {
  const csrfToken = document.getElementById("csrfToken").value;
  const btn = document.getElementById("addToCartBtn");
  const container = btn.closest(".product-detail") || document;
  const qtyInput = container.querySelector(".qty-input");

  const productData = {
    productId: btn.dataset.id,
    quantity: parseInt(qtyInput.value) || 1,
  };

  console.log("Sending add to cart request:", productData);

  try {
    const response = await fetch("/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,
      },
      body: JSON.stringify(productData),
    });

    console.log("Fetch response status:", response.status);

    const result = await response.json();
    console.log("Response JSON:", result);

    if (result.success)
      showCartNotification(`Added ${productData.quantity} item(s) to cart!`);
    else showCartNotification(result.message);
  } catch (err) {
    console.error("Fetch ERROR:", err);
    showCartNotification("Something went wrong while adding product.");
  }
});
