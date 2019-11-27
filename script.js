let map;
let local;
let bounds;
let infoWindow;
let currentWindow;
let service;
let infoPane;
let autocomplete;
function geoMap() {
  bounds = new google.maps.LatLng();
  infoWindow = new google.maps.InfoWindow;
  currentWindow = infoWindow;

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      local = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map = new google.maps.Map(document.getElementById('geo-map'),{
        center: local,
        zoom: 10
      });
      bounds.extend(local);

      infoWindow.setPosition(local);
      infoWindow.setContent('City found.');
      infoWindow.open(map);
      map.setCenter(local);
    }, () => {
      //Browser supports geolocation, but user has denied permission
      handleLocationError(true, infoWindow);
    });
  } else {
    //Browser doesn't support geolocation
    handleLocationError(false, infoWindow);
  }
}
// Handle a geolocation error
function handleLocationError(browserHasGeolocation, infoWindow) {
  // Set default location to Lagos, Nigeria
  local = {lat: 6.465422, lng: 3.406448};
  map = new google.maps.Map(document.getElementById("geo-map"), {
    center: local,
    zoom: 10
  });

  infoWindow.setPosition(local);
  infoWindow.setContent(browserHasGeolocation ?
    'Geolocation permission denied. Using default location.' :
    'Error: Your browser doesn\'t support geolocation');
    infoWindow.open(map);
    currentWindow = infoWindow;

    getNearbyCities(local);
}  

function getNearbyCities(position) {
  let request = {
    location: position,
    rankBy: google.maps.places.rankBy.DISTANCE,
    keyword: 'cities'
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}

function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    createMarkers(results);
  }
}

function createMarkers(cities) {
  cities.forEach(place => {
    let marker = new google.maps.Marker ({
      position: place.geometry.location,
      map: map,
      title: place.name
    });
  })
}
