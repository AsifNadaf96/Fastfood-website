const API_BASE_URL = "http://localhost:5000";

async function loadUserOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login to view your orders.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch orders");
    }

    const orders = await res.json();
    displayOrders(orders);
  } catch (err) {
    document.getElementById("ordersList").textContent = "Error loading orders: " + err.message;
  }
}

function displayOrders(orders) {
  const container = document.getElementById("ordersList");
  container.innerHTML = "";

  if (!orders || orders.length === 0) {
    container.innerHTML = `<p class="no-orders">You have no orders yet.</p>`;
    return;
  }

  orders.forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

   card.innerHTML = `
  <div class="order-meta">
    <span class="order-number">Order #${order._id.slice(-6)}</span>
    <span class="order-date">${new Date(order.createdAt).toLocaleString()}</span>
  </div>
  <ul class="order-items">
    ${order.items.map(i => `
      <li>
        ${i.name} <span class="item-qty">x${i.quantity}</span>
        <button class="remove-btn" data-orderid="${order._id}" data-itemname="${i.name}" title="Remove item">✕</button>
      </li>
    `).join('')}
  </ul>
  <div>
    <span class="order-total">Total: ₹${order.total}</span>
    <span class="order-status">${order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}</span>
  </div>
`;

    container.appendChild(card);
  });
}

// Delegate remove button clicks to the orders container
document.getElementById("ordersList").addEventListener("click", async (event) => {
  if (event.target.classList.contains("remove-btn")) {
    const orderId = event.target.getAttribute("data-orderid");
    const itemName = event.target.getAttribute("data-itemname");
    if (!confirm(`Remove "${itemName}" from this order?`)) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login.");
      window.location.href = "login.html";
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/item/${encodeURIComponent(itemName)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Failed to remove item: " + (data.error || res.statusText));
        return;
      }

      // Reload orders after successful removal
      loadUserOrders();

    } catch (err) {
      alert("Error removing item.");
      console.error(err);
    }
  }
});


// Run when DOM ready
document.addEventListener("DOMContentLoaded", loadUserOrders);
