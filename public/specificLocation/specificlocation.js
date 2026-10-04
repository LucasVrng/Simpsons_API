import { initHeader } from "../header.js";
import { StarRating } from "../components/StarRating.js";
import { LikeButton } from "../components/LikeButton.js";

const locationsData = await fetch("../database/locations.json").then(r => r.json());

await initHeader();

let locationId = Number(localStorage.getItem("locationId")) || 1;
let isLoading = false;

const prevBtn = document.getElementById("prev-btn")
const nextBtn = document.getElementById("next-btn")

const locationBasic = locationsData.find(l => l.id == locationId);
if (locationBasic) renderLocation(locationBasic);

const searchWrapper = document.getElementById("location-search-wrapper")
const searchInput = document.getElementById("location-search-input")
const searchResults = document.getElementById("location-search-results")

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = "";

  if (!query) {
    searchResults.hidden = true;
    return;
  }

  const matches = locationsData
    .filter(e => e.name.toLowerCase().includes(query))
    .slice(0,8); // maximum 8 résultats

  if (matches.length === 0) {
    searchResults.innerHTML = `<li class="no-result">No result found</li>`
    searchResults.hidden = false;
    return;
  }

  matches.forEach(location => {
    const li = document.createElement("li");
    li.textContent = `${location.name}`
    li.addEventListener("click", () => {
      searchInput.value = "";
      searchResults.hidden = true;
      navigateTo(location.id);
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

function renderLocation(location) {
  const container = document.getElementById("locationcontainer");
  container.innerHTML = "";

  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location-card");

  const portrait = `https://cdn.thesimpsonsapi.com/1280/location/${location.id}.webp`;

  locationDiv.innerHTML = `  
        <div class="image-container">
            <img src="${portrait}" alt="${location.name}" id="image"/>
        </div>
        <div class="info-container">
            <h3 id="name">${location.name}</h3>
            <p id="town">Town: ${location.town ? location.town : "Unknown"}</p> 
            <p id="use">Use: ${location.use ? location.use : "Unknown"}</p>
            <div class="actions-row">
              <div id="star-rating"></div>
              <div id="like-button"></div>
            </div>
        </div>
    `;
  container.appendChild(locationDiv);

new StarRating(document.querySelector("#star-rating"), {
  type: "location",
  id: locationId,
  onChange: (rating) => console.log("Nouvelle note :", rating)
});

// Cœur
new LikeButton(document.querySelector("#like-button"), {
  type: "location",
  id: locationId,
  onChange: (liked) => console.log("Liké :", liked)
});
}

prevBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(locationId == 1 ? 477 : locationId - 1);
});

nextBtn.addEventListener("click", () => {
  if (isLoading) return;
  navigateTo(locationId == 477 ? 1 : locationId + 1);
});

async function navigateTo(id) {
  locationId = id;
  localStorage.setItem("locationId", locationId);
  const location = locationsData.find(e => e.id == locationId);
  if (location) renderLocation(location);
}
