// Auto fade out alerts after 4 seconds
setTimeout(function () {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    alert.classList.remove("show");
    alert.classList.add("fade");
    setTimeout(() => {
      alert.remove();
    }, 1500);
  });
}, 4000);
