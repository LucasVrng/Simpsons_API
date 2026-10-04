import { initHeader } from "../header.js";
import { StarRating } from "../components/StarRating.js";
import { LikeButton } from "../components/LikeButton.js";

const charactersData = await fetch("../database/characters.json").then(r => r.json());

await initHeader();

let characterId = Number(localStorage.getItem("characterId")) || 1;
let isLoading = false;

const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")

const characterBasic = charactersData.find(e => e.id == characterId);
if (characterBasic) renderCharacter(characterBasic);

const searchWrapper = document.getElementById("character-search-wrapper")
const searchInput = document.getElementById("character-search-input")
const searchResults = document.getElementById("character-search-results")

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.hidden = true;
    return;
  }

  const matches = charactersData
    .filter(e => e.name.toLowerCase().includes(query))
    .slice(0,8); // maximum 8 résultats

  if (matches.length === 0) {
    searchResults.innerHTML = `<li class="no-result">No result found</li>`
    searchResults.hidden = false;
    return;
  }

  matches.forEach(character => {
    const li = document.createElement("li");
    li.textContent = `${character.name}`
    li.addEventListener("click", () => {
      searchInput.value = "";
      searchResults.hidden = true;
      navigateTo(character.id);
    })
    searchResults.appendChild(li)
  });

  searchResults.hidden = false;
});

document.addEventListener("click", (e) => {
  if (!searchWrapper.contains(e.target)) {
    searchResults.hidden = true;
  }
})

function renderCharacter(character) {
  const container = document.getElementById("charactercontainer");
  container.innerHTML = "";

  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/character/${character.id}.webp`;

  characterDiv.innerHTML = `  
        <div class="image-container">
            <img src="${portrait}" alt="${character.name}" id="image"/>
        </div>
        <div class="info-container">
            <h3 id="name">${character.name}</h3>
            <p id="birthdate">Birth Date: ${character.birthdate ? character.birthdate : "Unknown"}</p> 
            <p id="age">Age: ${character.age ? character.age : "Unknown"}</p>
            <p id="occupation">Occupation: ${character.occupation ? character.occupation : "Unknown"}</p>
            <p id="description">${character.description ? character.description : "Unknown"}</p>
            <p id="phrases">Phrases: ${character.phrases ? character.phrases : "Unknown"}</p>
            <div class="actions-row">
              <div id="star-rating"></div>
              <div id="like-button"></div>
            </div>
        </div>
    `;
  container.appendChild(characterDiv);

new StarRating(document.querySelector("#star-rating"), {
  type: "character",
  id: characterId,
  onChange: (rating) => console.log("Nouvelle note :", rating)
});

// Cœur
new LikeButton(document.querySelector("#like-button"), {
  type: "character",
  id: characterId,
  onChange: (liked) => console.log("Liké :", liked)
});
}

prevBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(characterId == 1 ? 1182 : characterId - 1);
});

nextBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(characterId == 1182 ? 1 : characterId + 1);
});

async function navigateTo(id) {
  characterId = id;
  localStorage.setItem("characterId", characterId);
  const character = charactersData.find(e => e.id == characterId);
  if (character) renderCharacter(character);
}