// Random number between 1 and 10
let randomNum = Math.floor(Math.random() * 10) + 1;
let attempts = 0;

// Get DOM elements
const guessInput = document.getElementById('guessInput');
const guessBtn = document.getElementById('guessBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');

// Utility function to set message and color
function setMessage(text, className) {
    message.textContent = text;
    message.className = ''; // Clear previous classes
    message.classList.add(className);
}

// Guess Button Click
guessBtn.addEventListener('click', () => {
    const userGuess = Number(guessInput.value);
    attempts++;
    attemptsDisplay.textContent = attempts;

    if (!userGuess || userGuess < 1 || userGuess > 10) {
        setMessage(" Enter a number between 1 and 10", "invalid");
        return;
    }

    if (userGuess === randomNum) {
        setMessage(`Correct! The number was ${randomNum}`, "success");
        guessBtn.disabled = true;
    } else if (userGuess < randomNum) {
        setMessage(" Too low! Try again.", "low");
    } else {
        setMessage(" Too high! Try again.", "high");
    }

    guessInput.value = '';
    guessInput.focus();
});

// Reset Button Click
resetBtn.addEventListener('click', () => {
    randomNum = Math.floor(Math.random() * 10) + 1;
    attempts = 0;
    attemptsDisplay.textContent = attempts;
    message.textContent = '';
    message.className = '';
    guessInput.value = '';
    guessBtn.disabled = false;
    guessInput.focus();
});