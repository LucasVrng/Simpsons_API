// components/LikeButton.js
import { getLike, toggleLike } from "../api.js";

export class LikeButton {
  /**
   * @param {HTMLElement} container
   * @param {Object} options
   * @param {string} options.type - "episode" | "character" | "location"
   * @param {number} options.id
   * @param {Function} [options.onChange] - callback(liked)
   */
  constructor(container, { type, id, onChange }) {
    this.container = container;
    this.type = type;
    this.id = id;
    this.onChange = onChange || null;

    this.liked = false;
    this.total = 0;
    this.loading = false;

    this.render();
    this.loadLike();
  }

  async loadLike() {
    try {
      const data = await getLike(this.type, this.id);
      this.liked = data.liked;
      this.total = data.total;
      this.update();
    } catch (err) {
      console.error("Erreur chargement like :", err);
    }
  }

  async handleClick() {
    if (this.loading) return;
    this.loading = true;

    try {
      const data = await toggleLike(this.type, this.id);
      this.liked = data.liked;
      this.total = data.total;
      this.update(true); // true = jouer l'animation
      if (this.onChange) this.onChange(this.liked);
    } catch (err) {
      console.error("Erreur like :", err);
    } finally {
      this.loading = false;
    }
  }

  update(animate = false) {
    const btn = this.container.querySelector(".like-btn");
    const count = this.container.querySelector(".like-count");

    btn.classList.toggle("liked", this.liked);

    if (animate && this.liked) {
      btn.classList.remove("pop");
      // forcer le reflow pour relancer l'animation
      void btn.offsetWidth;
      btn.classList.add("pop");
    }

    count.textContent = this.total > 0 ? this.total : "";
  }

  render() {
    this.container.innerHTML = "";
    this.container.classList.add("like-wrapper");

    const btn = document.createElement("button");
    btn.classList.add("like-btn");
    btn.setAttribute("aria-label", "Aimer ce contenu");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    `;

    const count = document.createElement("span");
    count.classList.add("like-count");

    btn.addEventListener("click", () => this.handleClick());
    this.container.append(btn, count);
  }
}