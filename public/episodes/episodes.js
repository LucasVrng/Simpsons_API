  const res = await fetch("../database/episodes.json");
  const cache = await res.json();
  let currentData = cache;

  let currentPage = 1;
  let pageSize = 20;
  let totalPages = Math.ceil(cache.length / pageSize);

  const previousbtn = document.getElementById("prev-btn");
  const nextbtn = document.getElementById("next-btn");

  const resultslength = document.getElementById("number-of-results");
  resultslength.textContent = `Number of Episodes: ${currentData.length}`;

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

  document.getElementById("episode-input").addEventListener("input", (event) => {
    console.log(event.target.value);
    currentPage = 1;
    document.getElementById("page-info").textContent = `Page: ${currentPage}`;
    currentData = cache.filter((c) =>
      c.name.toLowerCase().includes(event.target.value.toLowerCase()),
    );
    totalPages = Math.ceil(currentData.length / pageSize);
    console.log(currentData);
    resultslength.textContent = `Number of Episodes: ${currentData.length}`;
    renderPage();
  });

  document
    .getElementById("all-episodes-container")
    .addEventListener("click", (event) => {
      const card = event.target.closest(".episode-card");
      if (!card) return;

      const episodeId = card.querySelector("#id").textContent;
      const episodeBasic = cache.find(e => e.id == episodeId);

      localStorage.setItem("episodeId", episodeId);
      localStorage.setItem("episodeBasic", JSON.stringify(episodeBasic));
      window.location.href = "../specificEpisode/specificEpisode.html";
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
    const container = document.getElementById("all-episodes-container");
    container.innerHTML = "";
    pageData.forEach((episode) => {
      const episodeDiv = document.createElement("div");
      episodeDiv.classList.add("episode-card");
      const portrait = `https://cdn.thesimpsonsapi.com/1280/episode/${episode.id}.webp`;
      console.log(episode.description);
      episodeDiv.innerHTML = `  
              <img src="${portrait}" alt="${episode.name}" id="image"/>
              <button class="heart-overlay" onclick="event.stopPropagation()">🤍</button>
              <div class="card-body">
                <div class="badge-row">
                  <span class="badge badge-season">S${episode.season ?? "?"}</span>
                  <span class="badge badge-ep">Ep. ${episode.episode_number ?? "?"}</span>
                </div>
                <p id="name">${episode.name}</p>
                <p id="air-date">${episode.airdate ?? "Date inconnue"}</p>
                <p id="id" style="display:none">${episode.id}</p>
                <div class="rating-dots">
                  <div class="rating-dot"></div>
                  <div class="rating-dot"></div>
                  <div class="rating-dot"></div>
                  <div class="rating-dot"></div>
                  <div class="rating-dot"></div>
                </div>
              </div>
          `;
      container.appendChild(episodeDiv);
    });
  }