// UPPERCASE = ABCDEFGHIJKLMNOPQRSTUVWXYZ
// LowerCase = abcdefghijklmnopqrstuvwxyz
// Numbers   = 0123456789
// Symbols   = !@#$%^&*()_+[]{}|;:,.<>?


const passwordInput = document.getElementById('password');
const copyBtn = document.getElementById('copyBtn');
const generateBtn = document.getElementById('generate');
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+[]{}|;:,.<>?';

const upercaseE1 = document.getElementById("uppercase");
const lowercaseE1 = document.getElementById("lowercase");
const numbersE1 = document.getElementById("numbers");
const symbolsE1 = document.getElementById("symbols");

// EventListner on range slider
lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

// Event linstner to generate password

generateBtn.addEventListener("click", () => {
    const length = +lengthSlider.value;
    let charSet = "";

    if (upercaseE1.checked) charSet += UPPERCASE;
    if (lowercaseE1.checked) charSet += LOWERCASE;
    if (numbersE1.checked) charSet += NUMBERS;
    if (symbolsE1.checked) charSet += SYMBOLS;

    if (charSet.length === 0) {
        passwordInput.value = "Select at least 1 option";
        return;
    }
    let password = "";

    // for each loop
    for (let i = 0; i < length; i++) {
        const randomChar = charSet[Math.floor(Math.random() * charSet.length)];

        password += randomChar;
    }
    passwordInput.value = password;
});

// EventListner to copy generated password

copyBtn.addEventListener("click", () => {
    if (!passwordInput.value || passwordInput.value === "Select at least 1 option") return;
    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.textContent = "✅";

    // setTime Out

    setTimeout(() => (copyBtn.textContent = "Copy"), 500);
});