    // components/StarRating.js
import { getRating, upsertRating, deleteRating } from "../api.js";

export class StarRating {
  /**
   * @param {HTMLElement} container - L'élément dans lequel injecter le composant
   * @param {Object} options
   * @param {string} options.type - "episode" | "character" | "location"
   * @param {number} options.id - ID du contenu
   * @param {Function} [options.onChange] - callback(rating) appelé après chaque note
   */
  constructor(container, { type, id, onChange }) {
    this.container = container;
    this.type = type;
    this.id = id;
    this.onChange = onChange || null;

    this.userRating = null;   // valeur /10 en base
    this.hoverRating = null;  // valeur survolée /10

    this.render();
    this.loadRating();
  }

  async loadRating() {
    try {
      const data = await getRating(this.type, this.id);
      this.userRating = data.userRating;
      this.average = data.average;
      this.total = data.total;
      this.updateStars(this.userRating);
      this.updateMeta();
    } catch (err) {
      console.error("Erreur chargement note :", err);
    }
  }

  // Convertit une valeur /10 en tableau de 5 états ("full" | "half" | "empty")
  getRatingState(value) {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = (i + 1) * 2; // valeur pleine de cette étoile
      if (value >= starValue) return "full";
      if (value >= starValue - 1) return "half";
      return "empty";
    });
  }

  updateStars(value) {
    const stars = this.container.querySelectorAll(".star");
    const states = this.getRatingState(value || 0);

    stars.forEach((star, i) => {
      star.dataset.state = states[i];
    });
  }

  updateMeta() {
    const meta = this.container.querySelector(".star-meta");
    if (!meta) return;

    if (this.userRating) {
      meta.textContent = `Ta note : ${this.userRating}/10 · Moyenne : ${this.average}/10 (${this.total} notes)`;
    } else {
      meta.textContent = this.total > 0
        ? `Moyenne : ${this.average}/10 (${this.total} notes)`
        : "Pas encore de notes";
    }
  }

  async handleClick(ratingValue) {
    try {
      // Si on reclique sur sa propre note → on la supprime
      if (ratingValue === this.userRating) {
        await deleteRating(this.type, this.id);
        this.userRating = null;
        this.updateStars(0);
      } else {
        const data = await upsertRating(this.type, this.id, ratingValue);
        this.userRating = data.userRating;
        this.average = data.average;
        this.total = data.total;
        this.updateStars(this.userRating);
      }

      this.updateMeta();
      if (this.onChange) this.onChange(this.userRating);
    } catch (err) {
      console.error("Erreur notation :", err);
    }
  }

  render() {
    this.container.innerHTML = "";
    this.container.classList.add("star-rating");

    const starsWrapper = document.createElement("div");
    starsWrapper.classList.add("stars-wrapper");

    // Créer 5 étoiles, chacune divisée en deux moitiés cliquables
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.classList.add("star");
      star.dataset.state = "empty";

      // Moitié gauche = demi-étoile (valeur impaire : 1, 3, 5, 7, 9)
      const halfLeft = document.createElement("span");
      halfLeft.classList.add("star-half", "star-half--left");
      halfLeft.dataset.value = i * 2 - 1;

      // Moitié droite = étoile pleine (valeur paire : 2, 4, 6, 8, 10)
      const halfRight = document.createElement("span");
      halfRight.classList.add("star-half", "star-half--right");
      halfRight.dataset.value = i * 2;

      [halfLeft, halfRight].forEach((half) => {
        half.addEventListener("mouseenter", () => {
          this.hoverRating = parseInt(half.dataset.value);
          this.updateStars(this.hoverRating);
        });

        half.addEventListener("click", () => {
          this.handleClick(parseInt(half.dataset.value));
        });
      });

      star.addEventListener("mouseleave", () => {
        this.hoverRating = null;
        this.updateStars(this.userRating || 0);
      });

      star.append(halfLeft, halfRight);
      starsWrapper.appendChild(star);
    }

    // Zone de métadonnées (moyenne, total)
    const meta = document.createElement("p");
    meta.classList.add("star-meta");
    meta.textContent = "Chargement...";

    this.container.append(starsWrapper, meta);
  }
}