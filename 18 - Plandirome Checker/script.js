// Funtion for checking words if it is palandirome

function checkPalandirome() {
    const inputField = document.getElementById("wordinput");
    const result = document.getElementById("result");

    // Normalize : remove non-aphanumeric & lowercase
    const inputRaw = inputField.value;
    const cleanedInput = inputRaw.toLowerCase().replace(/[^a-z0-9]/g, '');
    const reserved = cleanedInput.split('').reverse().join('');

    result.classList.remove("show", "result-success", "reslt-warning", "result-error");

    if (cleanedInput === "") {
        result.textContent = "Please Enter something!";
        result.classList.add("result-warning", "show");
    } else if (cleanedInput === reserved) {
        result.textContent = `✅ ${inputRaw} is a plandirome`;
        result.classList.add("result-success", "show");
    } else {
        result.textContent = `❌ ${inputRaw} is not a plandirome `;
        result.classList.add("result-error", "show");
    }
}