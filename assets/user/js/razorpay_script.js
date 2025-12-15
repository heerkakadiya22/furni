document.getElementById("payBtn").addEventListener("click", async () => {
  const csrf = document.getElementById("csrfToken").value;

  const payBtn = document.getElementById("payBtn");
  const key = payBtn.dataset.key;

  let selectedRadio = document.querySelector(
    "input[name='selectedAddress']:checked"
  );
  let addressId = selectedRadio?.value;

  if (!addressId) {
    addressId = document.getElementById("defaultAddressId")?.value;

    if (!addressId) {
      alert("No address selected and no default address found.");
      return;
    }
  }

  const orderRes = await fetch("/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrf,
    },
    body: JSON.stringify({ address_id: addressId }),
  });

  console.log(orderRes);

  const order = await orderRes.json();
  if (!order.id) return alert("Order creation failed");

  new Razorpay({
    key,
    order_id: order.id,
    amount: order.amount,
    currency: "INR",
    theme: {
      color: "#3b5d50",
    },
    handler: async (response) => {
      sendStatus("success", response);
    },

    modal: {
      ondismiss: function () {
        sendStatus("failed");
      },
    },
  }).open();

  async function sendStatus(type, response = {}) {
    const verifyRes = await fetch("/verify-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrf,
      },
      body: JSON.stringify({
        statusType: type,
        ...response,
        address_id: addressId,
      }),
    });

    const result = await verifyRes.json();

    if (result.success) {
      window.location.href = `/thanks?invoice=${result.invoice_id}`;
    } else {
      window.location.href = `/payment-failed?invoice=${result.invoice_id}`;
    }
  }
});
