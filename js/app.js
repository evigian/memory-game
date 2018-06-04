const deck = document.querySelector('.deck');
let moves = document.querySelector('.moves');
const stars = document.querySelectorAll('.fa-star');
const restartIcon = document.querySelector('.restart');
const allCards = document.querySelectorAll('.card');
const modal = document.querySelector('.modal');
let closeMod = document.querySelector('.close');

let cardList = [...allCards];
let openedCards = [];
let matchedPairs = [];
let countMatches = 0;

let timer = document.querySelector('.timer');
let second = 0;
let minute = 0;

let interval;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Shuffle the card icons and create the deck
function shuffleCards() {
	let shuffledCards = shuffle(cardList);
	shuffledCards.forEach(function(item) {
		deck.appendChild(item);
	});
}

// Function for the timer
function startTimer() {
	if (interval) {
		return;
	}
	interval = setInterval(function() {
		timer.innerHTML = `${minute} minutes ${second} seconds`;
		second++;
		if (second == 60) {
			minute++;
			second = 0;
		}
	}, 1000);
}

// Function to increment the moves
function addMoves() {
	if (openedCards.length === 2) {
		moves.innerHTML++;

		starRating();
	}
}

// Function for the star rating
function starRating() {
	if (moves.innerHTML > 13 && moves.innerHTML < 19) {
		for (i = 0; i < 3; i++) {
			if (i > 1) {
				stars[i].style.visibility = 'collapse';
			}
		}
	} else if (moves.innerHTML > 24) {
		for (i = 0; i < 3; i++) {
			if (i > 0) {
				stars[i].style.visibility = 'collapse';
			}
		}
	}
}


// Adds event listener to the cards, starts the timer and compares opened cards
let firstClick = true;

cardList.forEach(function(card) {
	card.addEventListener('click', function(elem) {
		if (firstClick) {
			startTimer();

			// don't start new counting
			firstClick = false;
		}
		openedCards.push(card);
		card.classList.add('open', 'show', 'disabled');

		if (openedCards.length === 2) {
			addMoves();

			if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
				openedCards[0].classList.add('open', 'show', 'match');
				openedCards[1].classList.add('open', 'show', 'match');

				matchedPairs.push(openedCards[0], openedCards[1]);
				countMatches++;
				openedCards = [];
				gameEnd();

				//if the cards don't match
			} else {
				openedCards[0].classList.add('unmatch');
				openedCards[1].classList.add('unmatch');
				setTimeout(function() {
					openedCards.forEach(function(card) {
						card.classList.remove('open', 'show', 'disabled', 'unmatch');
					});
					openedCards = [];
				}, 500);
			}
		}

		starRating();
	});
});

// The game ends when all cards are matched
function gameEnd() {
	if (matchedPairs.length === 16) {
		showModal();
	}

// Function to show the modal with the moves, time and star rating
	function showModal() {
		let finalMoves = moves.innerHTML;
		let finalTime = timer.innerHTML;
		let finalStarRating = document.querySelector('.stars').innerHTML;
		modal.style.display = 'block';
		document.querySelector(
			'.playing-time'
		).innerHTML = `You finished the game in ${finalTime}`;
		document.querySelector(
			'.game-moves'
		).innerHTML = `You made ${finalMoves} moves`;
		document.querySelector(
			'.stars-won'
		).innerHTML = `You won ${finalStarRating} stars`;
		closeModal();
		clearInterval(interval);
	}
}

// Close the modal - code from w3schools
function closeModal() {
	closeMod.addEventListener('click', function(e) {
		modal.style.display = 'none';
		clearInterval(interval);
	});
}
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
		clearInterval(interval);
	}
};

// Play again button
function playAgain() {
	modal.style.display = 'none';
	newGame();
}

// Resets the stars
function resetStars() {
	for (i = 0; i < 3; i++) {
		stars[i].style.visibility = 'visible';
	}
}

// Resets the cards
function resetCards() {
	for (i = 0; i < 16; i++) {
		allCards[i].classList.remove(
			'match',
			'unmatch',
			'open',
			'show',
			'disabled'
		);
	}
}

// Resets the game
function newGame() {
	clearInterval(interval);
	interval = null;
	moves.innerHTML = 0;
	resetStars();
	resetCards();
	second = 0;
	minute = 0;
	timer.innerHTML = `${minute} minutes ${second} seconds`;
	firstClick = true;
	openedCards = [];
	matchedPairs = [];
	shuffleCards();
}

// event listener for the restart icon
restartIcon.addEventListener('click', newGame);
newGame();
