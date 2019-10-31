// Store API link
var earthquakelink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// define the size of the marker
function markerSize(magnitude) {
  return magnitude * 3;
}

function markerColor(mag) {
  if (mag <= 1) {
      return "red";
  } else if (mag <= 2) {
      return "orange";
  } else if (mag <= 3) {
      return "#FFF700";
  } else if (mag <= 4) {
      return "#ffd700";
  } else if (mag <= 5) {
      return "green";
  } else {
      return "#FF0000";
  };
}

var earthquake = new L.LayerGroup();

// fetch the data from the link and map it
d3.json(earthquakelink, function (geodata){

  console.log(geodata);

  L.geoJson(geodata.features, {

    onEachFeature: function(feature, layer){
      layer.bindPopup("<h3" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p" + "<p> Magnitude: " + feature.properties.mag + "</p")
    },

    pointToLayer: function(feature, latlng) {
      return new L.circleMarker(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
      })
    },
  }).addTo(earthquake);
});

function createMap(){
  
  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: "pk.eyJ1IjoibWFkaHUtciIsImEiOiJjanA1aXd2cGEwOG8zM2twbnNxZ2ZnOWMzIn0.EpYYgZ6vgbmFf-vtY9xeig"
  });
  
  var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: "pk.eyJ1IjoibWFkaHUtciIsImEiOiJjanA1aXd2cGEwOG8zM2twbnNxZ2ZnOWMzIn0.EpYYgZ6vgbmFf-vtY9xeig"
  });
  
  
  var baseMaps = {
    "Dark Map":darkMap,
    "Satellite": satellite
  };
  
  var overlayMaps = {
    "Earthquakes": earthquake,
  };
  
  var map = L.map("map", {
    center: [61.4406, -149.8866],
    zoom: 3,
    layers: [satellite, earthquake]
  });
  
  
  
  L.control.layers(baseMaps, overlayMaps).addTo(map);
  
  var legend = L.control({
    position: "bottomright"
  });
  
  legend.onAdd = function(map){
    var div = L.DomUtil.create("div", "info legend"),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
  
   div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
  
  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
  
    return div;
  };
  
  legend.addTo(map);
  }
  
  createMap();