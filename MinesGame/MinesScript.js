let map = [];
let rows = 5;
let columns = 5;
let tempMoney = 0;
let currentMulti = 1.0;
let money = 0;
let lost = false;
let gameStarted = false;
let animationsInProgress = false;

const startingMulti = [
    1.10, 1.15, 1.20, 1.25, 1.30, 1.35, 1.40, 1.45, 1.50, 1.55,
    1.60, 1.65, 1.70, 1.75, 1.80, 1.85, 1.90, 1.95, 2.00, 2.05
];

// Initialize game state
window.onload = initializeGame;

// Initialize the game board and set up event listeners
function initializeGame() {
    loadMoney();
    createGameBoard(); // Create the map in the DOM
    updateUIElements();
    setupEventListeners();
}

// Load saved money from localStorage
function loadMoney() {
    money = parseFloat(localStorage.getItem('money') || '0').toFixed(2);
    updateMoneyText();
    document.getElementById('betInput').max = money; // Set the max value of bet input to the amount of money
}

// Create the game board with buttons
function createGameBoard() {
    const mapShell = document.getElementById('mapShell');
    const endBox = document.getElementById('endBox');
    mapShell.innerHTML = ''; // Clear existing map elements
    mapShell.appendChild(endBox); // Append the end box to the map shell
    mapShell.style.display = 'grid'; // Use CSS grid for layout
    mapShell.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; // Set column count
    mapShell.style.gap = '5px'; // Add spacing between buttons

    map = []; // Reset map array

    for (let i = 0; i < rows; i++) {
        map.push([]);
        for (let j = 0; j < columns; j++) {
            map[i].push(0); // Initialize map value as 0

            // Create a button for each cell
            const button = document.createElement('button');
            button.classList.add('mapSpot');
            button.disabled = true; // Initially disabled until the game starts
            button.dataset.row = i; // Assign row index
            button.dataset.column = j; // Assign column index

            // Add click event listener
            button.addEventListener('click', handleSpotClick);

            // Append the button to the DOM
            mapShell.appendChild(button);
        }
    }
}

// Update UI elements periodically
function updateUIElements() {
    setInterval(() => {
        document.getElementById('resetBtn').innerText = `Cash Out\n💎${(tempMoney * currentMulti).toFixed(2)}`;
        document.getElementById('multiText').innerText = `x${currentMulti.toFixed(2)}`;
        updateMoneyText();
    }, 100);
}

// Update displayed money
function updateMoneyText() {
    document.getElementById('moneyText').innerText = `💎Balance: ${parseFloat(money).toFixed(2)}`;
}

// Set up general event listeners
function setupEventListeners() {
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (gameStarted && !animationsInProgress) {
            resetGame(1);
        }
    });
    validateInputsContinuously();
}

// Validate numeric inputs
function validateInputsContinuously() {
    const betInput = document.getElementById('betInput');
    const bombInput = document.getElementById('bombInput');

    betInput.addEventListener('input', () => validateBetInput(betInput));
    bombInput.addEventListener('input', () => validateBombInput(bombInput));
}

function validateBetInput(input) {
    let value = parseFloat(input.value);
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || Infinity;
    if (value < min) {
        input.value = min.toFixed(2);
    } else if (value > max) {
        input.value = max.toFixed(2);
    }
    if (value > money) {
        input.value = money.toFixed(2); // Set the bet input value to the available money if it exceeds the current money
    }
}

function validateBombInput(input) {
    let value = parseInt(input.value);
    const min = parseInt(input.min) || 0;
    const max = parseInt(input.max) || Infinity;
    if (value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    } else {
        input.value = value;
    }
}

// Handle game board spot click
function handleSpotClick() {
    const row = parseInt(this.dataset.row);
    const column = parseInt(this.dataset.column);
    this.disabled = true; // Disable the button after it is clicked
    if (map[row][column] === 1) {
        processBombClick(this, row, column);
    } else {
        processGemClick(this, row, column);
    }
    gameStarted = true;
}

// Handle a bomb click
function processBombClick(button, row, column) {
    animationsInProgress = true;
    document.getElementById('resetBtn').disabled = true; // Disable reset button immediately
    button.classList.add('shake');
    setTimeout(() => {
        button.classList.remove('shake');
        button.classList.add('fadeIn'); // Add fadeIn class
        button.style.backgroundColor = 'red';
        button.innerText = '💣';
        stopAllFadeInAnimations(); // Stop all fade-in animations
        animationsInProgress = false;
        resetGame(0); // Player lost
    }, 500);
}

// Handle a gem click
function processGemClick(button, row, column) {
    animationsInProgress = true;
    button.classList.add('shake');
    setTimeout(() => {
        button.classList.remove('shake');
        button.classList.add('fadeIn'); // Add fadeIn class
        button.style.backgroundColor = '#27AE60';
        button.innerText = '💎';
        map[row][column] = 2;
        calculateNextMultiplier();
        checkWinCondition();
        animationsInProgress = false;
    }, 500);
}

// Stop all fade-in animations
function stopAllFadeInAnimations() {
    const buttons = document.getElementsByClassName('mapSpot');
    for (let button of buttons) {
        button.classList.remove('fadeIn');
    }
}

// Calculate the next multiplier based on remaining bombs and squares
function calculateNextMultiplier() {
    let remainingSquares = 0;
    let remainingBombs = 0;
    map.forEach(row => row.forEach(cell => {
        if (cell === 0) remainingSquares++;
        if (cell === 1) remainingBombs++;
    }));
    if (remainingSquares > 0) {
        currentMulti *= Math.pow(1 + (remainingBombs / remainingSquares), 1.55);
    }
}

// Check if all gems have been found
function checkWinCondition() {
    const allFound = map.flat().every(cell => cell !== 0);
    if (allFound) {
        setTimeout(() => alert('You won!'), 100);
        resetGame(1); // Player won
    }
}

// Reset game state
function resetGame(type) {
    lost = type === 0;
    gameStarted = false;
    animationsInProgress = false;
    map.forEach((row, i) => row.forEach((cell, j) => {
        const button = document.querySelector(`button[data-row="${i}"][data-column="${j}"]`);
        button.style.backgroundColor = cell === 1 ? 'red' : 'green';
        button.innerText = cell === 1 ? '💣' : '💎';
        button.disabled = true; // Disable all buttons when the game ends
    }));
    finalizeReset(type);
}

// Finalize game reset
function finalizeReset(type) {
    const betInput = parseFloat(tempMoney) || 0;
    money += type === 1 ? betInput * currentMulti : 0;
    updateMoneyText();
    document.getElementById('resetBtn').disabled = true;
    document.getElementById('startBtn').disabled = false;
    document.getElementById('betInput').max = money; // Update the max value of bet input
    if (parseFloat(document.getElementById('betInput').value) > money) {
        document.getElementById('betInput').value = money.toFixed(2); // Set the bet input value to the available money if it exceeds the current money
    }
    showEndBox(type);
}

// Show end box with appropriate message
function showEndBox(type) {
    const endBox = document.getElementById('endBox');
    const endBoxTitle = document.getElementById('endBoxTitle');
    const endBoxMessage = document.getElementById('endBoxMessage');

    if (type === 1) {
        endBoxTitle.innerText = 'Congratulations!';
        endBoxMessage.innerText = `You won 💎${(tempMoney * currentMulti).toFixed(2)}!`;
        endBox.classList.add('win');
        endBox.classList.remove('lose');
    } else {
        endBoxTitle.innerText = 'Game Over';
        endBoxMessage.innerText = 'You hit a bomb!';
        endBox.classList.add('lose');
        endBox.classList.remove('win');
    }

    endBox.classList.add('visible');
}

// Start a new game
function startGame() {
    tempMoney = parseFloat(document.getElementById('betInput').value);
    console.log(tempMoney);
    if (!tempMoney || tempMoney <= 0) {
        alert('Bet amount must be greater than 0.');
        return;
    }
    createGameBoard(); // Recreate the map for a fresh start
    money -= tempMoney;
    placeBombs(parseInt(document.getElementById('bombInput').value) || 1);
    currentMulti = 1.0;
    enableButtons(); // Enable buttons when the game starts
    document.getElementById('startBtn').disabled = true; // Disable start button
    document.getElementById('resetBtn').disabled = false; // Enable reset button
    document.getElementById('endBox').classList.remove('visible'); // Hide end box
}

// Enable all buttons on the game board
function enableButtons() {
    const buttons = document.getElementsByClassName('mapSpot');
    for (let button of buttons) {
        button.disabled = false;
    }
}

// Place bombs randomly on the map
function placeBombs(count) {
    while (count > 0) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * columns);
        if (map[row][col] === 0) {
            map[row][col] = 1;
            count--;
        }
    }
}

function returnToSender() {
    money = parseFloat(money).toFixed(2);
    localStorage.setItem('money', money);
    window.location.href = '../index.html';
}
