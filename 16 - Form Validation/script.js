const form = document.getElementById('form');
const userName = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// Event Listner
form.addEventListener("submit", function (e) {
    //this will stop default role of submitting form
    e.preventDefault();
    checkInput();
});

function checkInput() {
    const userNameval = userName.value.trim();
    const emailVal = email.value.trim();
    const passwordVal = password.value.trim();
    const password2Val = password2.value.trim();

    let isFormValid = true

    if (userNameval.length < 3) {
        setError(userName, "Username must be at least 3 characters");
        isFormValid = false;
    }else {
        setSuccess(userName);
    }
    if (!isValidEmail(emailVal)) {
        setError(email, "Email is not valid");
        isFormValid = false;
    }else {
        setSuccess(email);
    }
    if (passwordVal.length < 6) {
        setError(password, "Password Must be at least 6 characters");
        isFormValid = false;
    } else {
        setSuccess(password);
    }
    if (password2Val !== passwordVal || password2Val === "") {
        setError(password2, "Password do not match");
        isFormValid = false;
    }else {
        setSuccess(password2);
    }
    if (isFormValid) {
        // function of popup modal
        showModal();
    }
}

// Error Message Function

function setError(input, message) {
    const formControl = input.parentElement;
    formControl.className = "form-control error";
    const small = formControl.querySelector("small");
    small.innerText = message;
}

// Success Message Function

function setSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

// Email Validation 
function isValidEmail(email) {
    // /^[^\s@]+@[^\s@]+\.[^\s@]+$/  => email validation 

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// popUp modal

function showModal() {
    document.getElementById('successModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    form.reset();
    const allControl = document.querySelectorAll(".form-control");
    allControl.forEach(control => control.className = 'form-control');
}