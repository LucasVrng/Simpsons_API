// header.js
import { tryAuth, isLoggedIn, logout } from "./auth.js";

export const initHeader = async () => {
  const loggedIn = await tryAuth();

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <div class="header-inner">
      <a href="/index.html" class="header-logo">🟡 Simpsons</a>
      <nav class="header-nav">
        ${loggedIn ? `
          <span class="header-username">Logged in</span>
          <button class="header-btn" id="logout-btn">Logout</button>
        ` : `
          <a href="/login.html" class="header-btn" id="login-btn">Login</a>
          <a href="/register.html" class="header-btn header-btn--primary" id="register-btn">Register</a>
        `}
      </nav>
    </div>
  `;

  if (loggedIn) {
    document.getElementById("logout-btn").addEventListener("click", logout);
  }

  return loggedIn;
};