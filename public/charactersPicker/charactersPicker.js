  let favoriteCharacters = [];
  let numberofturns = 16;
  let levelnumber = 1;
  let roundNumber = 1;

  const res = await fetch("../database/characters.json");
  const cache = await res.json();

  document.getElementById("loading").style.display = "none";
  document.getElementById("loading-text").style.display = "none";

  let totalCharacters = [...cache];
  let numberOfRounds = Math.ceil(totalCharacters.length/numberofturns);

  document.getElementById("turns-number").textContent = `Round: 0/${numberOfRounds}`;
  document.getElementById("level-number").textContent = `Level: 1`;

  document.getElementById("submit").addEventListener("click",() => {
    gameLoop()
  })

  document.addEventListener("keydown", (event) => {
    if (event.key=="Enter") {
      gameLoop()
    }
  })

  function gameLoop() {
    console.log("round Number", roundNumber)
    console.log("Number of rounds", numberOfRounds)
    if(roundNumber!=numberOfRounds) {
      roundNumber++
      document.getElementById("turns-number").textContent = `Round: ${roundNumber}/${numberOfRounds}`;
      displayCurrentData()
    } 
    else {
      if (favoriteCharacters.length==1) {
        displayWinnerData()
      } else {
        roundNumber=1
      levelnumber++
      totalCharacters = favoriteCharacters
      favoriteCharacters = []
      numberOfRounds = Math.ceil(totalCharacters.length/numberofturns);
      document.getElementById("turns-number").textContent = `Round: ${roundNumber}/${numberOfRounds}`;
      document.getElementById("level-number").textContent = `Level: ${levelnumber}`;
      displayCurrentData()
      }
      
    }
  }

  displayCurrentData();

  function displayWinnerData() {
    const container = document.getElementById("character-picker");
    container.innerHTML = "";
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("character-card", "winner");
    const portrait = `https://cdn.thesimpsonsapi.com/500/character/${favoriteCharacters[0].id}.webp`;
    characterDiv.innerHTML = `  
              <img src="${portrait}" alt="${favoriteCharacters[0].name}" class="characterpicker"/>
              <h3 class="character-name">${favoriteCharacters[0].name}</h3>
          `;
    container.appendChild(characterDiv);
    document.getElementById("winner").textContent =
      `${favoriteCharacters[0].name} is officially your favorite character!`;
    document.getElementById("turns-number").style.display = "none";
    document.getElementById("level-number").style.display = "none";
  }

  function displayCurrentData() {
    const currentData = [];
    let randomchoice;

    const container = document.getElementById("character-picker");

    const turnsThisRound = Math.min(numberofturns, totalCharacters.length);
    for (let i=0;i<turnsThisRound;i++) {
      const randomIndex = Math.floor(Math.random() * totalCharacters.length)
      randomchoice = totalCharacters[randomIndex]
      currentData.push(randomchoice);
      totalCharacters.splice(randomIndex, 1)
    }
    
    container.innerHTML = "";
    currentData.forEach((character) => {
      const characterDiv = document.createElement("div");
      characterDiv.addEventListener("click",()=> {
        saveCharacter(characterDiv,character)
      });
      characterDiv.classList.add("character-card");
      const portrait = `https://cdn.thesimpsonsapi.com/500/character/${character.id}.webp`;
      characterDiv.innerHTML = `  
              <img src="${portrait}" alt="${character.name}" class="characterpicker"/>
              <h3 class="character-name">${character.name}</h3>
          `;
      container.appendChild(characterDiv);
    });
  }

  function saveCharacter(characterDiv,character) {
    if (!favoriteCharacters.includes(character)) {
      favoriteCharacters.push(character)
      characterDiv.classList.add("selected");
    } else {
      const index = favoriteCharacters.indexOf(character)
      favoriteCharacters.splice(index,1)
      characterDiv.classList.remove("selected");
    }
  }
