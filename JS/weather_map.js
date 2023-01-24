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
                            <p><b>Current Day: </b> ${myDate.toGMTString()}</p>
                            <p><b>Current Location: </b> ${data.name}</p>
                            <p><b>Current Temp: </b> ${data.main.temp} degrees F
                        </div>`;
        $("#insertCurrent").html(currentDay);
        console.log(data);
        // ${myDate.toLocaleString()}
    });
}
getCurrent(29.4252,-98.4916);

//5 day weather forecast
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
                <p id="dateTime" class="card-title"><b>Day:</b> ${data.list[i].dt_txt}</p>
                <p id="temp" class="card-text"><b>Temp:</b> ${data.list[i].main.temp} degrees F</p>
            </div>`;
        }
        $("#insertWeather").html(day);
    });
}

//functionality for search bar
$("#search-btn").click(function(){
    let address = $("#address-input") .val();
    let marker = new mapboxgl.Marker({draggable:true, "color": "#cb7782"});
    geocode(address, MAPBOX_API_KEY).then(function(result){
        marker.setLngLat(result).addTo(map);
        map.flyTo({
            center:result,
            zoom: 10
        });
        onDragEnd(marker);
        marker.on('dragend', function(){
            onDragEnd(this);
        });
        getForecast(result[1],result[0]);
        getCurrent(result[1],result[0]);
    });

});

// displays san antonio map
mapboxgl.accessToken = MAPBOX_API_KEY;
const coordinates = document.getElementById('coordinates');
const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/navigation-night-v1",
    zoom:10,
    center: [-98.4916, 29.4252]
});

//drag and drop marker stuff
const marker = new mapboxgl.Marker({draggable:true,"color":"#cb7782"})

// .setLngLat([-98.4916, 29.4252]).addTo(map);

function onDragEnd(marker){
    console.log(marker);
    const lngLat = marker.getLngLat();
    console.log(lngLat);
    coordinates.style.display = 'block';
    coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;

}
marker.on('dragend', onDragEnd);

