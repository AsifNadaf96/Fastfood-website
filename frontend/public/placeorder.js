document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  logoutBtn.style.display = 'inline-block';
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const foodItem = document.getElementById('foodItem').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    if (!foodItem || quantity <= 0) {
      document.getElementById('message').textContent = "Please enter valid food item and quantity.";
      return;
    }

    const pricePerItem = 100; // Adjust or fetch price dynamically
    const total = pricePerItem * quantity;

    const orderData = {
      items: [{ name: foodItem, quantity: quantity, price: pricePerItem }],
      total: total
    };

    try {
      const res = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      document.getElementById('message').textContent = res.data.message || 'Order placed successfully!';
      document.getElementById('orderForm').reset();
    } catch (err) {
      document.getElementById('message').textContent = err.response?.data?.error || 'Error placing order.';
    }
  });
});
