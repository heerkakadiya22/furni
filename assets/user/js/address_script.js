document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addressForm");
  const addressIdInput = document.getElementById("addressId");
  const stateSelect = document.getElementById("state");
  const citySelect = document.getElementById("city");
  const csrfToken = document.getElementById("csrfToken")?.value;

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

  function populateStates(state = "", city = "") {
    stateSelect.innerHTML = `<option value="">Select State</option>`;
    Object.keys(famousCities).forEach((s) => {
      stateSelect.innerHTML += `<option value="${s}">${s}</option>`;
    });

    if (state) {
      stateSelect.value = state;
      populateCities(state, city);
    } else {
      citySelect.innerHTML = `<option value="">Select City</option>`;
    }
  }

  function populateCities(state, selectedCity = "") {
    citySelect.innerHTML = `<option value="">Select City</option>`;
    (famousCities[state] || []).forEach((c) => {
      citySelect.innerHTML += `<option value="${c}" ${
        c === selectedCity ? "selected" : ""
      }>${c}</option>`;
    });
  }

  stateSelect.addEventListener("change", () => {
    populateCities(stateSelect.value);
    form.country.value = stateSelect.value ? "India" : "";
  });

  function fillForm(addr) {
    addressIdInput.value = addr.id;

    form.name.value = addr.fullName || "";
    form.number.value = addr.number || "";
    form.no.value = addr.no || "";
    form.street.value = addr.street || "";
    form.zipCode.value = addr.zipCode || "";
    form.landMark.value = addr.landMark || "";
    form.country.value = addr.country || "India";
    form.type.value = addr.type || "";
    form.isDefault.checked = !!addr.isDefault;

    populateStates(addr.state, addr.city);
  }

  function resetFormForNew() {
    form.reset();
    addressIdInput.value = "";
    populateStates();
  }

  const radios = document.querySelectorAll('input[name="selectedAddress"]');

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      localStorage.setItem("selectedAddress", radio.value);

      if (radio.value === "new") {
        resetFormForNew();
        return;
      }

      const addr = JSON.parse(radio.dataset.addr);
      fillForm(addr);

      addressIdInput.value = radio.value;
    });
  });

  const saved = localStorage.getItem("selectedAddress");

  let radioToSelect =
    (saved &&
      document.querySelector(
        `input[name="selectedAddress"][value="${saved}"]`
      )) ||
    document.querySelector('input[name="selectedAddress"]:checked') ||
    document.querySelector('input[name="selectedAddress"][value="new"]');

  if (radioToSelect) {
    radioToSelect.checked = true;
    radioToSelect.dispatchEvent(new Event("change"));
  }

  document.querySelectorAll(".delete-address-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const addressId = btn.dataset.id;
      const deleteUrl = location.pathname.includes("checkout")
        ? `/checkout/${addressId}`
        : `/user-address/${addressId}`;

      Swal.fire({
        title: "Delete address?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
      }).then(async (result) => {
        if (!result.isConfirmed) return;

        const res = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
        });

        const data = await res.json();
        if (data.success) {
          btn.closest(".saved-address")?.remove();
          Swal.fire("Deleted", "Address removed", "success");
        } else {
          Swal.fire("Error", data.message || "Delete failed", "error");
        }
      });
    });
  });
});
