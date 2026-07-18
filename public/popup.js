// popup.js
export const showLoginPopup = () => {
  // sauvegarde la page actuelle pour y revenir après login
  localStorage.setItem("redirectAfterLogin", window.location.href);

  const existing = document.getElementById("login-popup");
  if (existing) return; // déjà affiché

  const overlay = document.createElement("div");
  overlay.id = "login-popup";
  overlay.innerHTML = `
    <div class="popup-box">
      <button class="popup-close" id="popup-close">✕</button>
      <div class="popup-icon">🔒</div>
      <h3 class="popup-title">Login required</h3>
      <p class="popup-text">Login to note and like episodes.</p>
      <a href="/login.html" class="popup-btn">Login</a>
      <a href="/register.html" class="popup-btn popup-btn--secondary">Register</a>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("popup-close").addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
};