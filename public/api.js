// api.js
const BASE_URL = "http://localhost:3000/api";

// L'access token est stocké en mémoire (jamais en localStorage)
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };
export const getAccessToken = () => accessToken;

const authFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: "include", // pour les cookies httpOnly (refresh token)
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  });

  // Si le token est expiré, on tente un refresh automatique
  if (res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) throw new Error("Session expirée, veuillez vous reconnecter");

    // On relance la requête originale avec le nouveau token
    return authFetch(url, options);
  }

  return res.json();
};

const refreshAccessToken = async () => {
  try {
    const data = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      credentials: "include",
    }).then((r) => r.json());

    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

// --- Ratings ---
export const getRating = (type, id) =>
  authFetch(`/ratings/${type}/${id}`);

export const upsertRating = (type, id, rating) =>
  authFetch(`/ratings/${type}/${id}`, {
    method: "POST",
    body: JSON.stringify({ rating }),
  });

export const deleteRating = (type, id) =>
  authFetch(`/ratings/${type}/${id}`, { method: "DELETE" });

// --- Likes ---
export const getLike = (type, id) =>
  authFetch(`/likes/${type}/${id}`);

export const toggleLike = (type, id) =>
  authFetch(`/likes/${type}/${id}`, { method: "POST" });

// --- Rankings ---
export const getRankings = (type) =>
  authFetch(`/me/rankings/${type}`);

export const reorderRankings = (type, rankings) =>
  authFetch(`/me/rankings/${type}`, {
    method: "PATCH",
    body: JSON.stringify({ rankings }),
  });

// À appeler au chargement de chaque page protégée
export const initAuth = async () => {
  const ok = await refreshAccessToken();
  if (!ok) {
    // Pas de refresh token valide → retour au login
    window.location.href = "/login.html";
  }
};