let milisecods = 0;
let secods = 0;
let mint = 0;
let hours = 0;
let interval = null;

function updateDisplay() {
    const pad = (val, digits = 2) => val.toString().padStart(digits, '0');
    document.getElementById("display").textContent =
        `${pad(hours)}:${pad(mint)}:${pad(secods)}.${pad(milisecods, 3)}`;

}

function startTimer() {
    if (interval) return;

    interval = setInterval(() => {
        milisecods += 10;

        if (milisecods === 1000) {
            milisecods = 0;
            secods++;
            if (secods === 60) {
                secods = 0;
                mint++;
                if (mint === 60) {
                    mint = 0;
                    hours++;
                }
            }
        }
        updateDisplay();
    }, 10);
}

function stopTimer() {
    clearInterval(interval);
    interval = null;
}
function resetTimer() {
    clearInterval(interval);
    interval = null;
    milisecods = 0;
    secods = 0;
    mint = 0;
    hours = 0;

    updateDisplay();
}

updateDisplay();