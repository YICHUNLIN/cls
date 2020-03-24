alert('')
$(function(){
	initMap();
});
 
var map;
function initMap() {
map = new google.maps.Map(document.getElementById('map'), {
    center: {lng: 121.564726, lat: 25.033681},
    zoom: 8,
    scaleControl: true,
    zoomControl: true,
    draggableCursor:'crosshair',
  });
}