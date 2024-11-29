const form = document.querySelector("form");
const submitBtn = document.querySelector(".submit-btn");
const error = document.querySelector(".error-msg");

form.addEventListener("submit", handleSubmit);
submitBtn.addEventListener("click", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  fetchWeather();
}

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=ca5e426d42c0906ee6496023ccc30972&units=imperial`,
      {
        mode: "cors",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    error.style.display = "none";
    const weatherData = await response.json();
    const newData = processData(weatherData);
    displayData(newData);
    reset();
  } catch (err) {
    console.error(err);
    throwErrorMsg();
  }
}

function throwErrorMsg() {
  error.style.display = "block";
  if (error.classList.contains("fade-in")) {
    error.style.display = "none";
    error.classList.remove("fade-in2");
    error.offsetWidth;
    error.classList.add("fade-in");
    error.style.display = "block";
  } else {
    error.classList.add("fade-in");
  }
}

function processData(weatherData) {
  // Extract and format relevant data for display
  const myData = {
    condition: weatherData.weather[0].description.toUpperCase(),
    feelsLike: Math.round(weatherData.main.feels_like),
    currentTemp: Math.round(weatherData.main.temp),
    wind: Math.round(weatherData.wind.speed),
    humidity: weatherData.main.humidity,
    location: weatherData.name.toUpperCase(),
    region: weatherData.sys.country,
  };

  return myData;
}

function displayData(newData) {
  const weatherInfo = document.getElementsByClassName("info");
  Array.from(weatherInfo).forEach((div) => {
    if (div.classList.contains("fade-in2")) {
      div.classList.remove("fade-in2");
      div.offsetWidth;
      div.classList.add("fade-in2");
    } else {
      div.classList.add("fade-in2");
    }
  });

  document.querySelector(".condition").textContent = newData.condition;
  document.querySelector(
    ".location"
  ).textContent = `${newData.location}, ${newData.region}`;
  document.querySelector(".degrees").textContent = `${newData.currentTemp}°F`;
  document.querySelector(
    ".feels-like"
  ).textContent = `FEELS LIKE: ${newData.feelsLike}°F`;
  document.querySelector(".wind-mph").textContent = `WIND: ${newData.wind} MPH`;
  document.querySelector(
    ".humidity"
  ).textContent = `HUMIDITY: ${newData.humidity}%`;
}

function reset() {
  form.reset();
}

// Fetch location from the input and call the API
function fetchWeather() {
  const input = document.querySelector('input[type="text"]');
  const userLocation = input.value.trim();
  if (userLocation) {
    getWeatherData(userLocation);
  } else {
    throwErrorMsg();
  }
}