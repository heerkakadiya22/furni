const form = document.getElementById("addressForm");
const addressIdInput = document.getElementById("addressId");
const stateSelect = document.getElementById("state");
const citySelect = document.getElementById("city");

const famousCities = {
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Delhi: ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
  Karnataka: ["Bengaluru", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruchirappalli",
  ],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Ghaziabad"],
};
const allowedStates = Object.keys(famousCities);

function populateStates(preselectedState = "", preselectedCity = "") {
  stateSelect.innerHTML = '<option value="">Select State</option>';
  allowedStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  if (preselectedState) {
    stateSelect.value = preselectedState;
    populateCities(preselectedState, preselectedCity);
  } else {
    citySelect.innerHTML = '<option value="">Select City</option>';
  }
}

function populateCities(stateName, preselectedCity = "") {
  citySelect.innerHTML = '<option value="">Select City</option>';
  const cities = famousCities[stateName] || [];
  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    if (city === preselectedCity) option.selected = true;
    citySelect.appendChild(option);
  });
}

stateSelect.addEventListener("change", () => {
  populateCities(stateSelect.value);

  const countryInput = document.getElementById("country");
  countryInput.value = stateSelect.value ? "India" : "";
});

function fillForm(addr) {
  addressIdInput.value = addr.id || "";
  form.name.value = addr.fullName || "";
  form.number.value = addr.number || "";
  form.no.value = addr.no || "";
  form.street.value = addr.street || "";
  form.zipCode.value = addr.zipCode || "";
  form.landMark.value = addr.landMark || "";
  form.country.value = addr.country || "";
  form.type.value = addr.type || "";
  form.isDefault.checked = !!addr.isDefault;

  populateStates(addr.state || "", addr.city || "");
}

document.querySelectorAll('input[name="selectedAddress"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.value === "new") {
      form.reset();
      addressIdInput.value = "";
      populateStates();
      return;
    }

    try {
      const addr = JSON.parse(this.dataset.addr);
      fillForm(addr);
    } catch (err) {
      console.error("Invalid address data:", err);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const defaultRadio = document.querySelector(
    'input[name="selectedAddress"]:checked'
  );
  if (defaultRadio && defaultRadio.value !== "new") {
    try {
      const addr = JSON.parse(defaultRadio.dataset.addr);
      fillForm(addr);
    } catch (err) {
      console.error("Invalid default address data:", err);
    }
  } else {
    populateStates();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const csrfToken = document.getElementById("csrfToken").value;

  document.querySelectorAll(".delete-address-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const addressId = this.dataset.id;

      const currentPath = window.location.pathname;
      const deleteUrl = currentPath.includes("checkout")
        ? `/checkout/${addressId}`
        : `/user-address/${addressId}`;

      if (confirm("Are you sure you want to delete this address?")) {
        fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              this.closest(".saved-address").remove();
            } else {
              alert(data.message || "Failed to delete address.");
            }
          })
          .catch((err) => {
            console.error(err);
            alert("Error deleting address.");
          });
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll("input[name='selectedAddress']");
  const lastSelected = localStorage.getItem("lastSelectedAddress");

  if (lastSelected) {
    const target = document.querySelector(
      `input[name='selectedAddress'][value='${lastSelected}']`
    );
    if (target) {
      target.checked = true;
    } else {
      const defaultRadio = document.querySelector(
        "input[name='selectedAddress'][data-addr*='\"isDefault\":true']"
      );
      if (defaultRadio) defaultRadio.checked = true;
    }
  }
  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
      localStorage.setItem("lastSelectedAddress", this.value);
    });
  });
});
