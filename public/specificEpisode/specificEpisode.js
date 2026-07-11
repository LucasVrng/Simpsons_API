import { initAuth } from "../api.js";
import { StarRating } from "../components/StarRating.js";
import { LikeButton } from "../components/LikeButton.js";

const episodesData = await fetch("../database/episodes.json").then(r => r.json());

await initAuth();

let episodeId = localStorage.getItem("episodeId");
const episodeBasic = episodesData.find(e => e.id == episodeId);
if (episodeBasic) renderEpisode(episodeBasic);

loadFullEpisode(episodeId);

async function loadFullEpisode(episodeId) {
  try {
    const response = await fetch(
      `https://thesimpsonsapi.com/api/episodes/${episodeId}`,
    );
  const episode = await response.json();
  renderEpisode(episode);
} catch (err) {
  console.error("Unable to load the complete details", err)
}
};

function renderEpisode(episode) {
  const container = document.getElementById("episodecontainer");
  container.innerHTML = "";

  const episodeDiv = document.createElement("div");
  episodeDiv.classList.add("episode-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/episode/${episode.id}.webp`;

  episodeDiv.innerHTML = `  
        <div class="image-container">
            <img src="${portrait}" alt="${episode.name}" id="image"/>
        </div>
        <div class="info-container">
            <h3 id="name">${episode.name}</h3>
            <p id="episode_number">Episode Number: ${episode.episode_number ? episode.episode_number : "Unknown"}</p> 
            <p id="season">Season: ${episode.season ? episode.season : "Unknown"}</p>
            <p id="airdate">Air Date: ${episode.airdate ? episode.airdate : "Unknown"}</p>
            <p id="synopsis">Synopsis: ${episode.synopsis ? episode.synopsis : "Unknown"}</p>
            <div id="star-rating"></div>
            <div id="like-button"></div>
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

document.getElementById("prev-btn").addEventListener("click", () => {
  if (episodeId == 1) {
    episodeId = 768;
  } else {
    episodeId--;
  }
  const episode = episodesData.find(e => e.id == episodeId);
  if (episode) renderEpisode(episode);
  loadFullEpisode(episodeId);
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (episodeId == 768) {
    episodeId = 1;
  } else {
    episodeId++;
  }
  const episode = episodesData.find(e => e.id == episodeId);
  if (episode) renderEpisode(episode);
  loadFullEpisode(episodeId);
});
