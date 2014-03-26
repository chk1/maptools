var map = L.map('map');
var lineOptions = {
    color: '#000',
    weight: 1,
    opacity: 0.5
};
var aPath = new L.Polyline([], lineOptions);
var bPath = new L.Polyline([], lineOptions);
map.on('load', function(e) {
    updateCoords();
});

var clickMarker = new L.marker();
var testMarker = new L.marker();

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

map.setView([51.505, -0.09], 13);

function updateCoords() {
    var north = map.getBounds().getNorth();
    var east = map.getBounds().getEast();
    var south = map.getBounds().getSouth();
    var west = map.getBounds().getWest();

    var eastlatlng = new L.LatLng(map.getCenter().lat, east);
    var westlatlng = new L.LatLng(map.getCenter().lat, west);
    var northlatlng = new L.LatLng(north, map.getCenter().lng);
    var southlatlng = new L.LatLng(south, map.getCenter().lng);

    //testMarker.setLatLng(map.getCenter()).addTo(map);

    $('#map-center-latlon').val('' + map.getCenter().lat + ', ' + map.getCenter().lng);
    $('#map-bounds-n').val('' + north);
    $('#map-bounds-e').val('' + east);
    $('#map-bounds-s').val('' + south);
    $('#map-bounds-w').val('' + west);

    var dstNS = northlatlng.distanceTo(southlatlng);
    var dstWE = eastlatlng.distanceTo(westlatlng);
    $('#map-bounds-ns').val('' + dstNS);
    $('#map-bounds-we').val('' + dstWE);

    aPath.setLatLngs([westlatlng, eastlatlng]).addTo(map);
    bPath.setLatLngs([northlatlng, southlatlng]).addTo(map);
}

map.on('click', function(e) {
    $('#map-pos-latlon').val('' + e.latlng.lng + ', ' + e.latlng.lng);
    clickMarker.setLatLng(e.latlng).addTo(map);
});

map.on('moveend', function(e) {
    updateCoords();
});

map.on('zoomend', function() {
    updateCoords();
});

$('#refresh-btn').click(function(e) {
    updateCoords();
});

$('#goto-btn').click(function(e) {
    map.setView(clickMarker.getLatLng());
    updateCoords();
});

$('#locate-btn').click(function(e) {
    map.locate();
    $('#locate-status').html('Trying to locate you...');
});

var foundUserLocation = false;
var userLocation = new L.latLng();
map.on('locationfound', function(e) {
    foundUserLocation = true;
    userLocation = new L.latLng(e.latlng.lat, e.latlng.lng);
    $('#map-pos-locate').val('' + e.latlng.lat + ', ' + e.latlng.lng);
    $('#locate-goto-btn').removeAttr('disabled');
});

map.on('locationerror', function(e) {
    foundUserLocation = false;
    $('#map-pos-locate').val('Couldn\'t find you');
});

$('#locate-goto-btn').on('click', function() {
    map.setView(userLocation);
});