function calculateBMI() {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const result = document.getElementById("result");

    if (!height || !weight || height <= 0 || weight <= 0) {
        result.textContent = "Please enter valid height & weight";
        result.style.color = "red";
    }

    const heightInMeter = height / 100;

    const bmi = (weight / (heightInMeter * heightInMeter)).toFixed(2);

    let category = "";

    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 24.9) category = "Normal Weight";
    else if (bmi < 29.9) category = "Overweight";
    else category = "Obese";

    result.style.color = "#333";
    result.textContent = `Your BMI is ${bmi} (${category})`;
}