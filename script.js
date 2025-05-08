if (localStorage.getItem('money') === null) {
    localStorage.setItem('money', 100);
}

window.onload = function () {
    const money = parseFloat(localStorage.getItem('money')).toFixed(2);
    const moneyText = document.getElementById('moneyText');
    moneyText.innerText = `💎Gems: ${money}`;

    const boxes = document.getElementsByClassName("gameBox");
    const hoverBox = document.getElementById("hoverBox");

    for (let i = 0; i < boxes.length; i++) {
        let rand = Math.floor(Math.random() * 10);
        if (Math.random() < 0.5) rand *= -1;
        boxes[i].style.rotate = `${rand}deg`;

        // Show hover info box
        boxes[i].addEventListener("mousemove", function (e) {
            let info = getGameInfo(this);
            hoverBox.innerText = info;
            hoverBox.style.display = "block";
            hoverBox.style.left = e.pageX + 15 + "px";
            hoverBox.style.top = e.pageY + 15 + "px";
        });

        boxes[i].addEventListener("mouseleave", function () {
            hoverBox.style.display = "none";
        });
    }
};

function switchPage(URL) {
    window.location.href = URL;
}

// Game info function
function getGameInfo(element) {
    const img = element.querySelector("img");

    if (img) {
        const alt = img.alt;

        if (alt === "Double or Nothing") {
            return (
                "🎰 Double or Nothing\n" +
                "• House Edge: 0%\n" +
                "• Risk Level: 😪 Low\n" +
                "• Max Payout: 💎 Infinite\n" +
                "• Description: A high-stakes flip — double or lose it all!"
            );
        } else if (alt === "Mines") {
            return (
                "💣 Mines\n" +
                "• House Edge: 2.0%\n" +
                "• Risk Level: ⚠️ Medium\n" +
                "• Max Payout: 💎 x1741298.43 (depends on mines)\n" +
                "• Description: Pick safe tiles and dodge the bombs!"
            );
        }
    }

    if (element.classList.contains("Construct")) {
        return (
            "🚧 Under Construction\n" +
            "• House Edge: Unknown\n" +
            "• Risk Level: Unknown\n" +
            "• Max Payout: N/A\n" +
            "• Description: This game is currently in development."
        );
    }

    return "🎮 Game Info Not Available";
}
