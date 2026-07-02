document.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:3000/profile", {
    headers: { Authorization: `Bearer ${accessToken}` }
    });
});