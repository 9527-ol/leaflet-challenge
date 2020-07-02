var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
d3.json(url, function(data) {
  console.log(data);
  // Create Features
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" 
      + "</h3><p><b>Magnitude:</b> " +
      feature.properties.mag +"</p>"
      );
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: (feature, latlng) => {
      var geojsonMarkerOptions = {
          radius: 5 * feature.properties.mag,
          fillColor: chooseColor(feature.properties.mag),
          color: "none",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.5
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Choose Color for circles
function chooseColor(color){
  return color <= 1
  ? "#9ABCD0" 
  : color <= 2
      ? "#7FCCA6"
      : color <= 3
          ? "#89C865"
          : color <= 4
              ? "#C5A94D"
              : color <= 5
                ? "#C13542"
                : color <= 6
                    ? "#BD1E87"
                    : color >= 6
                        ? "#2708BA"
                        : "#2708BA";
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3.5,
    layers: [streetmap, earthquakes]
  });



  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
      var div = L.DomUtil.create('div', 'info legend'), 
      labels = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6+'];
      colors = ['#9ABCD0', '#7FCCA6', '#89C865', '#C5A94D', '#C13542', '#BD1E87', '#2708BA']

      for (var i = 0; i< labels.length; i++){
        div.innerHTML += '<i style = "background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
      }
      return div;
  };
  // Add Legend to the Map
  legend.addTo(myMap);

};




