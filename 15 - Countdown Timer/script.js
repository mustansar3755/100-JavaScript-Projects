let countDown = 0;
let timeLeft = 0;

// Function of timer start
function startTimer() {
    clearInterval(countDown);

    const minutsInput = document.getElementById("minutes");

    if (minutsInput.value) {
        timeLeft = parseInt(minutsInput.value) * 60;
    }
    countDown = setInterval(() => {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;

        document.getElementById("timer").textContent =
            `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(countDown);
            document.getElementById('timer').textContent = "Time's Up !";
        }
    }, 1000);
}
// StopTimer Function
function stopTimer() {
    clearInterval(countDown);
}
// ResetTimer Function
function resetTimer() {
    clearInterval(countDown);
    document.getElementById("timer").textContent = "00:00";
    timeLeft = 0;
}
