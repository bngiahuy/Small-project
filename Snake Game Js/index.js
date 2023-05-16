const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
const snakeBody = [];
let setIntervalId;
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

// Pass a random between 1 and 30 as food position
const updateFoodPostition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over!");
    location.reload(); // reload page
}

const handleControls = e => {
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityY = -1;
        velocityX = 0;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityY = 1;
        velocityX = 0;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityY = 0;
        velocityX = -1;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityY = 0;
        velocityX = 1;
    }

}

controls.forEach(button => button.addEventListener("click", () => handleControls({ key: button.dataset.key })));


const initGame = () => {
    if (gameOver) {
        return handleGameOver();
    }

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    // When snake eat food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPostition();
        snakeBody.push([foodX, foodY]);

        score++;
        highScore = Math.max(score, highScore);

        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody.pop();
    snakeBody.unshift([snakeX, snakeY]);

    // Touch walls, lose
    if (snakeX <= 0 || snakeX > 30) return gameOver = true;
    if (snakeY <= 0 || snakeY > 30) return gameOver = true;


    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // If head hits body -> lose
        if (i !== 0 && snakeBody[i][1] === snakeBody[0][1] && snakeBody[i][0] === snakeBody[0][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;


}

let gameSpeed = 300; //default value
const speedInput = document.getElementById("speed");

// speedInput.addEventListener("keyup", function (e) {
//     if (e.code === 38 || e.code === 40) { //up or down
//         e.preventDefault();
//     }
// })

speedInput.addEventListener("change", () => {

    const selectedSpeed = parseInt(speedInput.value);
    let gameSpeed;
    console.log(`Before: ${gameSpeed}`);
    if (selectedSpeed === 1) gameSpeed = 300;
    else if (selectedSpeed === 2) gameSpeed = 200;
    else if (selectedSpeed === 3) gameSpeed = 100;
    else gameSpeed = 50;
    console.log(`After: ${gameSpeed}`);

    // updateFoodPostition();
    clearInterval(setIntervalId); // Clear the previous interval
    setIntervalId = setInterval(initGame, gameSpeed);
})
updateFoodPostition();
setIntervalId = setInterval(initGame, parseInt(gameSpeed));
document.addEventListener("keyup", handleControls);