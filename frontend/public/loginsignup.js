const API_BASE_URL = "http://localhost:5000"; // backend URL

// === LOGIN ===
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    // ✅ Check by res.ok or token instead of relying only on "success"
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      if (data.user && data.user.username) {
        localStorage.setItem("username", data.user.username);
      }
      localStorage.setItem("isAdmin", data.user?.isAdmin || false);

      // ✅ Redirect to homepage (absolute path ensures correct location)
      window.location.href = "index.html";

    } else {
      alert(data.error || "Invalid login credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong during login.");
  }
});

// === REGISTER ===
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("regUsername").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Automatically login after register
      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.token) {
        localStorage.setItem("token", loginData.token);
        if (loginData.user && loginData.user.username) {
          localStorage.setItem("username", loginData.user.username);
        }
        localStorage.setItem("isAdmin", loginData.user?.isAdmin || false);
        window.location.href = "index.html";

      } else {
        alert(loginData.error || "Login after register failed.");
      }
    } else {
      alert(data.error || "Registration failed.");
    }
  } catch (err) {
    console.error("Register error:", err);
    alert("Something went wrong during registration.");
  }
});
