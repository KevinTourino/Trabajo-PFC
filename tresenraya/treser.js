const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const startButton = document.getElementById('startGame');
const symbolSelect = document.getElementById('playerSymbol');
const difficultySelect = document.getElementById('difficulty');
const gameModeSelect = document.getElementById('gameMode');
let gameMode = 'vsAI';


let playerSymbol = 'X';
let aiSymbol = 'O';
let currentPlayer = 'X';
let gameActive = false;
let difficulty = 'hard';
let board = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

startButton.addEventListener('click', () => {
  playerSymbol = symbolSelect.value;
  aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
  difficulty = difficultySelect.value;
  gameMode = gameModeSelect.value;
  resetGame();
  gameActive = true;
  statusText.textContent = `Turno de: ${currentPlayer}`;
  resetButton.style.display = 'inline-block';

  if (currentPlayer === aiSymbol) {
    setTimeout(() => aiMove(), 300);
  }
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;

  if (gameMode === '2players') {
    makeMove(index, currentPlayer);
    return;
  }

  if (currentPlayer === playerSymbol) {
    makeMove(index, playerSymbol);
    if (gameActive && currentPlayer === aiSymbol) {
      setTimeout(() => aiMove(), 300);
    }
  }
}


function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player === 'X' ? 'marked-x' : 'marked-o');

  if (checkWinner(board, player)) {
    statusText.textContent = `¡Ganó ${player}!`;
    gameActive = false;
    highlightWinningLine(player);
    return;
  }

  if (!board.includes("")) {
    statusText.textContent = "¡Empate!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Turno de: ${currentPlayer}`;
}


function aiMove() {
  if (!gameActive) return;

  let index;

  if (difficulty === 'easy') {
    index = getRandomMove();
  } else if (difficulty === 'medium') {
    index = getMediumMove();
  } else {
    index = minimax(board, aiSymbol).index;
  }

  makeMove(index, aiSymbol);
}


function getRandomMove() {
  const empty = board.map((v, i) => v === "" ? i : null).filter(i => i !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

function getMediumMove() {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = aiSymbol;
      if (checkWinner(board, aiSymbol)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = playerSymbol;
      if (checkWinner(board, playerSymbol)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }

  return getRandomMove();
}


function checkWinner(bd, player) {
  return winningConditions.some(([a, b, c]) => bd[a] === player && bd[b] === player && bd[c] === player);
}

function minimax(newBoard, player) {
  const emptySpots = newBoard.map((v, i) => v === "" ? i : null).filter(i => i !== null);

  if (checkWinner(newBoard, playerSymbol)) return { score: -10 };
  if (checkWinner(newBoard, aiSymbol)) return { score: 10 };
  if (emptySpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i of emptySpots) {
    const move = {};
    move.index = i;
    newBoard[i] = player;

    const result = minimax(newBoard, player === aiSymbol ? playerSymbol : aiSymbol);
    move.score = result.score;

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === aiSymbol) {
    let bestScore = -Infinity;
    for (let m of moves) {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let m of moves) {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    }
  }

  return bestMove;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `Turno de: ${currentPlayer}`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.className = 'cell';
  });
}



function highlightWinningLine(player) {
  for (let combination of winningConditions) {
    const [a, b, c] = combination;
    if (board[a] === player && board[b] === player && board[c] === player) {
      [a, b, c].forEach(i => cells[i].classList.add('winner'));
      break;
    }
  }
}


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