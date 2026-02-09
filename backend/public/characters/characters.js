const res = await fetch("../database/characters.json");
const cache = await res.json();
let currentData = cache;

let currentPage = 1;
let pageSize = 20;
let totalPages = Math.ceil(cache.length / pageSize);

const previousbtn = document.getElementById("prev-btn");
const nextbtn = document.getElementById("next-btn");

const resultslength = document.getElementById("number-of-results");
resultslength.textContent = `Number of Characters: ${currentData.length}`;

const pageSizeselector = document.querySelector("select");
pageSizeselector.addEventListener("change", function (event) {
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

document.getElementById("name-input").addEventListener("input", (event) => {
  console.log(event.target.value);
  currentPage = 1;
  document.getElementById("page-info").textContent = `Page: ${currentPage}`;
  currentData = cache.filter((c) =>
    c.name.toLowerCase().includes(event.target.value.toLowerCase()),
  );
  totalPages = Math.ceil(currentData.length / pageSize);
  console.log(currentData);
  resultslength.textContent = `Number of Characters: ${currentData.length}`;
  renderPage();
});

// document.getElementById("phrases-input").addEventListener("input", event =>{
//   console.log(event.target.value);
//   currentData = cache.filter(c => c.phrases.includes (event.target.value.toLowerCase()));
//   console.log(currentData)
//   displayCurrentData();
// })

document
  .getElementById("all-characters-container")
  .addEventListener("click", (event) => {
    const card = event.target.closest(".character-card");
    if (!card) return;
    localStorage.clear();
    localStorage.setItem("characterId", card.querySelector("#id").textContent);
    window.location.href = "../specific_character/specificcharacter.html";
  });

function renderPage() {
  if (currentPage == 1) {
    previousbtn.disabled = true;
    previousbtn.style.cursor = "default";
    previousbtn.style.pointerEvents = "none";
  } else {
    previousbtn.disabled = false;
    previousbtn.style.cursor = "pointer";
    previousbtn.style.pointerEvents = "auto";
  }
  if (currentPage == totalPages) {
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
  if (currentPage > 1) {
    currentPage--;
    renderPage();
    document.getElementById("page-info").textContent = `Page ${currentPage}`;
  }
}

function nextPage() {
  if (currentPage * pageSize < currentData.length) {
    console.log(currentPage);
    currentPage++;
    renderPage();
    document.getElementById("page-info").textContent = `Page ${currentPage}`;
  }
}

function displayCurrentData(pageData) {
  const container = document.getElementById("all-characters-container");
  container.innerHTML = "";
  pageData.forEach((character) => {
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("character-card");
    const portrait = `https://cdn.thesimpsonsapi.com/1280/character/${character.id}.webp`;
    characterDiv.innerHTML = `  
            <img src="${portrait}" alt="${character.name}" id="image"/>
            <h3 id="name">${character.name}</h3>
            <p id="id" style="display: none">${character.id}</p>
            <p id="${character.status}">${character.status ? character.status : "Unknown"}</p> 
        `;
    container.appendChild(characterDiv);
  });
}
