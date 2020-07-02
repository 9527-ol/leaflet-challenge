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
  // grayscale background.
  var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

  // satellite background.
  var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

  // outdoors background.
  var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    Satellite: satellitemap_background,
    Grayscale: graymap_background,
    Outdoors: outdoors_background
  };

  var tectonicplates = new L.LayerGroup();

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicplates,
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3.5,
    layers: [graymap_background, satellitemap_background, outdoors_background]
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

  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
  function(platedata) {

    L.geoJson(platedata, {
      color: "orange",
      weight: 2
    })
    .addTo(tectonicplates);

    // add the tectonicplates layer to the map.
    tectonicplates.addTo(myMap);
  });
};




