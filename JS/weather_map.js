"use strict";
let modeStatus = true;
//current weather forecast
function getCurrent(lat,lon) {
    $.get(`https://api.openweathermap.org/data/2.5/weather`, {
        APPID: OPENWEATHER_API_KEY,
        lat: lat,
        lon: lon,
        units: "imperial"
    }).done(function (data) {
        let currentDay = "";
        let myDate = new Date(data.dt * 1000);
        currentDay += `<div id="currentCard" class="container-fluid">
                            <h2>${data.name}</h2>
                            <p><b>Current Date: </b><br> ${myDate.toGMTString().substring(0,17)}</p>
                            <p><b>Current Temp: </b><br> ${data.main.temp} &#8457
                        </div>`;
        let icon = "";
        icon += `<div>
                    <h2 class="currentWeather"><br>Current Weather </h2>
                    <p class="currentWeather fs-5"><b>High: </b> ${data.main.temp_max} &#8457</p>
                    <p class="currentWeather fs-5"><b>Low: </b> ${data.main.temp_min} &#8457</p>
                    <p class="currentWeather fs-4">${data.weather[0].description}</p>
                    <img id="mainIcon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
                 </div>`
        $("#insertCurrent").html(currentDay);
        $("#insertIcon").html(icon);
        console.log(data);
    });
}
getCurrent(29.4252,-98.4916);

//5-day weather forecast
function getForecast(lat,lon) {
    $.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        APPID: OPENWEATHER_API_KEY,
        lat: lat,
        lon: lon,
        units: "imperial"
    }).done(function (data) {
        let day = "";
        for (let i = 0; i < data.list.length; i += 8) {
            if (modeStatus === true) {
                day += `<div class="card dayModeDtCards">
                <h3>${getDayOfWeek(data.list[i].dt)}</h3>
                <p id="dateTime" class="card-title"><b>Date:</b> ${data.list[i].dt_txt.substring(0, 10)}</p>
                <p id="temp" class="card-text"><b>Avg Temp:</b> ${data.list[i].main.temp} &#8457</p>
                <p class="card-text"><b>Weather: </b> ${data.list[i].weather[0].description}</p>
                <img id="icon" class="card-text" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
            </div>`;
            } else{
                day += `<div class="card nightModeDtCards">
                <h3>${getDayOfWeek(data.list[i].dt)}</h3>
                <p id="dateTime" class="card-title"><b>Date:</b> ${data.list[i].dt_txt.substring(0, 10)}</p>
                <p id="temp" class="card-text"><b>Avg Temp:</b> ${data.list[i].main.temp} &#8457</p>
                <p class="card-text"><b>Weather: </b> ${data.list[i].weather[0].description}</p>
                <img id="icon" class="card-text" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
            </div>`;
            }
        }
        $("#insertWeather").html(day);
        console.log(data);
    });
}


//functionality for search bar
$("#search-btn").click(function(){
    let address = $("#address-input").val();
    let marker = new mapboxgl.Marker({draggable:true, "color": "#e06848"});

    geocode(address, MAPBOX_API_KEY).then(function(result){
        marker.setLngLat(result).addTo(map);
        map.flyTo({
            center:result,
            zoom: 10
        });
        dragAndDrop(marker);
        marker.on('dragend', function(){
            dragAndDrop(this);
            addPopup(this);

        });

        getForecast(result[1],result[0]);
        getCurrent(result[1],result[0]);
        $("#forecastHeader").removeClass("d-none");
        $("#insertWeatherContainer").removeClass("d-none");

    });
});

// displays san antonio map
mapboxgl.accessToken = MAPBOX_API_KEY;
const coordinates = document.getElementById('coordinates');
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/light-v11",
    zoom:10,
    center: [-98.4916, 29.4252]
});

//drag and drop marker coordinates
function dragAndDrop(marker){
    const lngLat = marker.getLngLat();
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;
    getForecast(lngLat.lat,lngLat.lng);
    getCurrent(lngLat.lat,lngLat.lng);
}

//click to add markers
function addMarker(marker){
    marker = new mapboxgl.Marker({ "color": "#e06848"});
    marker.setLngLat(marker).addTo(map);
}
map.on('click',addMarker);

//add popup on drag end
function addPopup(marker){
    let popup = new mapboxgl.Popup();
    let lat = marker.getLngLat().lat;
    let lon = marker.getLngLat().lng;
    $.get(`https://api.openweathermap.org/data/2.5/weather`, {
        APPID: OPENWEATHER_API_KEY,
        lat: lat,
        lon: lon,
        units: "imperial"
    }).done(function (data) {
        popup.setHTML(`<h3>${data.name}</h3>`);
        marker.setPopup(popup);
        marker.togglePopup();
    });
}

//days of the week
const daysOfWeek = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];
function getDayOfWeek(dt){
    let date = new Date(dt * 1000);
    let day = date.getDay();
    return daysOfWeek[day];
}

//night mode
$("#colorModeBtn").click(function(){
    nightMode();
});


function nightMode(){
    if (modeStatus === true){
        modeStatus = false;
    }else{
        modeStatus = true;
    }

    let background = document.body;
    background.classList.toggle("nightModeBackground");
    let header = document.getElementById("weatherHeader");
    header.classList.toggle("nightModeHeader");
    let mapBackground = document.getElementById("mapBackground");
    mapBackground.classList.toggle("nightModeMapBackground");
    let searchBarBackground = document.getElementById("searchBar");
    searchBarBackground.classList.toggle("nightModeSearchBar");
    let searchBarBtn = document.getElementById("search-btn");
    searchBarBtn.classList.toggle("nightModeSearchBtn");
    let currentCard = document.getElementById("insertCurrent");
    currentCard.classList.toggle("nightModeCurrent");
    let iconCard = document.getElementById("insertIcon");
    iconCard.classList.toggle("nightModeIcon");
    let weatherContainer = document.getElementById("insertWeatherContainer");
    weatherContainer.classList.toggle("nightModeWeatherContainer");
    let dtCards = document.querySelectorAll(".dayModeDtCards");
    for(var i = 0; i<dtCards.length; i++){
        dtCards[i].classList.toggle("nightModeDtCards");
    }
}