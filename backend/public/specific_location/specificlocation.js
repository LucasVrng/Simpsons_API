let locationId = localStorage.getItem("locationId");
console.log(locationId);
loadLocation(locationId);

async function loadLocation(locationId) {
  const response = await fetch(
    `https://thesimpsonsapi.com/api/locations/${locationId}`,
  );
  const location = await response.json();
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
        </div>
    `;
  container.appendChild(locationDiv);
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (locationId == 1) {
    locationId = 477;
  } else {
    locationId--;
  }
  localStorage.setItem("locationId", locationId);
  loadLocation(locationId);
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (locationId == 477) {
    locationId = 1;
  } else {
    locationId++;
  }
  localStorage.setItem("locationId", locationId);
  loadLocation(locationId);
});
