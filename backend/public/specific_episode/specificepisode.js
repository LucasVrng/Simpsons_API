let episodeId = localStorage.getItem("episodeId");
console.log(episodeId);
loadEpisode(episodeId);

async function loadEpisode(episodeId) {
  const response = await fetch(
    `https://thesimpsonsapi.com/api/episodes/${episodeId}`,
  );
  const episode = await response.json();
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
        </div>
    `;
  container.appendChild(episodeDiv);
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (episodeId == 1) {
    episodeId = 768;
  } else {
    episodeId--;
  }
  localStorage.setItem("episodeId", episodeId);
  loadEpisode(episodeId);
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (episodeId == 768) {
    episodeId = 1;
  } else {
    episodeId++;
  }
  localStorage.setItem("episodeId", episodeId);
  loadEpisode(episodeId);
});


let likedEpisodes = []

async function toggleLike(episodeId) {
  const response = await fetch("https://localhost:4000/likeEpisode", {
    method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: 1,
            episodeId: episodeId 
        })
    });
    const data = await response.json();
    console.log('Résultat:', data);
  if (likedEpisodes.find((episode) => episode == episodeId)) {
            likedEpisodes = likedEpisodes.filter(episode => episode!=episodeId);
        } else {
            likedEpisodes.push(episodeId)
        }
}
