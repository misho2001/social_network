
const form = document.getElementById("loginForm");
const forgot = document.getElementById("forgot");
const create = document.getElementById("create");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: "same-origin",
      body: JSON.stringify({ email, password })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      alert(data.message || "Login failed. Please try again.");
      return;
    }

    if (data.success) {
      alert("Login successful!");
      form.reset();
    } else {
      alert(data.message || "Login failed.");
    }
  } catch (error) {
    console.error("Login request failed:", error);
    alert("Could not connect to the server. Please try again.");
  }
});

forgot.addEventListener("click", (event) => {
  event.preventDefault();
  alert("Password recovery is not configured yet.");
});

create.addEventListener("click", (event) => {
  event.preventDefault();
  alert("Account registration is not configured yet.");
});
