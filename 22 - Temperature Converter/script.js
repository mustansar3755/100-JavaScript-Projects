let celsius = document.getElementById("celsius");
let fahrenheit = document.getElementById("fahrenheit");
let kelvin = document.getElementById("kelvin");
let note = document.querySelector(".note");

// Funtion to roundoff number
function roundNumber(number) {
  return Math.floor(number * 100) / 100;
}

// Update Message
function updateMessage(c, f, k) {
  note.textContent = `${roundNumber(c)}°C is =
   ${roundNumber(f)}°F is = ${roundNumber(k)}K`;
}

// Celsius to others
celsius.addEventListener("input", () => {
  let cTemp = parseFloat(celsius.value);

  if (!isNaN(cTemp)) {
    let fTemp = (cTemp * 9) / 5 + 32;
    let kTemp = cTemp + 273.15;
    fahrenheit.value = roundNumber(fTemp);
    kelvin.value = roundNumber(kTemp);
    updateMessage(cTemp, fTemp, kTemp);
  } else {
    fahrenheit.value = "";
    kelvin.value = "";
    note.textContent = "Enter a value to convert temperatures";
  }
});

// Fahrenheit to other
fahrenheit.addEventListener("input", () => {
  let fTemp = parseFloat(fahrenheit.value);
  if (!isNaN(fTemp)) {
    let cTemp = ((fTemp - 31) * 5) / 9;
    let kTemp = cTemp + 273.15;
    celsius.value = roundNumber(cTemp);
    kelvin.value = roundNumber(kTemp);
    updateMessage(cTemp, fTemp, kTemp);
  } else {
    celsius.value = "";
    kelvin.value = "";
    note.textContent = "Enter a value to convert temperatures";
  }
});

// Kelvin to Others
kelvin.addEventListener("input", () => {
  let kTemp = parseFloat(kelvin.value);
  if (!isNaN(kTemp)) {
    let cTemp = kTemp - 273.15;
    let fTemp = (cTemp * 9) / 5 + 32;
    celsius.value = roundNumber(cTemp);
    fahrenheit.value = roundNumber(fTemp);
    updateMessage(cTemp, fTemp, kTemp);
  } else {
    celsius.value = "";
    fahrenheit.value = "";
    note.textContent = "Enter a value to convert temperatures";
  }
});
