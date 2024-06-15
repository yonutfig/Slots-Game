const ROWS = 3;
const COLS = 3;
const SYMBOLS_IMAGES = {
  A: "./assets/monstru.png",
  B: "./assets/cactus.png",
  C: "./assets/pisica.png",
  D: "./assets/spiderman.png",
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const reels = document.querySelectorAll(".reel");
const balanceDisplay = document.getElementById("balance");
const startingBalanceInput = document.getElementById("startingBalance");
const linesSelect = document.getElementById("lines");
const betInput = document.getElementById("betAmount");
const spinButton = document.getElementById("spinButton");
const resultMessage = document.getElementById("resultMessage");

let balance = 0;
let lines = 3;
let bet = 0;

const spin = () => {
  const reelsResult = [];
  for (let i = 0; i < COLS; i++) {
    reelsResult.push([]);
    for (let j = 0; j < ROWS; j++) {
      const symbolKeys = Object.keys(SYMBOLS_IMAGES);
      const randomSymbol =
        symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
      reelsResult[i].push(randomSymbol);
    }
  }

  console.log("Generated Reels:", reelsResult);

  return reelsResult;
};

const displaySpinning = () => {
  const symbols = Object.keys(SYMBOLS_IMAGES);
  const duration = 5300;
  const interval = 50;
  const totalFrames = duration / interval;
  let frame = 0;

  const spinSound = document.getElementById("spinSound");
  spinSound.play();

  const spinningInterval = setInterval(() => {
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const randomSymbol =
          symbols[Math.floor(Math.random() * symbols.length)];
        const imageSrc = SYMBOLS_IMAGES[randomSymbol];
        reels[
          i * COLS + j
        ].innerHTML = `<img src="${imageSrc}" alt="${randomSymbol}" />`;
      }
    }

    frame++;
    if (frame >= totalFrames) {
      clearInterval(spinningInterval);
      spinSound.pause();
      spinSound.currentTime = 0;

      setTimeout(() => {
        const reelsResult = spin();
        showSymbols(reelsResult);
      }, 50);
    }
  }, interval);
};

const showSymbols = (reelsResult) => {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      const symbol = reelsResult[i][j];
      const imageSrc = SYMBOLS_IMAGES[symbol];
      reels[
        i * COLS + j
      ].innerHTML = `<img src="${imageSrc}" alt="${symbol}" />`;
    }
  }

  const winnings = getWinnings(reelsResult, bet, lines);

  if (winnings > 0) {
    resultMessage.textContent = `You won $${winnings}!`;
  } else {
    resultMessage.textContent = "You didn't win this time.";
  }

  balance += winnings;
  updateBalance();

  if (balance <= 0) {
    resultMessage.textContent = "You are out of balance. Game Over!";
    spinButton.disabled = true;
  }

  spinButton.disabled = false;
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    let allSame = true;
    let symbol = rows[row][0];

    for (let col = 1; col < COLS; col++) {
      if (rows[row][col] !== symbol) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbol];

      for (let col = 0; col < COLS; col++) {
        const imageSrc = SYMBOLS_IMAGES[symbol];
        reels[
          row * COLS + col
        ].innerHTML = `<img src="${imageSrc}" alt="${symbol}" style="border: 2px solid yellow;" />`;
      }
    }
  }

  return winnings;
};

const updateBalance = () => {
  balanceDisplay.textContent = `$${balance.toFixed(2)}`;
};

const updateLines = () => {
  lines = parseInt(linesSelect.value) || 3;
};

const updateBet = () => {
  bet = parseFloat(betInput.value) || 0;
};

startingBalanceInput.addEventListener("input", () => {
  balance = parseFloat(startingBalanceInput.value) || 0;
  updateBalance();
});

linesSelect.addEventListener("change", () => {
  updateLines();
});

betInput.addEventListener("input", () => {
  updateBet();
});

const game = () => {
  updateBalance();
  updateLines();
  updateBet();

  let spinning = false;

  spinButton.addEventListener("click", () => {
    if (spinning) {
      return;
    }

    if (balance <= 0 || isNaN(bet) || bet <= 0 || bet > balance / lines) {
      resultMessage.textContent = "Invalid amount or Inv balance.";
      return;
    }
    spinning = true;

    balance -= bet * lines;
    updateBalance();

    displaySpinning();

    setTimeout(() => {
      spinning = false;
    }, 5300);
  });
};

game();
