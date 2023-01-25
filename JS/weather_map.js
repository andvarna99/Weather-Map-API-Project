"use strict";

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
                            <p><b>Current Date and Time: </b><br> ${myDate.toGMTString()}</p>
                            <p><b>Current Temp: </b><br> ${data.main.temp} degrees F
                        </div>`;
        let icon = "";
        icon += `<div>
                    <h2 id="currentWeather"><br>Current Weather: <br>${data.weather[0].description}</h2>
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
            day += `<div id="dateTimeCards" class="card">
                <p id="dateTime" class="card-title"><b>Date:</b> ${data.list[i].dt_txt.substring(0,10)}</p>
                <p id="temp" class="card-text"><b>Temp:</b> ${data.list[i].main.temp} degrees F</p>
                <img id="icon" class="card-text" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
            </div>`;
        }
        $("#insertWeather").html(day);
        console.log(data);
    });
}


//functionality for search bar
$("#search-btn").click(function(){
    let address = $("#address-input").val();
    let marker = new mapboxgl.Marker({draggable:true, "color": "#cb8990"});
    const forecastHeader = document.getElementById("#forecastHeader");

    geocode(address, MAPBOX_API_KEY).then(function(result){
        marker.setLngLat(result).addTo(map);
        map.flyTo({
            center:result,
            zoom: 10
        });
        dragAndDrop(marker);
        marker.on('dragend', function(){
            dragAndDrop(this);
        });
        getForecast(result[1],result[0]);
        getCurrent(result[1],result[0]);
        forecastHeader.style.display = "block";
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
    marker = new mapboxgl.Marker({ "color": "#cb8990"});
    marker.setLngLat(marker).addTo(map);
}
map.on('click',addMarker);