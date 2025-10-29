
let currentPage = 1;
let totalPages = 60;
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
for (let page = 1; page <= 60; page++) {
  const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${page}`);
  const data = await res.json();
  cache.push(...data.results);
}

console.log(cache);

document.getElementById("character-input").addEventListener("input", event =>{
  console.log(event.target.value);
  currentData = cache.filter(c => c.name.toLowerCase().includes (event.target.value.toLowerCase()));
  console.log(currentData)
  displayCurrentData();
})

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
            <p id="phrases">Phrases: ${character.phrases ? character.phrases : "Unknown"}</p>
        `;
        container.appendChild(characterDiv);
    });
}
