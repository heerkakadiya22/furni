document.getElementById("payBtn").addEventListener("click", async () => {
  const csrf = document.getElementById("csrfToken").value;

  const payBtn = document.getElementById("payBtn");
  const key = payBtn.dataset.key;

  const selectedRadio = document.querySelector(
    'input[name="selectedAddress"]:checked'
  );

  const addressId =
    selectedRadio && selectedRadio.value !== "new" ? selectedRadio.value : null;

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
    name: "Furni.",
    image: "/assets/user/images/logo.png",
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
      window.location.href = `/payment-failed?order=${result.order_id}`;
    }
  }
});
