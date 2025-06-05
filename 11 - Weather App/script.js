// f3abd5106bb347a7a19141315252905   Api Key WeatherApi.com

// https://api.weatherapi.com/v1/current.json?  json data url

const apiKey = "f3abd5106bb347a7a19141315252905"; // WeatherAPI.com key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
    }
});

async function getWeather(city) {
    const weatherCard = document.getElementById("weatherCard");
    const errorMsg = document.getElementById("errorMsg");

    try {
        errorMsg.textContent = "";
        const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`);

        if (!res.ok) {
            throw new Error("City not found");
        }

        const data = await res.json();
        document.getElementById("cityName").textContent = data.location.name;
        document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
        document.getElementById("description").textContent = data.current.condition.text;
        document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity}%`;
        document.getElementById("wind").textContent = `Wind: ${data.current.wind_kph} km/h`;
        document.getElementById("weatherIcon").src = `https:${data.current.condition.icon}`;
        document.getElementById("weatherIcon").alt = data.current.condition.text;

        weatherCard.style.display = "block";
    } catch (error) {
        weatherCard.style.display = "none";
        errorMsg.textContent = "❌ " + error.message;
    }
}