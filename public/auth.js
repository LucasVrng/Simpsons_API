// auth.js
import { setAccessToken, getAccessToken } from "./api.js";

// Tente un refresh silencieux — renvoie true si connecté, false sinon
export const tryAuth = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/refresh", {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const isLoggedIn = () => !!getAccessToken();

export const logout = async () => {
  await fetch("http://localhost:3000/api/logout", {
    method: "POST",
    credentials: "include",
  });
  setAccessToken(null);
  window.location.href = "/index.html";
};