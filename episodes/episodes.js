const res = await fetch('./episodes.json');
const cache = await res.json(); 
let currentData = cache; 

let currentPage = 1;
let pageSize = 20;
let totalPages = Math.ceil(cache.length / pageSize);

const previousbtn = document.getElementById("prev-btn");
const nextbtn = document.getElementById("next-btn");

const resultslength = document.getElementById("number-of-results");
resultslength.textContent = `Number of Episodes: ${currentData.length}`

const pageSizeselector = document.querySelector('select');
pageSizeselector.addEventListener('change', function (event) { 
    pageSize = Number(event.target.value);
    totalPages = Math.ceil(currentData.length / pageSize);
    currentPage = 1;
    document.getElementById("page-info").textContent = `Page: ${currentPage}`;
    renderPage();
});

renderPage();

previousbtn.addEventListener("click", previousPage);
nextbtn.addEventListener("click", nextPage);
document.getElementById("page-info").textContent = `Page: ${currentPage}`;

document.getElementById("episode-input").addEventListener("input", event =>{
  console.log(event.target.value);
  currentPage = 1;
  document.getElementById("page-info").textContent = `Page: ${currentPage}`;
  currentData = cache.filter(c => c.name.toLowerCase().includes (event.target.value.toLowerCase()));
  totalPages = Math.ceil(currentData.length / pageSize);
  console.log(currentData)
  resultslength.textContent = `Number of Episodes: ${currentData.length}`
  renderPage();
})

document.getElementById("all-episodes-container").addEventListener("click", (event) => {
    const card = event.target.closest(".episode-card");
    if (!card) return;
    localStorage.clear()
    localStorage.setItem("episodeId",card.querySelector("#id").textContent)
    window.location.href = "../specific_episode/specificepisode.html";
})

function renderPage () {
    if (currentPage==1) {
        previousbtn.disabled = true;
        previousbtn.style.cursor = "default";
        previousbtn.style.pointerEvents = "none";
    } else {
        previousbtn.disabled = false;
        previousbtn.style.cursor = "pointer";
        previousbtn.style.pointerEvents = "auto";
    }
    if (currentPage==totalPages) {
        nextbtn.disabled = true;
        nextbtn.style.cursor = "default";
        nextbtn.style.pointerEvents = "none";
    } else {
        nextbtn.disabled = false;
        nextbtn.style.cursor = "pointer";
        nextbtn.style.pointerEvents = "auto";
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    const pageData = currentData.slice(startIndex, endIndex);
    displayCurrentData(pageData);
}

function previousPage() {
    if (currentPage>1) {
        currentPage--;
        renderPage();
        document.getElementById("page-info").textContent = `Page ${currentPage}`;
    }
}

function nextPage() {
    if ((currentPage * pageSize) < currentData.length) {
        console.log(currentPage)
        currentPage++;
        renderPage();
        document.getElementById("page-info").textContent = `Page ${currentPage}`;
    }
}

function displayCurrentData(pageData) {
    const container = document.getElementById("all-episodes-container");
    container.innerHTML = "";
    pageData.forEach(episode => {
        const episodeDiv = document.createElement("div");
        episodeDiv.classList.add("episode-card");
        const portrait = `https://cdn.thesimpsonsapi.com/1280/episode/${episode.id}.webp`;
        console.log(episode.description)
        episodeDiv.innerHTML = `  
            <img src="${portrait}" alt="${episode.name}" id="image"/>
            <h3 id="name">${episode.name}</h3>
            <p id="id" style="display: none">${episode.id}</p>
            <p id="air-date">Air Date: ${episode.airdate ? episode.airdate : "Unknown"}</p> 
            <p id="number">Episode Number: ${episode.episode_number ? episode.episode_number : "Unknown"}</p>
            <p id="season">Season: ${episode.season ? episode.season : "Unknown"}</p>
        `;
        container.appendChild(episodeDiv);
    });
}

