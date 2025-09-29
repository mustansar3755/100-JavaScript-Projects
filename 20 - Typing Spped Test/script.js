const sentences = [
  "Typing speed is a skill you can improve.",
  "Practice makes a person perfect in typing.",
  "The quick brown fox jumps over the lazy dog.",
  "Javascript is a versatile programming language.",
  "Always keep learning and growing your skills."
];

let startTime, interval;
let sentenceText = "";
let timerRunning = false;

const sentencesE1 = document.getElementById("sentence");
const inputE1 = document.getElementById("input");
const wpmE1 = document.getElementById("wpm");
const accuracyE1 = document.getElementById("accuracy");
const timeE1 = document.getElementById("time");

function startNewTest() {
  sentenceText = sentences[Math.floor(Math.random() * sentences.length)];
  sentencesE1.textContent = sentenceText;
  inputE1.value = "";
  wpmE1.textContent = 0;
  accuracyE1.textContent = "100%";
  timeE1.textContent = "0s";
  clearInterval(interval);
  timerRunning = false;
}

// Eventlistner on inputE1

inputE1.addEventListener("input", () => {
  if (!timerRunning) {
    startTime = new Date();
    timerRunning = true;
    interval = setInterval(updateStats, 1000);
  }
  const inputText = inputE1.value;
  const timeElapsed = (new Date() - startTime) / 1000;

  let correct = 0;
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] === sentenceText[i]) {
      correct++;
    }
  }
  const wordsTyped = inputText.trim().split(/\s+/).length;
  const wpm = Math.round((wordsTyped / timeElapsed) * 60);
  const accuracy = Math.round((correct / inputText.length) * 100);

  wpmE1.textContent = isNaN(wpm) ? 0 : wpm;
  accuracyE1.textContent = isNaN(accuracy) ? "100%" : `${accuracy}%`;
});

function updateStats() {
  const timeElapsed = Math.floor((new Date() - startTime) / 1000);
  timeE1.textContent = `${timeElapsed}s`;
}
startNewTest();
