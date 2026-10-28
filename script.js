const form = document.getElementById("loginForm");
const forgot = document.getElementById("forgot");
const create = document.getElementById("create");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Demo only: no credentials are transmitted or stored.
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  if (!email.value.trim() || !password.value.trim()) {
    alert("Please fill in both fields.");
    return;
  }

  alert("Demo page: this form does not send or store login information.");
});

forgot.addEventListener("click", (event) => {
  event.preventDefault();
  alert("Password recovery is disabled in this front-end demo.");
});

create.addEventListener("click", () => {
  alert("Account creation is disabled in this front-end demo.");
});
