document.addEventListener("DOMContentLoaded", function () {
  const csrfToken = document.getElementById("csrfToken").value;

  document.body.addEventListener("click", async function (e) {
    const btn = e.target.closest(".btn-block");
    if (btn) {
      e.preventDefault();

      if (!window.isLoggedIn) {
        window.location.href = "/auth";
        return;
      }

      const id = btn.dataset.id;

      try {
        const res = await fetch("/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) {
          console.error("Failed to checkout");
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartItems = JSON.parse(checkoutBtn.dataset.cart || "[]");

  checkoutBtn.addEventListener("click", function () {
    if (!cartItems || cartItems.length === 0) {
      const popup = document.createElement("div");
      popup.innerText = "Your cart is empty! Redirecting to shop...";
      popup.style.position = "fixed";
      popup.style.top = "20px";
      popup.style.right = "20px";
      popup.style.background = "#ffc107";
      popup.style.color = "#000";
      popup.style.padding = "15px 25px";
      popup.style.borderRadius = "5px";
      popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
      popup.style.opacity = "0";
      popup.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      popup.style.transform = "translateY(-20px)";
      document.body.appendChild(popup);

      setTimeout(() => {
        popup.style.opacity = "1";
        popup.style.transform = "translateY(0)";
      }, 50);

      setTimeout(() => {
        window.location.href = "/shop";
      }, 10000);
    } else {
      window.location.href = "/checkout";
    }
  });
});
