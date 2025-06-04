let playerScore = 0;
let computerScore = 0;

const choices = ["rock", "paper", "scissors"];
const imageMap = {
    rock: '<img src="assets/rock.png" alt="Rock" width="50" height="50">',
    paper: '<img src="assets/paper.png" alt="Paper" width="50" height="50">',
    scissors: '<img src="assets/scissors.png" alt="Scissors" width="50" height="50">'
};

const resultDiv = document.getElementById("result");
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupCloseButton = document.getElementById("popup-close");

const choiceButtons = document.querySelectorAll(".choice");

function setButtonsDisabled(state) {
    choiceButtons.forEach(btn => btn.disabled = state);
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return "Empate";
    if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
    ) return "Jugador";
    return "Computadora";
}

function playGame(playerChoice) {
    const computerChoice = getComputerChoice();
    let counter = 0;

    setButtonsDisabled(true);

    resultDiv.innerHTML = "<p><em>Cargando...</em></p>"; // ⏳ Mostrar cargando

    const interval = setInterval(() => {
        const tempPlayerChoice = choices[Math.floor(Math.random() * 3)];
        const tempComputerChoice = choices[Math.floor(Math.random() * 3)];

        resultDiv.innerHTML = `
            <p>Jugador: ${imageMap[tempPlayerChoice]}  vs  ${imageMap[tempComputerChoice]}: IA</p>
        `;

        counter++;
        if (counter >= 20) {
            clearInterval(interval);

            const winner = determineWinner(playerChoice, computerChoice);
            resultDiv.innerHTML = `
                <p>Jugador: ${imageMap[playerChoice]}  vs  ${imageMap[computerChoice]}: IA</p>
                <p><strong>Ganador: ${winner}</strong></p>
            `;

            if (winner === "Jugador") {
                playerScore++;
                playerScoreElem.textContent = `Jugador: ${playerScore}`;
            } else if (winner === "Computadora") {
                computerScore++;
                computerScoreElem.textContent = `Computadora: ${computerScore}`;
            }

            if (playerScore === 3 || computerScore === 3) {
                popupMessage.textContent = playerScore === 3
                    ? "¡Felicidades! Has ganado el juego."
                    : "¡La computadora ha ganado el juego! Mejor suerte la próxima vez.";
                popup.style.display = "flex";
            }

            setButtonsDisabled(false);
        }
    }, 100);
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreElem.textContent = `Jugador: ${playerScore}`;
    computerScoreElem.textContent = `Computadora: ${computerScore}`;
    resultDiv.innerHTML = "";
}

popupCloseButton.addEventListener("click", () => {
    popup.style.display = "none";
    resetGame();
});

document.getElementById("rock").addEventListener("click", function(){
    playGame("rock")
});
document.getElementById("paper").addEventListener("click", function(){
    playGame("paper")
});
document.getElementById("scissors").addEventListener("click", function(){
    playGame("scissors")
});




if (localStorage.getItem("CurrentUser")==null)
    window.location.href = '../login/login.html';

const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const drawer = document.getElementById("myDrawer");
const login =document.getElementById("login")

closeBtn.addEventListener('click', function(){
    drawer.classList.remove('open')
});

openBtn.addEventListener('click', function(){
    drawer.classList.toggle('open');
});

login.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('CurrentUser');
    window.location.href = '../login/login.html';
});
