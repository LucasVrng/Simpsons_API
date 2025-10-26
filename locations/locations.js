
let currentPage = 1;
let totalPages = 24;
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
for (let page = 1; page <= 24; page++) {
  const res = await fetch(`https://thesimpsonsapi.com/api/locations?page=${page}`);
  const data = await res.json();
  cache.push(...data.results);
}

console.log(cache);

async function fetchPage(page) {
    try {
        let url = await fetch(`https://thesimpsonsapi.com/api/locations?page=${page}`);
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
    const container = document.getElementById("all-locations-container");
    container.innerHTML = "";
    currentData.forEach(location => {
        const locationDiv = document.createElement("div");
        locationDiv.classList.add("location-card");
        const portrait = `https://cdn.thesimpsonsapi.com/1280/location/${location.id}.webp`;
        locationDiv.innerHTML = `  
            <img src="${portrait}" alt="${location.name}" id="image"/>
            <h3 id="name">${location.name}</h3>
            <p id="town">Town: ${location.town ? location.town : "Unknown"}</p> 
            <p id="use">Use: ${location.use ? location.use : "Unknown"}</p>
        `;
        container.appendChild(locationDiv);
    });
}

