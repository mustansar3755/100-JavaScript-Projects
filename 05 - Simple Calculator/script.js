const display = document.getElementById('display');

// Function TO Append Values
function appendValue(value) {
    display.value += value;
}

// Function To Clear Display
function clearDisplay() {
    display.value = '';
}

// Function To Delete Last

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Function To Calculate Results

function calculateResults() {
    try {
        display.value = eval(display.value);
    }
    catch {
        display.value = 'ERROR';
    }
}