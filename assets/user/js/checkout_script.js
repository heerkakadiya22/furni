document.addEventListener("DOMContentLoaded", function () {
  const csrfToken = document.getElementById("csrfToken").value;

  // Wishlist toggle
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
