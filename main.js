'use strict';

const WEATHERBIT_API_KEY = '4b2c7834b42a4279adb9aa045f9173af';
let searchBtn = document.getElementById("search-btn");
let cityInput = document.getElementById('city-input');
let mainTodayBlock = document.getElementById('main-today');
let mainTomorrowBlock = document.getElementById('main-tomorrow');
let mainTenDaysBlock = document.getElementById('main-ten-days');
let forecast;
let forecastTenDays;
let cityName;

onInit();

function onInit() {
	getCityName();
}

function callback(data) {
	// вызывается getCityName api как callback
	cityName = data.city;

	if (cityName) {
		cityInput.value = cityName;
		searchCurrent();
	}
}

function getCityName() {
	const script = document.createElement('script');

	script.type = 'text/javascript';
	script.src = 'https://geolocation-db.com/jsonp';
	var h = document.getElementsByTagName('script')[0];
	h.parentNode.insertBefore(script, h);
}

function searchCurrent() {
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json'
	xhr.open('get', `https://api.weatherbit.io/v2.0/current?key=${WEATHERBIT_API_KEY}&lang=ru&city=${cityInput.value}`);
	xhr.send();
	
	xhr.onload = function() {
		forecast = xhr.response.data[0];

		initToday();
	};
}

function searchForecast(days) {
	let xhr = new XMLHttpRequest();
	xhr.responseType = 'json'
	xhr.open('get', `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHERBIT_API_KEY}&lang=ru&city=${cityInput.value}&days=${days}`);
	xhr.send();
	
	xhr.onload = function() {
		if (days === 1) {
			forecast = xhr.response.data[0];
			initTomorrow();
		} else {
			forecastTenDays = xhr.response.data;
			initTenDays();
		}
	};
}

function initToday() {
	mainTomorrowBlock.style.display = 'none';
	mainTenDaysBlock.style.display = 'none';
	mainTodayBlock.style.display = 'flex';

	let date = document.getElementById('date-today');
	let temperature = document.getElementById('temperature');
	let feelsLike = document.getElementById('feels-like');
	let singleImageDescription = document.getElementById('single-image-description');
	let singleImage = document.getElementById('single-image');
	let mainTodayWindSpeed = document.getElementById('main-today-wind-speed');
  let mainTodayWindDirection = document.getElementById('main-today-wind-direction');
	let mainTodayHumidity = document.getElementById('main-today-humidity');
	let mainTodayFooterPressure = document.getElementById('main-today-footer-pressure');
  let mainTodayFooterVisibility = document.getElementById('main-today-footer-visibility');

	date.innerHTML = new Date().toLocaleDateString();
	temperature.innerHTML = Math.round(forecast.temp);
	// ощущается как
	feelsLike.innerHTML = Math.round(forecast.app_temp);
	// вероятность осадков
	singleImageDescription.innerHTML = forecast.weather.description;
	singleImage.src = `./icons/${forecast.weather.icon}.png`;
	mainTodayWindSpeed.innerHTML = Math.round(forecast.wind_spd); // такой же на прогноз
	mainTodayWindDirection.innerHTML = forecast.wind_cdir; // такой же на прогноз
	mainTodayHumidity.innerHTML = Math.round(forecast.rh);
	mainTodayFooterPressure.innerHTML = Math.round(Number(forecast.pres / 1.33322));
	mainTodayFooterVisibility.innerHTML = Math.round(forecast.vis);
}

function initTomorrow() {
	mainTodayBlock.style.display = 'none';
	mainTenDaysBlock.style.display = 'none';
	mainTomorrowBlock.style.display = 'flex';

	let date = document.getElementById('date-tomorrow');
	let dateStamp = new Date();
	dateStamp.setDate(dateStamp.getDate() + 1);
	let minTemperature = document.getElementById('min-temperature');
	let maxTemperatire = document.getElementById('max-temperatire');
	let werOsadkow = document.getElementById('chance-preciption');
	let singleImageDescriptionTomorrow = document.getElementById('single-image-description-tomorrow');
	let singleImageTomorrow = document.getElementById('single-image-tomorrow');
	let mainTodayWindSpeedTomorrow = document.getElementById('main-today-wind-speed-tomorrow');
	let mainTodayWindDirectionTomorrow = document.getElementById('main-today-wind-direction-tomorrow');
	let mainTodayHumidityTomorrow = document.getElementById('main-today-humidity-tomorrow');
	let mainTodayFooterPressureTomorrow = document.getElementById('main-today-footer-pressure-tomorrow');
	let mainTodayFooteVisibilityTomorrow = document.getElementById('main-today-footer-visibility-tomorrow');

	date.innerHTML = dateStamp.toLocaleDateString();
	minTemperature.innerHTML = Math.round(forecast.min_temp);
	maxTemperatire.innerHTML = Math.round(forecast.max_temp);
	werOsadkow.innerHTML = Math.round(forecast.pop);
	// вероятность осадков
	singleImageDescriptionTomorrow.innerHTML = forecast.weather.description;
	singleImageTomorrow.src = `./icons/${forecast.weather.icon}.png`;
	mainTodayWindSpeedTomorrow.innerHTML = Math.round(forecast.wind_spd);
	mainTodayWindDirectionTomorrow.innerHTML = forecast.wind_cdir;
	mainTodayHumidityTomorrow.innerHTML = Math.round(forecast.rh);
	mainTodayFooterPressureTomorrow.innerHTML = Math.round(Number(forecast.pres / 1.33322));
	mainTodayFooteVisibilityTomorrow.innerHTML = Math.round(forecast.vis);
}

function initTenDays() {
	mainTodayBlock.style.display = 'none';
	mainTomorrowBlock.style.display = 'none';
	mainTenDaysBlock.style.display = 'flex';
	cleanTenDays();

	forecastTenDays.forEach((forecast, index) => {
		let oneDay = buildOneDay(forecast, index);
		let div = document.createElement('div');
  	div.innerHTML = oneDay.trim();

		mainTenDaysBlock.appendChild(div.firstChild);
	});
}

function cleanTenDays() {
	while (mainTenDaysBlock.firstChild) {
		mainTenDaysBlock.removeChild(mainTenDaysBlock.firstChild);
	}
}

function buildOneDay(forecast, index) {
	let date;
	let dateFuture = new Date(Date.now() + 1000 * 60 * 60 * 24 * index);

	if (index === 0) {
		date = 'Сегодня';
	}

	if (index === 1) {
		date = `Завтра ${dateFuture.getDate()} ${getMonthName(dateFuture.getMonth())}`;
	}

	if (index > 1) {
		date = `${getWeekDay(dateFuture.getDay())} ${dateFuture.getDate()} ${getMonthName(dateFuture.getMonth())}`;
	}

	
	return `
		<div class="one-day">
			<div class="description">
				<div>${date}</div>
				<div>${forecast.weather.description}</div>
			</div>
			<div class="one-day-image-temperature">
				<div class="one-day-image">
					<img id="one-day-image" src="./icons/${forecast.weather.icon}.png">
				</div>
				<div class="one-day-temperature">
					<div class="one-day-temperature-min">
						<span>${Math.round(forecast.min_temp)}</span>
						<span>°↓</span>
					</div>
					<div class="one-day-temperature-max">
						<span>${Math.round(forecast.max_temp)}</span>
						<span>°↑</span>
					</div>
				</div>
			</div>
		</div>
	`
}

function getWeekDay(day) {
	switch (day) {
		case 0:
			return 'Воскресенье';
		case 1:
		  return 'Понедельник';
		case 2:
			return 'Вторник';
		case 3:
			return 'Среда';
		case 4:
			return 'Четверг';
		case 5:
			return 'Пятница';
		case 6:
			return 'Суббота';
	}
}

function getMonthName(monthNumber) {
	switch (monthNumber) {
		case 0:
			return 'янв.';
		case 1:
		  return 'фев.';
		case 2:
			return 'мар.';
		case 3:
			return 'апр.';
		case 4:
			return 'май';
		case 5:
			return 'июн.';
		case 6:
			return 'июл.';
  	case 7:
			return 'авг.';
		case 8:
			return 'сен.';
		case 9:
			return 'окт.';
		case 10:
			return 'ноя.';
		case 11:
			return 'дек.';
	}
}

searchBtn.addEventListener('click', searchCurrent);

let rangeBtns = document.querySelectorAll('.select-period');
rangeBtns.forEach(rangeBtn => {
	rangeBtn.addEventListener('click', () => {
		let currentSelected = document.querySelector('.selected');
		let rangeBtnId = rangeBtn.id;
		
		if (rangeBtnId === 'today-btn') {
			rangeBtn.addEventListener('click', searchCurrent());
		}

		if (rangeBtnId === 'tomorrow-btn') {
			rangeBtn.addEventListener('click', searchForecast(1));
		} 

		if (rangeBtnId === 'ten-days-btn') {
			rangeBtn.addEventListener('click', searchForecast(10));
		} 
	
		currentSelected.classList.remove('selected');
		rangeBtn.classList.add('selected');
	});
})

