document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // empêche le reload

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      // stocke le token
      localStorage.setItem("accessToken", data.accessToken);
      document.getElementById("message").textContent = "Login réussi !";
      setTimeout(() => window.location.href = "index.html", 1500);
    } else {
      document.getElementById("message").textContent = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("message").textContent = "Erreur serveur";
  }
});
