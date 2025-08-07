const API_BASE_URL = "http://localhost:5000";

function placeOrder(itemName, itemPrice) {
  const orderData = {
    item: itemName,
    price: itemPrice,
    customer: "Guest User", // Or replace with real user name
    status: "pending"
  };

  fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  })
  .then(response => response.json())
  .then(data => {
    alert(`Order placed for ${itemName}!`);
    console.log(data);
  })
  .catch(error => {
    alert("Failed to place order.");
    console.error(error);
  });
}



 
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const searchWrapper = document.getElementById("searchWrapper");
 const searchBtn = document.querySelector(".search-btn");

  const searchInput = document.querySelector(".search-box");
  const menuItems = document.querySelectorAll(".menu-item");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  // Toggle expand class and focus input
  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevents document click from immediately closing it
    searchWrapper.classList.toggle("expanded");
    if (searchWrapper.classList.contains("expanded")) {
      searchInput.focus();
    }
  });

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchWrapper.contains(e.target)) {
      searchWrapper.classList.remove("expanded");
    }
  })

  // Live search filter
  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.toLowerCase();
    menuItems.forEach(item => {
      const title = item.querySelector("h3").textContent.toLowerCase();
      item.style.display = title.includes(searchValue) ? "" : "none";
    });
  })