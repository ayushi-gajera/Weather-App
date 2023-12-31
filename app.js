let userWeather = document.querySelector('[userWeather]');
let searchWeather = document.querySelector('[searchWeather]');
let user_container = document.querySelector('.user-container');
let search_container = document.querySelector('.search-container');
let grant_container = document.querySelector('[grant-location-container]');
let loading_container = document.querySelector('.loading-container');
let data_grant_access_btn = document.querySelector('[data-grant-access]');
let searchInput = document.querySelector('[searchInput]');
let not_found = document.querySelector('.not-found');

// API Key
const API_key = "95ffeb42d176ab7c9932acdb7bd16d70";

// Display User Weather Tab
let currentTab = userWeather;
currentTab.classList.add("current-active");

// Display Grant Container
grant_container_display();

// To change Tab
function switchTab(clickedTab){

    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-active");
        currentTab = clickedTab;
        currentTab.classList.add("current-active"); 

        if (clickedTab == searchWeather) {
            search_container.classList.remove("display");
            user_container.classList.add("display");
            loading_container.classList.add("display");
            grant_container.classList.add("display");
        } 
        else {
            grant_container_display();
        }
    } 
}

// Clicked on tab
userWeather.addEventListener("click",()=>{
    switchTab(userWeather);
});

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
});

// Grant Container Display
function grant_container_display() {

    let localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        grant_container.classList.remove("display");
        search_container.classList.add("display");
        loading_container.classList.add("display");
        user_container.classList.add("display");
        not_found.classList.add("display");
    }
    else {
        let coordinates = JSON.parse(localCoordinates);
        fetch_user_weather_info(coordinates);
        loading_container.classList.remove("display");
        user_container.classList.add("display");
        not_found.classList.add("display");
    }
}

// User Weather Information
async function fetch_user_weather_info(coordinates) {

    const {lat,lon} = coordinates;
    search_container.classList.add("display");
    grant_container.classList.add("display");
    loading_container.classList.remove("display");
    
    // API Call
    
    try{
        let weatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        let data = await weatherAPI.json();
        loading_container.classList.add("display");
        user_container.classList.remove("display");
        not_found.classList.add("display");

        if (!data.sys) {
            throw data;
        }

        renderDataInfo(data);
    }
    catch(err) {
        loading_container.classList.remove("display");
    }   
}

// Fetch Weather Data
function renderDataInfo(weather_data) {

    let current_location = document.querySelector('[current-location]');
    let country_flag = document.querySelector('[country-flag]');
    let weather_desc = document.querySelector('[weather-desc]');
    let weather_icon = document.querySelector('[weather-icon]');
    let temperature = document.querySelector('[temperature]');
    let wind_speed = document.querySelector('.Wind-Speed');
    let humidity = document.querySelector('.Humidity');
    let clouds = document.querySelector('.Clouds');

    current_location.innerText = weather_data?.name;
    country_flag.src = `https://flagcdn.com/144x108/${weather_data?.sys?.country.toLowerCase()}.png`;
    weather_desc.innerText = weather_data?.weather?.[0]?.description;
    weather_icon.src = `https://openweathermap.org/img/w/${weather_data?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weather_data?.main?.temp} °C`;
    wind_speed.innerText = `${weather_data?.wind?.speed} m/s`;
    humidity.innerText = `${weather_data?.main?.humidity}%`;
    clouds.innerText = `${weather_data?.clouds?.all}%`;
}

// To fetch current location
function geoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        console.log("Unable to fetch your geolocation");
    }
}

// To get position of latitude and longitude
function showPosition(position) {
    let userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetch_user_weather_info(userCoordinates);
}

// Clicked grant access button
data_grant_access_btn.addEventListener("click",geoLocation);

// Search Location
search_container.addEventListener("submit",(e)=> {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    }
    else {
        fetch_city_name(cityName);
        searchInput.value = "";
    }
});

// To fetch city name
async function fetch_city_name(cityName) {
    loading_container.classList.remove("display");
    user_container.classList.add("display");
    grant_container.classList.add("display");
    not_found.classList.add("display");

    // API Call

    try {
        let weatherAPI = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_key}&units=metric`);
        let data = await weatherAPI.json();

        if (!data.sys) {
            throw data;
        }

        loading_container.classList.add("display");
        user_container.classList.remove("display");
        renderDataInfo(data);
        not_found.classList.add("display");
    }
    catch(err) {
        loading_container.classList.add("display");
        not_found.classList.remove("display");
    }
}