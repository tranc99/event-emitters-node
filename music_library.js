var Album, legend, mongoose;

mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/music_library");

Album = mongoose.model("Album", {
  title: String,
  artist: String,
  genre: String
});

legend = new Album({
  title: "Legend",
  artist: "Bob Marley",
  genre: "Reggae"
});

legend.save(function(error, data) {
  if (error) {
    return console.error(error);
  } else {
    console.log("Successfully saved album: ", data);
    return process.exit(0);
  }
});
