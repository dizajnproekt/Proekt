var mymap = L.map('mapid').setView([41.9981, 21.4254], 13);
var myposition = null;
var positions = [];
var staticPositions = [];
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGVkZHRzeCIsImEiOiJja2ljN3Q0ejkxNzIzMnlyc2ZrdWptbGFwIn0.UY5NhACafHt0n377fhB91Q'
}).addTo(mymap);

function drawMarkers() {
    $.ajax("/stores", {
        success: function (data, status, xhr) {
            data.stores.forEach(store => {
                console.log(store);
                var marker = L.marker([store.lat, store.long]).addTo(mymap);
                marker.bindPopup(`<b>${store.name}</b><br>${store.address}`).openPopup();
                positions.push({
                    lat: store.lat,
                    long: store.long,
                    name: store.name,
                    address: store.address
                });
            })
            staticPositions = positions;
        }
    })
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
        dist = dist * 1.609344
    }
    if (unit == "N") {
        dist = dist * 0.8684
    }
    return dist
}

function showPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var positionInfo = "Your current position is (" + "Latitude: " + position.coords.latitude + ", " + "Longitude: " + position.coords.longitude + ")";
            console.log(positionInfo);
            myposition = {
                lat: position.coords.latitude,
                long: position.coords.longitude
            };
            var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
            marker.bindPopup("<b>Your Current location</b>").openPopup();
        });
    } else {
        alert("Sorry, your browser does not support HTML5 geolocation.");
    }
}

showPosition();

function findNearest() {
    let index = 0;
    let mindistance = distance(myposition.lat, myposition.long, positions[0].lat, positions[0].long, "K");
    for (let i = 0; i < positions.length; i++) {
        if (distance(myposition.lat, myposition.long, positions[i].lat, positions[i].long, "K") < mindistance) {
            index = i;
            mindistance = distance(myposition.lat, myposition.long, positions[i].lat, positions[i].long, "K");
        }
    }
    var latLon = L.latLng(positions[index].lat, positions[index].long);
    var bounds = latLon.toBounds(500); // 500 = metres
    mymap.setView(latLon).fitBounds(bounds);
}

function search() {
    positions = staticPositions;
    let query = document.getElementById('field').value;
    if (query === "") {
        return;
    }
    let newpos = [];
    console.log(positions);
    for (let i = 0; i < positions.length; i++) {
        if (positions[i].name.toLowerCase().includes(query.toLowerCase())) {
            newpos.push(positions[i]);
        }
    }
    positions = newpos;
    mymap.eachLayer(function (layer) {
        mymap.removeLayer(layer);
    });
    showPosition();
    // var mymap = L.map('mapid').setView([41.9981, 21.4254], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidGVkZHRzeCIsImEiOiJja2ljN3Q0ejkxNzIzMnlyc2ZrdWptbGFwIn0.UY5NhACafHt0n377fhB91Q'
    }).addTo(mymap);
    for (let i = 0; i < positions.length; i++) {
        var marker = L.marker([positions[i].lat, positions[i].long]).addTo(mymap);
        marker.bindPopup("<b>" + positions[i].name + "</b><br>" + positions[i].address).openPopup();
    }
}

drawMarkers();