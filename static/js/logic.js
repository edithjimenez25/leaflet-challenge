/**********************************************************
 * # Leaflet Homework - Visualizing Data with Leaflet
 * # Level 1 and 2
 ***********************************************************/

/***************************************************************************
GLOBAL USE INFO
***************************************************************************/

// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level

// Retrieve earthquake geoJSON data.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Alternate query - this take time to upload and could crash your browser
// var queryUrl2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Alternate query - this take time to upload and could crash your browser
// var queryUrl3 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// 
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createMap function
  createMapFeatures(data.features);

});


/***************************************************************************
CREATE FEATURES
***************************************************************************/
// Define a function to run once for each feature in the features array
// Binding a pop-up to each layer
function createMapFeatures(earthquakeData) {

  // Give each feature a popup describing the place and time of the earthquake
  // Add tool tip and pop up information to each earthquake marker.
  function onEachFeature(features, layer) {
    layer.bindPopup("<h3>" + features.properties.place +
        "</h3><hr><p>" + new Date(features.properties.time) + "</p>" +
        "</h3><hr><p>Magnitude: " + features.properties.mag + "</p>");
  }

  // create a function to create a circles according with the magnitude (mag) of the earthquake  
  function circleSize(mag) {
    return mag * 30000;
  }

  // create a function to color the circle according with the magnitude
  function circleColor(mag) {
    if (mag <=1) {return "#FFD700";} 
    else if (mag <= 2) {return "#D6FA8C";}
    else if (mag <= 3) {return "#BEED53";}
    else if (mag <= 4) {return "#2E8B57";}
    else if (mag <= 5) {return "#2E8B57";}
    else {return "#006400"}
  }


  // Create a GeoJSON layer containing the features array on the feature object  
  // Run the onEachDeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {    
    pointToLayer: function(features, latlng){
      return L.circleMarker(latlng, {
        radius: circleSize(features.properties.mag),
        color: circleColor(features.properties.mag),
        fillOpacity: 0.8
      });
    },
    onEachFeature : onEachFeature,
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);

}

/***************************************************************************
CREATE MAP EARTHQUAKE
***************************************************************************/

function createMap(earthquakes){

  // Define streetMap, darkmap grayMap, satelliteMap, outdoorsMap layers
  // streetMap background layer
  var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  // darkMap background layer
  var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // grayMap background  layer
  var grayMap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });  

  // satelliteMap background  layer
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // outdoorsMap background  layer
  var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });


  // Define faultline layer
  var faultline = new L.LayerGroup();


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street": streetMap,
    "Dark": darkMap,
    "Satellite": satelliteMap,
    "Outdoor": outdoorsMap,
    "Light": grayMap
  };
  

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Faultline: faultline
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  // Dallas Texas Coordinate 32.7767° N, 96.7970° W
  var myMap = L.map("map", {
    center: [32.7767, -96.7970],
    zoom: 5,
    layers: [streetMap, earthquakes, faultline]
  });

  /***************************************************************************
   LAYER CONTROL
  ***************************************************************************/

  // Create a layer control | Pass in our baseMaps and overlayMaps | Add the layer control to the map
  // Control which layer is visible
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  /***************************************************************************
  FAULTLINE
  ***************************************************************************/

  // Add query for faultline from reference on the readme: https://github.com/fraxen/tectonicplates --> navigate GeoJson - Select PB2002 Plates file - copy the path
  var queryFaultline = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json" ;


  // Perform a GET request to the faultline query and then add the faultline to the layer
  d3.json(queryFaultline , function(data) {
    // Once we get a response, send the data to the GeoJSON
    L.geoJSON(data, {
      style: function() {
        return {
          color: "#c7ecee",
          fillOpacity: 0, 
        }
      }
    }).addTo(faultline)
  
  });
  

  /***************************************************************************
  LEGEND
  ***************************************************************************/
  // create function to get the color for the legend
  // Color similar to the circle colors
  function getColor(l) {
    if (l <=1) {return "#FFD700";} 
      else if (l <= 2) {return "#D6FA8C";}
      else if (l <= 3) {return "#BEED53";}
      else if (l <= 4) {return "#5D8700";}
      else if (l <= 5) {return "#2E8B57";}
      else {return "#006400"}
  }
 
  // Create a legend to display information about on the map
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function (map) {
  
    var div = L.DomUtil.create('div', 'info legend'),
    levels = [0, 1, 2, 3, 4, 5];
    labels = [];

    div.innerHTML+="Magnitude<br><hr>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i=0; i < levels.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(levels[i]+1) + ' " > &nbsp&nbsp&nbsp&nbsp</i>'+
          + levels[i] + (levels[i + 1] ? '&ndash;' + levels[i + 1] + '<br>' : ' +');
    }
    return div;  
  };

  legend.addTo(myMap);

  
}