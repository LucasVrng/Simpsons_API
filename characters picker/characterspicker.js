let favoriteCharacters = [];
let seenCharacters = [];
let numberofturns = 0;
let levelnumber = 0;

const res = await fetch('../characters/characters.json');
const cache = await res.json(); 
let currentData = cache; 

document.getElementById("loading").style.display = "none";
document.getElementById("loading-text").style.display = "none";     

let totalCharacters = cache
let duration = totalCharacters.length

console.log(cache);

document.getElementById("turns-number").textContent = `Round: 0`;
document.getElementById("level-number").textContent = `Level: 0`;


document.getElementById("character-picker").addEventListener("click", (event) => {
    const card = event.target.closest(".character-card");
    const character = totalCharacters.find(c => c.name === card.querySelector("#name").textContent);
    if (!card) return;
    favoriteCharacters.push(character);
    console.log("favorites:", favoriteCharacters);
    numberofturns++;

    if (numberofturns >= Math.floor(totalCharacters.length/2)) {
        numberofturns = 0;
        levelnumber++;
        duration = Math.floor(duration/2)
        console.log("duration:", duration);
        if (duration==1) {
            displayWinnerData();
            return;
        }
        totalCharacters=favoriteCharacters
        favoriteCharacters = [];
        seenCharacters = [];
    }

    
    document.getElementById("recent-choice").textContent = `You chose: ${character.name}`;
    document.getElementById("turns-number").textContent = `Round: ${numberofturns}`;
    document.getElementById("level-number").textContent = `Level: ${levelnumber}`;
    displayCurrentData();
});
    
displayCurrentData();

function displayWinnerData() {
    const container = document.getElementById("character-picker");
    container.innerHTML = "";
        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character-card","winner");
        const portrait = `https://cdn.thesimpsonsapi.com/500/character/${favoriteCharacters[0].id}.webp`;
        characterDiv.innerHTML = `  
            <img src="${portrait}" alt="${favoriteCharacters[0].name}" id="characterpicker"/>
            <h3 id="name">${favoriteCharacters[0].name}</h3>
        `;
        container.appendChild(characterDiv);
    document.getElementById("recent-choice").textContent = `${favoriteCharacters[0].name} is officially your favorite character!`;
    document.getElementById("turns-number").style.display = "none";
    document.getElementById("level-number").style.display = "none";
}

function displayCurrentData() {
    const currentData = [];
    let randomchoice1;
    let randomchoice2;

    do {
    randomchoice1 = Math.floor(Math.random() * totalCharacters.length);
    } while (seenCharacters.includes(totalCharacters[randomchoice1]));

    do {
    randomchoice2 = Math.floor(Math.random() * totalCharacters.length);
    } while (seenCharacters.includes(totalCharacters[randomchoice2]) || randomchoice2 == randomchoice1);

    console.log("totalcharactersoptions",totalCharacters[randomchoice1], totalCharacters[randomchoice2]);

    currentData.push(totalCharacters[randomchoice1]);
    currentData.push(totalCharacters[randomchoice2]);
    seenCharacters.push(...currentData);
    if (totalCharacters.length-seenCharacters.length ==1) {
        const remainingCharacter = totalCharacters.filter(character => !seenCharacters.includes(character));
        currentData.push(remainingCharacter[0])
        seenCharacters.push(...remainingCharacter);
    }
    console.log("currentdata",currentData);
    const container = document.getElementById("character-picker");
    container.innerHTML = "";
    currentData.forEach(character => {
        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character-card");
        const portrait = `https://cdn.thesimpsonsapi.com/500/character/${character.id}.webp`;
        characterDiv.innerHTML = `  
            <img src="${portrait}" alt="${character.name}" id="characterpicker"/>
            <h3 id="name">${character.name}</h3>
        `;
        container.appendChild(characterDiv);
    });
}

//need to rethink the functions to allow having multiple characters to choose from to save time
