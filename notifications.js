var EventEmitter, Notifier, compareLocations, fs, getNewLocation, http, internationalSpaceStation, locationBuffer, notifyUser, pushupdates, updateBuffer;

EventEmitter = require("events").EventEmitter;

http = require("http");

fs = require("fs");

pushupdates = require("node-notifier");

// our Notifier object is just an instance of the EventEmitter class
Notifier = new EventEmitter();

// we will be interacting with a data source on the location of the space station
internationalSpaceStation = "http://api.open-notify.org/iss-now.json";

// location buffer stores last location as JSON object
locationBuffer = [
  {
    "latitude": "0",
    "longitude": "0"
  }
];

// API call to get space station location data
getNewLocation = function() {
  // create the http request
  // get new location data
  return http.get(internationalSpaceStation, function(res) {
    var location;
    location = '';
    res.on("data", (bits) => {
      return location += bits;
    });
    return res.on("end", () => {
      var newlocation;
      // parse the received data
      location = JSON.parse(location);
      newlocation = {
        "latitude": location.iss_position.latitude,
        "longitude": location.iss_position.longitude
      };
      // emite the updateLocationData event
      return Notifier.emit("updateLocationData", newlocation);
    });
  });
};

// regularly get new space station location data from the API
setInterval(function() {
  return getNewLocation();
}, 2000);

// notify the user
notifyUser = function(locationData) {
  console.log(`The space station moved. New Latitude: ${locationData.latitude} and New Longitude: ${locationData.longitude}`);
  Notifier.emit("storeNewLocation", locationData);
  return pushupdates.notify(`The space station moved. New Latitude: ${locationData.latitude} and New Longitude: ${locationData.longitude}`);
};

// compare latitude and longitude of locationData with the last locationData in the buffer
compareLocations = function(locationData) {
  // if both don't match up exactly, then the space shuttle has moved
  // emit moveSpaceStation in that case
  if (locationData.latitude === locationBuffer[0].latitude && locationData.longitude === locationBuffer[0].longitude) {
    return console.log("The station has not moved at all");
  } else {
    return Notifier.emit("moveSpaceStation", locationData);
  }
};

// replace old space station location with the latest position
updateBuffer = function(locationData) {
  return locationBuffer[0] = locationData;
};

// listen for events and pass the data as arguments
Notifier.on("moveSpaceStation", notifyUser, "locationData");

Notifier.on("updateLocationData", compareLocations, "locationData");

Notifier.on("storeNewLocation", updateBuffer, "locationData");
