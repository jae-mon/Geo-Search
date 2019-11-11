function geoMap() {
    var mapProp= {
      center:new google.maps.LatLng(6.465422, 3.406448),
      zoom:1,
    };
    var map = new google.maps.Map(document.getElementById("geo-map"),mapProp);
    }