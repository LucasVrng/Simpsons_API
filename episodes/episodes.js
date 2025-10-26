
let currentPage = 1;
let totalPages = 39;
let currentData = [];

addEventListener("DOMContentLoaded", (event) => { fetchPage(currentPage); })

document.getElementById("prev-btn").addEventListener("click", () => {
    if (currentPage > 1) {
        fetchPage(currentPage - 1);
        currentPage--;
        document.getElementById("page-info").textContent = `Page ${currentPage}`;
    }
});

document.getElementById("next-btn").addEventListener("click", () => {
    if (currentPage < totalPages) {
        fetchPage(currentPage + 1);
        currentPage++;
        document.getElementById("page-info").textContent = `Page ${currentPage}`;
    }
});

document.getElementById("page-info").textContent = `Page: ${currentPage}`;


const cache = [];
for (let page = 1; page <= 39; page++) {
  const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
  const data = await res.json();
  cache.push(...data.results);
}

console.log(cache);

async function fetchPage(page) {
    try {
        let url = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`);
        if (!url.ok) {
            throw new Error("Could not fetch data");
        } 
        const data = await url.json();
        currentData = data.results;
        displayCurrentData();
    }
        catch (error) {
    console.error(error);
} }

function displayCurrentData() {
    const container = document.getElementById("all-episodes-container");
    container.innerHTML = "";
    currentData.forEach(episode => {
        const episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode-card");
        const portrait = `https://cdn.thesimpsonsapi.com/200/episode/${episode.id}.webp`;
        console.log(episode.description)
        episodeDiv.innerHTML = `  
            <img src="${portrait}" alt="${episode.name}" id="image"/>
            <h3 id="name">${episode.name}</h3>
            <p id="air-date">Air Date: ${episode.airdate ? episode.airdate : "Unknown"}</p> 
            <p id="number">Number: ${episode.episode_number ? episode.episode_number : "Unknown"}</p>
            <p id="season">Season: ${episode.season ? episode.season : "Unknown"}</p>
            <p id="description"">Description: ${episode.description ? episode.description : "Unknown"}</p>
            <p id="synopsis"">Synopsis: ${episode.synopsis ? episode.synopsis : "Unknown"}</p>
        `;
        container.appendChild(episodeDiv);
    });
}

