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

function togglePassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}
