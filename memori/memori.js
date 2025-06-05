const allCards = [
  { id: 1, image: 'A.png' },
  { id: 2, image: 'B.png' },
  { id: 3, image: 'C.png' },
  { id: 4, image: 'D.png' },
  { id: 5, image: 'E.png' },
  { id: 6, image: 'F.png' },
  { id: 7, image: 'G.png' },
  { id: 8, image: 'H.png' },
  { id: 9, image: 'I.png' },
];

let selectedDifficulty = 4;

const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('startButton');

const winPopup = document.getElementById('winPopup');
const closePopupButton = document.getElementById('closePopupButton');
const finalAttemptsText = document.getElementById('finalAttempts');

let flippedCards = [];
let matchedCards = [];
let attempts = 0;

difficultySelect.addEventListener('change', (event) => {
  selectedDifficulty = parseInt(event.target.value);
});


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const board = document.querySelector('.memory-board');
  board.innerHTML = '';

  const cardsToUse = allCards.slice(0, selectedDifficulty);
  const cards = [...cardsToUse, ...cardsToUse];

  const shuffledCards = shuffle(cards);

  shuffledCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.image = card.image;

    const imgElement = document.createElement('img');
    imgElement.src = `assets/${card.image}`;
    imgElement.alt = card.image;

    cardElement.appendChild(imgElement);
    cardElement.addEventListener('click', flipCard);
    board.appendChild(cardElement);
  });
}

function resetGame() {
  flippedCards = [];
  matchedCards = [];
  attempts = 0;
  document.getElementById('attempts').textContent = attempts;
  
  winPopup.style.display = 'none';

  createBoard();
}

function flipCard(event) {
  const card = event.target;

  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  const img = card.querySelector('img');
  img.style.visibility = 'visible';

  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    document.getElementById('attempts').textContent = attempts;

    if (flippedCards[0].dataset.image === flippedCards[1].dataset.image) {
      matchedCards.push(...flippedCards);
      flippedCards = [];

      if (matchedCards.length === allCards.slice(0, selectedDifficulty).length * 2) {
        setTimeout(() => showWinPopup(), 500);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(card => {
          const img = card.querySelector('img');
          img.style.visibility = 'hidden';
          card.classList.remove('flipped');
        });
        flippedCards = [];
      }, 1000);
    }
  }
}


function showWinPopup() {
  finalAttemptsText.textContent = attempts;
  winPopup.style.display = 'flex';
}

closePopupButton.addEventListener('click', () => {
  winPopup.style.display = 'none';
  const board = document.querySelector('.memory-board');
  board.innerHTML = '';
  document.getElementById('attempts').textContent = "0";
});

startButton.addEventListener('click', () => {
  resetGame();
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