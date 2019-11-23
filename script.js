var map;
var autocomplete;
function geoMap() {
    var mapProp= {
      center:new google.maps.LatLng(6.465422, 3.406448),
      zoom:5,
    };
     map = new google.maps.Map(document.getElementById("geo-map"),mapProp);
     var input = document.getElementById("search");
     var options = {
       types: ['cities']
     };
     autocomplete = new google.map.places.Autocomplete(input, options);
    }