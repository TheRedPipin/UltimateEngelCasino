if (localStorage.getItem('money') === null) {
    localStorage.setItem('money', 100);
}

window.onload = function(){
    money = parseFloat(localStorage.getItem('money')).toFixed(2);
    const moneyText = document.getElementById('moneyText');
    moneyText.innerText = `💎Gems: ${money}`;
    
    const boxes = document.getElementsByClassName("gameBox")
    let rand;
    let neg;
    for (let i = 0; i < boxes.length; i++){
        rand = Math.floor(Math.random() * 10);
        neg = Math.random();
        if (neg < 0.5 ){
            rand*=-1;
        }
        boxes[i].style.rotate = `${rand}deg`;
    };
};

function switchPage(URL){
    window.location.href = URL;
};