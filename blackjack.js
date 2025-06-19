var dealearSum = 0;
var yourSum = 0;

var dealearAceCount = 0;
var yourAceCount = 0;

var hidden;
var deck;

var canHit = true;
window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};
function buildDeck() {
  let values = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
  ];
  let types = ['C', 'D', 'H', 'S'];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + '-' + types[i]);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temps = deck[i];
    deck[i] = deck[j];
    deck[j] = temps;
  }
  console.log(deck);
}

function startGame() {
  hidden = deck.pop();
  dealearSum += getValue(hidden);
  dealearAceCount = checkAce(hidden);

  while (dealearSum < 17) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = 'cards/' + card + '.png';
    dealearSum += getValue(card);
    dealearAceCount += checkAce(card);
    document.getElementById('dealer-cards').appendChild(cardImg);
  }
  console.log('Dealer sum: ' + dealearSum);

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = 'cards/' + card + '.png';
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById('your-cards').appendChild(cardImg);
  }

  console.log('Your sum: ' + yourSum);
  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stay').addEventListener('click', stay);
  document.getElementById('restart').addEventListener('click', () => {
    window.location.reload();
  });

  if (reduceAce(yourSum, yourAceCount) > 21) {
    canHit = false;
  }
}

function getValue(card) {
  let data = card.split('-');
  let value = data[0];

  if (isNaN(value)) {
    if (value === 'A') {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  if (card[0] === 'A') {
    return 1;
  }
  return 0;
}

function hit() {
  if (!canHit) {
    return;
  }
  let cardImg = document.createElement('img');
  let card = deck.pop();
  cardImg.src = 'cards/' + card + '.png';
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById('your-cards').appendChild(cardImg);

  if (reduceAce(yourSum, yourAceCount) > 21) {
    // canHit = false;
    stay();
  }
}

function stay() {
  dealearSum = reduceAce(dealearSum, dealearAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);

  canHit = false;
  document.getElementById('hidden').src = 'cards/' + hidden + '.png';

  let message = '';
  if (yourSum > 21) {
    message = 'You Lose!';
  } else if (dealearSum > 21) {
    message = 'You Win!';
  } else if (yourSum == dealearSum) {
    message = 'Tie!';
  } else if (yourSum > dealearSum) {
    message = 'You Win!';
  } else if (yourSum < dealearSum) {
    message = 'You Lose!';
  }

  document.getElementById('dealer-sum').innerText = dealearSum;
  document.getElementById('your-sum').innerText = yourSum;
  document.getElementById('results').innerText = message;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
