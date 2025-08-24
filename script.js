let wordLength = 5;
let targetWord = "";
let maxGuesses = 6;
let currentRow = 0;
let currentGuess = "";
let gameOver = false;
let wordList = [];

const board = document.getElementById("game-board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const selectorButtons = document.querySelectorAll("#word-length-selector button");

const keyboardContainer = document.getElementById("keyboard");

const KEYS = [
  ..."QWERTYUIOP",
  ..."ASDFGHJKL",
  ..."ZXCVBNM"
];


selectorButtons.forEach(btn => {
  btn.addEventListener("click", async () => {
    wordLength = parseInt(btn.dataset.length);
    await startGame();
  });
});

async function loadWords(length) {
  const response = await fetch(`words/words${length}.json`);
  const data = await response.json();
  return data;
}

function pickRandomWord(words) {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex].toUpperCase();
}

function createKeyboard() {
  keyboardContainer.innerHTML = "";

  const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
  ];

  rows.forEach((row, index) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");

    if (index === 2) {
      const enter = document.createElement("button");
      enter.textContent = "Enter";
      enter.className = "key wide";
      enter.addEventListener("click", () => handleKey({ key: "Enter" }));
      rowDiv.appendChild(enter);
    }

    row.split("").forEach(letter => {
      const key = document.createElement("button");
      key.textContent = letter;
      key.className = "key";
      key.setAttribute("data-key", letter);
      key.addEventListener("click", () => handleKey({ key: letter }));
      rowDiv.appendChild(key);
    });

    if (index === 2) {
      const back = document.createElement("button");
      back.textContent = "⌫";
      back.className = "key wide";
      back.addEventListener("click", () => handleKey({ key: "Backspace" }));
      rowDiv.appendChild(back);
    }

    keyboardContainer.appendChild(rowDiv);
  });
}



document.addEventListener("keydown", handleKey);

function handleKey(e) {
  if (gameOver) return;
  const key = e.key.toUpperCase();

  if (key === "ENTER") {
    submitGuess();
  } else if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateRow();
  } else if (/^[A-Z]$/.test(key) && currentGuess.length < wordLength) {
    currentGuess += key;
    updateRow();
  }
}

function updateRow() {
  const row = board.children[currentRow];
  for (let i = 0; i < wordLength; i++) {
    row.children[i].textContent = currentGuess[i] || "";
  }
}

function submitGuess() {
  if (currentGuess.length !== wordLength) {
    showMessage("⛔ Not enough letters");
    return;
  }

  if (!wordList.includes(currentGuess.toLowerCase())) {
    showMessage("❌ Not a valid word");
    return;
  }

  const row = board.children[currentRow];
  const guessArray = currentGuess.split("");
  const targetArray = targetWord.split("");

  for (let i = 0; i < wordLength; i++) {
    const cell = row.children[i];
    const letter = guessArray[i];

const keyButton = document.querySelector(`.key[data-key='${letter}']`);

if (letter === targetArray[i]) {
  cell.classList.add("correct");
  if (keyButton) keyButton.classList.remove("present", "absent"), keyButton.classList.add("correct");
} else if (targetArray.includes(letter)) {
  cell.classList.add("present");
  if (keyButton && !keyButton.classList.contains("correct")) {
    keyButton.classList.remove("absent");
    keyButton.classList.add("present");
  }
} else {
  cell.classList.add("absent");
  if (keyButton && !keyButton.classList.contains("correct") && !keyButton.classList.contains("present")) {
    keyButton.classList.add("absent");
  }
}

  }

  if (currentGuess === targetWord) {
    showMessage("🎉 You guessed it!");
    endGame();
    return;
  }

  currentRow++;
  currentGuess = "";

  if (currentRow === maxGuesses) {
    showMessage(`❌ Game Over! Word was: ${targetWord}`);
    endGame();
  }
}


function showMessage(msg) {
  message.textContent = msg;
}

function endGame() {
  gameOver = true;
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", startGame);

async function startGame() {
  gameOver = false;
  currentRow = 0;
  currentGuess = "";
  message.textContent = "";
  restartBtn.style.display = "none";
  wordList = await loadWords(wordLength);
  targetWord = pickRandomWord(wordList);
  createBoard();
  createKeyboard();  // ADD THIS
  updateRow();
}


window.addEventListener("load", () => {
  startGame();
});



function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let j = 0; j < wordLength; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      row.appendChild(cell);
    }
    board.appendChild(row);
  }
}
