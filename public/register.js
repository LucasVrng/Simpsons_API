document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche le reload

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("message").textContent = "Inscription réussie";
      setTimeout(() => window.location.href = "index.html", 1500);
    } else {
      document.getElementById("message").textContent = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("message").textContent = "Erreur serveur";
  }
});
