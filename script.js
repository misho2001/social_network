const form = document.getElementById("loginForm");
const forgot = document.getElementById("forgot");
const create = document.getElementById("create");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    // მოთხოვნის გაგზავნა Java Spring Boot სერვერზე
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      alert("მონაცემები წარმატებით შეინახა TiDB ბაზაში!");
      // სურვილისამებრ შეგიძლიათ ფორმის გასუფთავება:
      form.reset();
    } else {
      alert("შეცდომა: " + (data.message || "ვერ მოხერხდა შენახვა"));
    }
  } catch (error) {
    console.error("Network Error:", error);
    alert("სერვერთან კავშირის შეცდომა! დარწმუნდით, რომ Spring Boot სერვერი ჩართულია.");
  }
});

forgot.addEventListener("click", (event) => {
  event.preventDefault();
  alert("Password recovery is disabled.");
});

create.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Account creation redirection or modal goes here.");
});