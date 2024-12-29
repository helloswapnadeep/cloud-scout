// ! PRE LOADER START

window.onload = function () {
  var preloader = document.getElementsByClassName("preloader")[0];
  setTimeout(function () {
    preloader.style.display = "none";
  }, 500);
};

// ! PRE LOADER END
// ! HIDDEN MESSAGE START

const scout =
  "Hello, traveler of the skies and seeker of forecasts! 🌈 Whether you're chasing sunny days, preparing for the rain, or marveling at the stars above, we’ve got you covered 🌦️. So, grab a cup of coffee ☕, enjoy the vibrant visuals, and let us guide you through nature's wonders, one forecast at a time. Your adventure under the skies starts here! 🌍";
console.log(scout);

// ! HIDDEN MESSAGE END

const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const weatherInfoSection = document.querySelector(".weather-info");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const countryTxt = document.querySelector(".country-txt");
const currentDateTxt = document.querySelector(".current-date-txt");
const tempTxt = document.querySelector(".temp-text");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-text");
const windValueTxt = document.querySelector(".wind-value-text");
const weatherSummaryImg = document.querySelector(".weather-summary-img");

const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

const apikey = "a0e2f5cab408a66c252f47aad7af27a7";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apikey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-US", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);

  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + "°C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + " M/s";
  currentDateTxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;
  await updateForecastInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;
  const dateTaken = new Date(date);
  const dateOptions = {
    day: "numeric",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOptions);
  const forecastItem = `
  <div class="forecast-item">
    <h5 class="forecast-item-date">${dateResult}</h5>
    <img src="assets/weather/${getWeatherIcon(
      id
    )}" alt="Weather forecast showing current temperature and conditions in [Location]" class="forecast-item-img">
    <h5 class="forecast item-temp">${Math.round(temp)}°C</h5>
  </div>`;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
