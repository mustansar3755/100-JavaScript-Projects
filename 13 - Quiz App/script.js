// Choose you own questions

const questions = [
    {
        question: "What does JS stand for?",
        options: ["Java Style", "JavaScript", "JustScript", "JScript"],
        answer: 1
    },
    {
        question: "Which method is used to print in the console?",
        options: ["print()", "log()", "console.log()", "write()"],
        answer: 2
    },
    {
        question: "How do you declare a variable?",
        options: ["variable a = 5", "let a = 5", "v a = 5", "int a = 5"],
        answer: 1
    },
    {
        question: "Which is not a JavaScript data type?",
        options: ["Boolean", "Undefined", "Float", "Number"],
        answer: 2
    },
    {
        question: "What is the correct syntax for an if statement?",
        options: ["if (a == b)", "if a = b then", "if a == b", "if: a == b"],
        answer: 0
    }
];


let currentIndex = 0;
let score = 0;

const questionEl = document.getElementById("question");
const formEl = document.getElementById("options-form");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const scoreBox = document.getElementById("score-box");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");

function loadQuestion() {
    const current = questions[currentIndex];
    questionEl.textContent = current.question;
    formEl.innerHTML = "";

    current.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.innerHTML = `
      <input type="radio" name="option" value="${index}"> ${option}
    `;
        formEl.appendChild(label);
    });

    submitBtn.classList.remove("hide");
    nextBtn.classList.add("hide");
}

function submitAnswer() {
    const selected = document.querySelector('input[name="option"]:checked');
    if (!selected) {
        alert("Please select an option!");
        return;
    }

    const selectedIndex = parseInt(selected.value);
    if (selectedIndex === questions[currentIndex].answer) {
        score++;
    }

    submitBtn.classList.add("hide");
    nextBtn.classList.remove("hide");

    // Highlight correct and incorrect answers
    const inputs = document.querySelectorAll('input[name="option"]');
    inputs.forEach((input, index) => {
        input.disabled = true;
        const label = input.parentElement;
        if (index === questions[currentIndex].answer) {
            label.style.color = "green";
        } else if (index === selectedIndex) {
            label.style.color = "red";
        } else {
            label.style.color = "#999";
        }
    });
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    document.getElementById("question-box").classList.add("hide");
    scoreBox.classList.remove("hide");
    scoreEl.textContent = score;
    totalEl.textContent = questions.length;
}

function restartQuiz() {
    currentIndex = 0;
    score = 0;
    scoreBox.classList.add("hide");
    document.getElementById("question-box").classList.remove("hide");
    loadQuestion();
}

loadQuestion();