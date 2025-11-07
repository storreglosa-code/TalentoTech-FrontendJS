const API_BASE = "https://localhost:7163"; // igual que en index
const token = localStorage.getItem("accessToken");
const userName = localStorage.getItem("userName");

const cartContainer = document.getElementById("cartContainer");
const totalEl  = document.getElementById("total");
const confirmBtn  = document.getElementById("confirmOrderBtn");

let cart = JSON.parse(localStorage.getItem("cart") || "[]");



function renderCart() {
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    totalEl.textContent = "";
    confirmBtn.disabled = true;
    return;
  }

  confirmBtn.disabled = false;
  cartContainer.innerHTML = "";

  cart.forEach((item, i) => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong> - $${item.price} x 
        <input type="number" min="1" value="${item.qty}" onchange="updateQty(${i}, this.value)">
        = $${(item.price * item.qty).toFixed(2)}
        <button onclick="removeItem(${i})">Eliminar</button>
      </div>
    `;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function updateQty(index, qty) {
  cart[index].qty = parseInt(qty);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

confirmBtn.addEventListener("click", confirmOrder);

async function confirmOrder() {
  try {
    const order = {
    orderNumber: Math.floor(Math.random() * 1000000),
    clientId: localStorage.getItem(""), // después lo vas a obtener del JWT
    orderDate: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    orderDetails: cart.map(c => ({
      orderId: 0, // el backend lo rellena
      productId: c.id,
      quantity: c.qty
    }))
  };

    const res = await fetch(`${API_BASE}/api/Orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(order)
    });

    if (!res.ok) {
      alert("Error al crear la orden.");
      return;
    }

    alert("Orden registrada con éxito ✅");
    localStorage.removeItem("cart");
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    alert("Error de red al enviar la orden");
  }
}

renderCart();


