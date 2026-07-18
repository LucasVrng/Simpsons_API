import { initHeader } from "../header.js";
import { StarRating } from "../components/StarRating.js";
import { LikeButton } from "../components/LikeButton.js";

const episodesData = await fetch("../database/episodes.json").then(r => r.json());

await initHeader();

let episodeId = Number(localStorage.getItem("episodeId")) || 1;
let isLoading = false;

const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")

const episodeBasic = episodesData.find(e => e.id == episodeId);
if (episodeBasic) renderEpisode(episodeBasic);

const searchWrapper = document.getElementById("episode-search-wrapper")
const searchInput = document.getElementById("episode-search-input")
const searchResults = document.getElementById("episode-search-results")

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.hidden = true;
    return;
  }

  const matches = episodesData
    .filter(e => e.name.toLowerCase().includes(query))
    .slice(0,8); // maximum 8 résultats

  if (matches.length === 0) {
    searchResults.innerHTML = `<li class="no-result">No result found</li>`
    searchResults.hidden = false;
    return;
  }

  matches.forEach(episode => {
    const li = document.createElement("li");
    li.textContent = `S${episode.season}E${episode.episode_number} - ${episode.name}`
    li.addEventListener("click", () => {
      searchInput.value = "";
      searchResults.hidden = true;
      navigateTo(episode.id);
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

function renderEpisode(episode) {
  const container = document.getElementById("episodecontainer");
  container.innerHTML = "";

  const episodeDiv = document.createElement("div");
  episodeDiv.classList.add("episode-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/episode/${episode.id}.webp`;

  episodeDiv.innerHTML = `
    <div class="image-container" data-tag="Season ${episode.season ?? "?"} · Ep. ${episode.episode_number ?? "?"}">
      <img src="${portrait}" alt="${episode.name}" id="image"/>
    </div>
    <div class="info-container">
      <h2 id="name">${episode.name}</h2>
      <div style="display:flex; flex-direction:column; gap:4px;">
        <p id="episode_number">Episode: ${episode.episode_number ?? "Unknown"}</p>
        <p id="season">Season: ${episode.season ?? "Unknown"}</p>
        <p id="airdate">Air Date: ${episode.airdate ?? "Unknown"}</p>
      </div>
      <p id="synopsis">${episode.synopsis ?? "<em class='loading-text'>Loading the synopsis...</em>"}</p>
      <div class="actions-row">
        <div id="star-rating"></div>
        <div id="like-button"></div>
      </div>
    </div>
  `;
  
  container.appendChild(episodeDiv);

  
new StarRating(document.querySelector("#star-rating"), {
  type: "episode",
  id: episodeId,
  onChange: (rating) => console.log("Nouvelle note :", rating)
});

// Cœur
new LikeButton(document.querySelector("#like-button"), {
  type: "episode",
  id: episodeId,
  onChange: (liked) => console.log("Liké :", liked)
});
}

prevBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(episodeId == 1 ? 768 : episodeId - 1);
});

nextBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(episodeId == 768 ? 1 : episodeId + 1);
});

async function navigateTo(id) {
  episodeId = id;
  localStorage.setItem("episodeId", episodeId);
  const episode = episodesData.find(e => e.id == episodeId);
  if (episode) renderEpisode(episode);
}