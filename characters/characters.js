
let currentPage = 1;
let totalPages = 60;
let currentData = [];

addEventListener("DOMContentLoaded", (event) => { fetchPage(currentPage); })

document.getElementById("fetch-btn").addEventListener("click", fetchCharacterData);
document.getElementById("fetch-all-btn").addEventListener("click", fetchPage(currentPage));

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
for (let page = 1; page <= 60; page++) {
  const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`);
  const data = await res.json();
  cache.push(...data.results);
}

console.log(cache);

async function fetchCharacterData() {
  try {
    const inputName = document.getElementById("character-name").value.trim().toLowerCase();

    const character = cache.find(c => c.name.toLowerCase().includes (inputName.toLowerCase()));

    if (character) {
      console.log("Personnage trouvé :", character);
    } else {
      console.log("Personnage non trouvé");
    }
    const portrait =  `https://cdn.thesimpsonsapi.com/500/character/${character.id}.webp`;
    const imageElement = document.getElementById("character-image");
    imageElement.src = portrait;
    imageElement.style.display = "block";

    const nameElement = document.getElementById("name");
    nameElement.textContent = `Name: ${character.name}`;

    const birthdateElement = document.getElementById("birth-date");
    if (character.birthdate==null) {
      birthdateElement.textContent = `Birth Date: Unknown`;
    } else {
      birthdateElement.textContent = `Birth Date: ${character.birthdate}`;
    }

    const ageElement = document.getElementById("age");
    if (character.age==null) {
      ageElement.textContent = `Age: Unknown`;
    } else {
      ageElement.textContent = `Age: ${character.age}`;
    }

    const occupationElement = document.getElementById("occupation");
    if (character.occupation==null) {
      occupationElement.textContent = `Occupation: Unknown`;
    } else {
      occupationElement.textContent = `Occupation: ${character.occupation}`;
    }

    const phrasesElement = document.getElementById("phrases");
    phrasesElement.textContent = `${character.phrases.join(" ")}`;

    currentPage = 1

    console.log(character);
  } catch (error) {
    console.error(error);
  }
}

async function fetchPage(page) {
    try {
        let url = await fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`);
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
    const container = document.getElementById("all-characters-container");
    container.innerHTML = "";
    currentData.forEach(character => {
        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character-card");
        const portrait = `https://cdn.thesimpsonsapi.com/500/character/${character.id}.webp`;
        characterDiv.innerHTML = `  
            <img src="${portrait}" alt="${character.name}" id="image"/>
            <h3 id="name">${character.name}</h3>
            <p id="birth-date">Birth Date: ${character.birthdate ? character.birthdate : "Unknown"}</p> 
            <p id="age">Age: ${character.age ? character.age : "Unknown"}</p>
            <p id="occupation">Occupation: ${character.occupation ? character.occupation : "Unknown"}</p>
            <p id="phrases">Phrases: ${character.phrases ? character.phrases.join(", ") : "Unknown"}</p>
        `;
        container.appendChild(characterDiv);
    });
}

