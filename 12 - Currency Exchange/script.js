// https://api.exchangerate-api.com/v4/latest   url

const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");


const currencies = ["USD", "PKR", "EUR", "GBP", "INR", "AUD"];

currencies.forEach(curr => {
    let option1 = document.createElement("option");
    let option2 = document.createElement("option");

    option1.value = option2.value = curr;
    option1.text = option2.text = curr;

    fromCurrency.appendChild(option1);
    toCurrency.appendChild(option2);
});

fromCurrency.value = "PKR";
toCurrency.value = "USD";

convertBtn.addEventListener("click", () => {
    let from = fromCurrency.value;
    let to = toCurrency.value;
    let amt = parseFloat(amount.value);

    if (isNaN(amt) || amt <= 0) {
        result.innerText = "Please enter valid amount";
        return;
    }

    fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
        .then(res => res.json())
        .then(data => {
            let rate = data.rates[to];
            let converted = (amt * rate).toFixed(2);

            result.innerText = `${amt} ${from} = ${converted} ${to}`;
        }).catch(() => {
            result.innerText = "Error Fetching exchange rate"
        })
})