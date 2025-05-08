let balance = parseFloat(localStorage.getItem('money')) || 100;
let currentWinnings = 0;

window.onload = function () {
    document.getElementById("balanceText").innerText = balance.toFixed(2);
};

function startGame() {
    const wager = parseFloat(document.getElementById("wagerInput").value);
    const message = document.getElementById("message");

    if (isNaN(wager) || wager <= 0) {
        message.innerText = "🚫 Enter a valid wager.";
        return;
    }

    if (wager > balance) {
        message.innerText = "❌ Not enough balance!";
        return;
    }

    balance -= wager;
    currentWinnings = wager;
    updateBalance();
    document.getElementById("currentWinnings").innerText = currentWinnings.toFixed(2);

    document.getElementById("gameplay").style.display = "block";
    message.innerText = "";
    document.getElementById("wagerInput").value = "";
}

function double() {
    const message = document.getElementById("message");
    const container = document.querySelector(".container");

    const success = Math.random() < 0.5;

    if (success) {
        currentWinnings *= 2;
        document.getElementById("currentWinnings").innerText = currentWinnings.toFixed(2);
        message.innerText = "✨ Success! You doubled your winnings!";
        showSparkle();
    } else {
        currentWinnings = 0;
        document.getElementById("currentWinnings").innerText = "0.00";
        document.getElementById("gameplay").style.display = "none";
        message.innerText = "💥 Oops! You lost everything!";
        container.classList.add("shake");
        setTimeout(() => container.classList.remove("shake"), 400);
    }
}

function cashout() {
    balance += currentWinnings;
    localStorage.setItem('money', balance);
    updateBalance();

    const message = document.getElementById("message");
    message.innerText = `✅ You cashed out ${currentWinnings.toFixed(2)} gems! 🎉`;
    showSparkle();

    currentWinnings = 0;
    document.getElementById("currentWinnings").innerText = "0.00";
    document.getElementById("gameplay").style.display = "none";
}

function updateBalance() {
    document.getElementById("balanceText").innerText = balance.toFixed(2);
}

function showSparkle() {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    document.querySelector(".container").appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1200);
}

function returnToSender() {
    money = parseFloat(balance).toFixed(2);
    localStorage.setItem('money', balance);
    window.location.href = '../index.html';
}
