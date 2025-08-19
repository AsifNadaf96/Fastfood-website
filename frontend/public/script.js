const API_BASE_URL = "http://localhost:5000"; // Change if backend hosted elsewhere

document.addEventListener("DOMContentLoaded", () => {
  updateNavbarUserIcon();
  loadMenuItems();
  setupSearchFilter();
});

/* ===== Update Navbar User Icon / Dropdown ===== */
function updateNavbarUserIcon() {
  const userIconNav = document.getElementById("userIconNav");
  const username = localStorage.getItem("username");

  if (username) {
    // Create the icon + dropdown menu
    userIconNav.innerHTML = `
      <div class="user-dropdown">
        <div class="user-icon" title="${username}">
          ${username.charAt(0).toUpperCase()}
        </div>
        <div class="dropdown-menu">
          <a href="profile.html">Profile</a>
          <a href="orders.html">My Orders</a>
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    `;

    // Toggle dropdown on icon click
    document.querySelector(".user-icon").addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click close
      document.querySelector(".user-dropdown").classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      const dropdown = document.querySelector(".user-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    });

    // Logout functionality
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html";
    });
  } else {
    // Show login link if not logged in
    userIconNav.innerHTML = `<a href="login.html">LOGIN</a>`;
  }
}

/* ===== Load and Display Menu Items ===== */
function loadMenuItems() {
  fetch(`${API_BASE_URL}/api/menu`)
    .then(res => res.json())
    .then(items => {
      const grid = document.querySelector(".menu-grid");
      grid.innerHTML = "";

      items.forEach(item => {
        const imageUrl = `images/${item.image}`; // from public/images

        const div = document.createElement("div");
        div.className = "menu-item";
        div.id = `menuItem_${item._id}`; // Use unique ID from DB
        div.style.backgroundImage = `url('${imageUrl}')`;

        // HTML matches your CSS: price above order button
        div.innerHTML = `
          <div class="menu-overlay">
            <h3>${item.name}</h3>
            <p>${item.description || ""}</p>
            <strong>₹${item.price}</strong>
            <button onclick="checkLoginAndOrder('${item._id}', '${item.name}', ${item.price})">Order</button>
          </div>
        `;
        grid.appendChild(div);
      });
    })
    .catch(err => console.error("Error loading menu:", err));
}

/* ===== Search Filter ===== */
function setupSearchFilter() {
  const searchInput = document.querySelector(".search-box");
  if (!searchInput) return;

  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    document.querySelectorAll(".menu-item").forEach(itemDiv => {
      const name = itemDiv.querySelector("h3")?.textContent.toLowerCase() || "";
      const description = itemDiv.querySelector("p")?.textContent.toLowerCase() || "";
      if (name.includes(searchTerm) || description.includes(searchTerm)) {
        itemDiv.style.display = "";
      } else {
        itemDiv.style.display = "none";
      }
    });
  });
}

/* ===== Check Login Before Ordering and Place Order ===== */
function checkLoginAndOrder(itemId, name, price) {
  if (!localStorage.getItem("token")) {
    alert("Please log in to place an order.");
    window.location.href = "login.html";
    return;
  }

  const orderData = {
    items: [{ name: name, quantity: 1, price: price }],
    total: price
  };

  fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(orderData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert("Failed to place order: " + data.error);
      return;
    }
    alert("Order placed successfully!");
   
    window.location.href = "index.html";
  })
  .catch(err => {
    alert("Error placing order. Please try again.");
    console.error(err);
  });
}
