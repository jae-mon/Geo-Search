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
  infoPane = document.getElementById('panel');

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

function createMarkers(places) {
  places.forEach(place => {
    let marker = new google.maps.Marker ({
      position: place.geometry.location,
      map: map,
      title: place.name
    });
    google.maps.event.addListener(marker, 'click', () => {
      let request = {
        placeId: place.place_id,
        fields: ['name', 'formatted_address', 'geometry', 'rating',
          'website', 'photos']
      };
      service.getDetails(request, (placeResult, status) => {
        showDetails(placeResult, marker, status)
      });
    });

    bounds.extend(place.geometry.location);
  });
  map.fitBounds(bounds);
}
/* TODO: Step 4C: Show place details in an info window */
    // Builds an InfoWindow to display details above the marker
    function showDetails(placeResult, marker, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let placeInfowindow = new google.maps.InfoWindow();
        let rating = "None";
        if (placeResult.rating) rating = placeResult.rating;
        placeInfowindow.setContent('<div><strong>' + placeResult.name +
          '</strong><br>' + 'Rating: ' + rating + '</div>');
        placeInfowindow.open(marker.map, marker);
        currentInfoWindow.close();
        currentInfoWindow = placeInfowindow;
        showPanel(placeResult);
      } else {
        console.log('showDetails failed: ' + status);
      }
    }

    /* TODO: Step 4D: Load place details in a sidebar */
    // Displays place details in a sidebar
    function showPanel(placeResult) {
      // If infoPane is already open, close it
      if (infoPane.classList.contains("open")) {
        infoPane.classList.remove("open");
      }

      // Clear the previous details
      while (infoPane.lastChild) {
        infoPane.removeChild(infoPane.lastChild);
      }

      /* TODO: Step 4E: Display a Place Photo with the Place Details */
      // Add the primary photo, if there is one
      if (placeResult.photos) {
        let firstPhoto = placeResult.photos[0];
        let photo = document.createElement('img');
        photo.classList.add('hero');
        photo.src = firstPhoto.getUrl();
        infoPane.appendChild(photo);
      }

      // Add place details with text formatting
      let name = document.createElement('h1');
      name.classList.add('place');
      name.textContent = placeResult.name;
      infoPane.appendChild(name);
      if (placeResult.rating) {
        let rating = document.createElement('p');
        rating.classList.add('details');
        rating.textContent = `Rating: ${placeResult.rating} \u272e`;
        infoPane.appendChild(rating);
      }
      let address = document.createElement('p');
      address.classList.add('details');
      address.textContent = placeResult.formatted_address;
      infoPane.appendChild(address);
      if (placeResult.website) {
        let websitePara = document.createElement('p');
        let websiteLink = document.createElement('a');
        let websiteUrl = document.createTextNode(placeResult.website);
        websiteLink.appendChild(websiteUrl);
        websiteLink.title = placeResult.website;
        websiteLink.href = placeResult.website;
        websitePara.appendChild(websiteLink);
        infoPane.appendChild(websitePara);
      }

      // Open the infoPane
      infoPane.classList.add("open");
    }