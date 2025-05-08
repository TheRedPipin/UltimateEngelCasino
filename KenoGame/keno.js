const maxPicks = 10;
let selectedNumbers = [];

let balance = parseFloat(localStorage.getItem('money')) || 100;

window.onload = () => {
  initBoard();
  updateBalanceDisplay();
  document.getElementById("playBtn").addEventListener("click", playGame);
};

function clearDrawnHighlights() {
  document.querySelectorAll(".number").forEach(cell => {
    cell.classList.remove("drawn", "match");
  });
}

function initBoard() {
  const board = document.getElementById("kenoBoard");
  board.innerHTML = ""; // Reset board visually
  selectedNumbers = []; // Reset selection

  for (let i = 1; i <= 80; i++) {
    const cell = document.createElement("div");
    cell.classList.add("number");
    cell.innerText = i;
    cell.dataset.num = i;
    cell.addEventListener("click", () => togglePick(cell));
    board.appendChild(cell);
  }
}

function togglePick(cell) {
  clearDrawnHighlights(); // 🟠 Clear old draw colors on new interaction

  const num = parseInt(cell.dataset.num);
  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    selectedNumbers = selectedNumbers.filter(n => n !== num);
  } else {
    if (selectedNumbers.length >= maxPicks) return;
    cell.classList.add("selected");
    selectedNumbers.push(num);
  }
}


function getBalance() {
  return parseFloat(localStorage.getItem("money")) || 1000;
}

function setBalance(amount) {
  localStorage.setItem("money", amount.toFixed(2));
}

function updateBalanceDisplay() {
  const balance = getBalance();
  document.getElementById("balanceText").innerText = balance.toFixed(2);
}

function playGame() {
  const bet = parseFloat(document.getElementById("betAmount").value);
  const balance = getBalance();

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert("Invalid bet or insufficient balance.");
    return;
  }

  if (selectedNumbers.length === 0) {
    alert("Pick at least one number.");
    return;
  }

  clearDrawnHighlights(); // 🟠 Clear previous drawn/match colors

  setBalance(balance - bet);
  updateBalanceDisplay();

  const drawn = drawNumbers();
  const hits = selectedNumbers.filter(n => drawn.includes(n));

  const payout = getPayout(selectedNumbers.length, hits.length);
  const winnings = bet * payout;

  setBalance(getBalance() + winnings);
  updateBalanceDisplay();

  showDrawnNumbers(drawn, hits);

  const resultBox = document.getElementById("resultBox");
  resultBox.innerHTML = `
    You matched <strong>${hits.length}</strong> numbers.
    <br>Payout multiplier: x${payout}
    <br>Winnings: 💰 ${winnings.toFixed(2)}
  `;
}

function drawNumbers() {
  const nums = Array.from({ length: 80 }, (_, i) => i + 1);
  const drawn = [];

  while (drawn.length < 20) {
    const index = Math.floor(Math.random() * nums.length);
    drawn.push(nums.splice(index, 1)[0]);
  }

  return drawn;
}

function showDrawnNumbers(drawn, hits) {
  document.querySelectorAll(".number").forEach(cell => {
    const num = parseInt(cell.dataset.num);
    if (drawn.includes(num)) cell.classList.add("drawn");
    if (hits.includes(num)) cell.classList.add("match");
  });
}

function getPayout(picks, hits) {
  const table = {
    1: [0, 3],
    2: [0, 1, 9],
    3: [0, 1, 2, 16],
    4: [0, 0.5, 2, 6, 24],
    5: [0, 0.5, 2, 5, 15, 50],
    6: [0, 0.5, 1, 3, 10, 30, 75],
    7: [0, 0.5, 1, 2, 5, 20, 60, 150],
    8: [0, 0.5, 1, 2, 4, 10, 30, 80, 200],
    9: [0, 0.5, 1, 1.5, 3, 8, 25, 70, 150, 400],
    10: [0, 0.5, 1, 1.2, 2, 6, 20, 50, 120, 300, 1000]
  };

  return table[picks]?.[hits] || 0;
}

function returnToSender() {
  money = parseFloat(getBalance()).toFixed(2);
  localStorage.setItem('money', getBalance());
  window.location.href = '../index.html';
}
