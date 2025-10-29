let characterId = localStorage.getItem("characterId");
console.log(characterId);
loadCharacter(characterId);

document.getElementById("loading").style.display = "none";
document.getElementById("loading-text").style.display = "none";

async function loadCharacter(characterId) {
  const response = await fetch(
    `https://thesimpsonsapi.com/api/characters/${characterId}`,
  );
  const character = await response.json();
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
            <p id="phrases">Phrases: ${character.phrases ? character.phrases : "Unknown"}</p>
        </div>
    `;
  container.appendChild(characterDiv);
}

document.getElementById("prev-btn").addEventListener("click", () => {
  characterId--;
  localStorage.setItem("characterId", characterId);
  loadCharacter(characterId);
});

document.getElementById("next-btn").addEventListener("click", () => {
  characterId++;
  localStorage.setItem("characterId", characterId);
  loadCharacter(characterId);
});
