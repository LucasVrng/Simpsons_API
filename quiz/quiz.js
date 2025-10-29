const charResponse = await fetch("../database/characters.json");
const characters = await charResponse.json();

const episodeResponse = await fetch("../database/episodes.json");
const episodes = await episodeResponse.json();

const locationResponse = await fetch("../database/locations.json");
const locations = await locationResponse.json();

let score = 0;
let currentAnswer = null;
let isAnswering = false;

document.getElementById("score").textContent = `Score: ${score}`;

document
  .getElementById("answers-container")
  .addEventListener("click", handleAnswer);

chooseTheQuestion();

function handleAnswer(event) {
  const choice = event.target.closest(".answer");
  if (!choice || !currentAnswer || isAnswering) return;

  isAnswering = true;
  let userchoice = choice.querySelector("#name").textContent;
  console.log(userchoice);
  console.log(currentAnswer);

  if (userchoice === currentAnswer) {
    score++;
    console.log("Excellent! 🎉");
    choice.style.backgroundColor = "#90EE90";
  } else {
    console.log("You suck McBain! 😢");
    choice.style.backgroundColor = "#FFB6C1";

    const allAnswers = document.querySelectorAll(".answer");
    allAnswers.forEach((answer) => {
      if (answer.querySelector("#name").textContent === currentAnswer) {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
          if (flashCount % 2 === 0) {
            answer.style.backgroundColor = "#90EE90";
          } else {
            answer.style.backgroundColor = "white";
          }
          flashCount++;
          if (flashCount >= 6) {
            clearInterval(flashInterval);
            answer.style.backgroundColor = "#90EE90";
          }
        }, 200);
      }
    });
  }

  document.getElementById("score").textContent = `Score: ${score}`;

  setTimeout(() => {
    isAnswering = false;
    chooseTheQuestion();
  }, 1500);
}

function chooseTheQuestion() {
  const questionsstyles = [
    "guessTheCharacterByScreenshot",
    "guessTheCharacterByName",
    "guessTheEpisodeByScreenshot",
    "guessTheLocation",
    "guessTheEpisodeBySynopsis",
  ];
  const choosequestion = Math.floor(Math.random() * questionsstyles.length);

  switch (questionsstyles[choosequestion]) {
    case "guessTheCharacterByScreenshot":
      renderGuessTheCharacterByScreenshot();
      break;
    case "guessTheCharacterByName":
      renderGuessTheCharacterByScreenshot();
      break;
    case "guessTheEpisodeByScreenshot":
      renderGuessTheEpisodeByScreenshot();
      break;
    case "guessTheLocation":
      renderGuessTheLocation();
      break;
    case "guessTheEpisodeBySynopsis":
      renderGuessTheEpisodeBySynopsis();
      break;
  }
}

function renderGuessTheCharacterByScreenshot() {
  let answerChoice = Math.floor(Math.random() * characters.length);
  let answers = [];

  for (let i = 0; i < 3; i++) {
    answers.push(
      characters[Math.floor(Math.random() * characters.length)].name,
    );
  }

  let answerCharacter = characters[answerChoice];
  currentAnswer = answerCharacter.name;

  answers.splice(((answers.length + 1) * Math.random()) | 0, 0, currentAnswer);

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = "";
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/character/${answerCharacter.id}.webp`;
  characterDiv.innerHTML = `<img src="${portrait}" alt="${currentAnswer}" id="image"/>`;
  questionContainer.appendChild(characterDiv);

  renderAnswers(answers);
}

function renderGuessTheCharacterByName() {
  let answerChoice = Math.floor(Math.random() * characters.length);
  let answers = [];

  for (let i = 0; i < 3; i++) {
    answers.push(characters[Math.floor(Math.random() * characters.length)]);
  }

  let answerCharacter = characters[answerChoice];
  currentAnswer = answerCharacter.name;

  answers.splice(
    ((answers.length + 1) * Math.random()) | 0,
    0,
    answerCharacter,
  );

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = "";
  const characterDiv = document.createElement("div");
  characterDiv.classList.add("character-card");
  characterDiv.innerHTML = `<p id="name">${answerCharacter.name}</p>`;
  questionContainer.appendChild(characterDiv);

  renderAnswersImages(answers, "character");
}

function renderGuessTheEpisodeByScreenshot() {
  let answerChoice = Math.floor(Math.random() * episodes.length);
  let answers = [];

  for (let i = 0; i < 3; i++) {
    answers.push(episodes[Math.floor(Math.random() * episodes.length)].name);
  }

  let answerEpisode = episodes[answerChoice];
  currentAnswer = answerEpisode.name;

  answers.splice(((answers.length + 1) * Math.random()) | 0, 0, currentAnswer);

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = "";
  const episodeDiv = document.createElement("div");
  episodeDiv.classList.add("episode-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/episode/${answerEpisode.id}.webp`;
  episodeDiv.innerHTML = `<img src="${portrait}" alt="${currentAnswer}" id="image"/>`;
  questionContainer.appendChild(episodeDiv);

  renderAnswers(answers);
}

function renderGuessTheEpisodeBySynopsis() {
  let answerChoice;
  do {
    answerChoice = Math.floor(Math.random() * episodes.length);
  } while (answerChoice == "Unknown");

  let answers = [];

  for (let i = 0; i < 3; i++) {
    answers.push(episodes[Math.floor(Math.random() * episodes.length)]);
  }

  let answerEpisode = episodes[answerChoice];
  currentAnswer = answerEpisode.name;

  answers.splice(((answers.length + 1) * Math.random()) | 0, 0, answerEpisode);

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = "";
  const episodeDiv = document.createElement("div");
  episodeDiv.classList.add("synopsis-card");
  episodeDiv.innerHTML = `<p id="synopsis">${answerEpisode.synopsis}</p>`;
  questionContainer.appendChild(episodeDiv);

  renderAnswersImages(answers, "episode");
}

function renderGuessTheLocation() {
  let answerChoice = Math.floor(Math.random() * locations.length);
  let answers = [];

  for (let i = 0; i < 3; i++) {
    answers.push(locations[Math.floor(Math.random() * locations.length)].name);
  }

  let answerLocation = locations[answerChoice];
  currentAnswer = answerLocation.name;

  answers.splice(((answers.length + 1) * Math.random()) | 0, 0, currentAnswer);

  const questionContainer = document.getElementById("question-container");
  questionContainer.innerHTML = "";
  const locationDiv = document.createElement("div");
  locationDiv.classList.add("location-card");
  const portrait = `https://cdn.thesimpsonsapi.com/1280/location/${answerLocation.id}.webp`;
  locationDiv.innerHTML = `<img src="${portrait}" alt="${currentAnswer}" id="image"/>`;
  questionContainer.appendChild(locationDiv);

  renderAnswers(answers);
}

function renderAnswers(answers) {
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  answers.forEach((name) => {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answer");
    answersDiv.innerHTML = `<h3 id="name">${name}</h3>`;
    answersContainer.appendChild(answersDiv);
  });
}

function renderAnswersImages(answers, type) {
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  answers.forEach((answer) => {
    const answersDiv = document.createElement("div");
    answersDiv.classList.add("answer", "answer-image");
    const portrait = `https://cdn.thesimpsonsapi.com/1280/${type}/${answer.id}.webp`;
    answersDiv.innerHTML = `<img src="${portrait}" alt="${answer.name}" class="answer-img"> 
        <h4 id="name">${answer.name}</h4>`;
    answersContainer.appendChild(answersDiv);
  });
}
