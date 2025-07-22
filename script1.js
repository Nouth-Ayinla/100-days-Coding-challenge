const API_KEY = "e56e4b394731cba47d0839d8a2b6117"; 
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherIcon = document.getElementById("weather-icon");
const forecastList = document.getElementById("forecast-list");

// Fetch weather data
async function getWeatherData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod === "404") {
      throw new Error("City not found");
    }
    
    return data;
  } catch (error) {
    console.error("Error:", error);
    alert("City not found. Please try again!");
    return null;
  }
}

// Fetch forecast data
async function getForecastData(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    
    if (data.cod === "404") {
      throw new Error("Forecast not available");
    }
    
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Update current weather UI
function updateCurrentWeather(data) {
  if (!data) return;
  
  cityName.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind: ${data.wind.speed} km/h`;
  
  const iconCode = data.weather[0].icon;
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">`;
}

// Update forecast UI
function updateForecast(data) {
  if (!data) return;
  
  forecastList.innerHTML = "";
  
  // Get one forecast per day (at 12:00 PM)
  const dailyForecast = data.list.filter(item => {
    return item.dt_txt.includes("12:00:00");
  }).slice(0, 5);

  dailyForecast.forEach(day => {
    const date = new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
    const temp = Math.round(day.main.temp);
    const iconCode = day.weather[0].icon;
    
    forecastList.innerHTML += `
      <div class="forecast-day">
        <p><strong>${date}</strong></p>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather icon">
        <p>${temp}°C</p>
      </div>
    `;
  });
}

// Handle search
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) return;
  
  const weatherData = await getWeatherData(city);
  const forecastData = await getForecastData(city);
  
  updateCurrentWeather(weatherData);
  updateForecast(forecastData);
});

// Load default city on startup
window.addEventListener("load", async () => {
  const defaultCity = "London";
  const weatherData = await getWeatherData(defaultCity);
  const forecastData = await getForecastData(defaultCity);
  
  updateCurrentWeather(weatherData);
  updateForecast(forecastData);
});