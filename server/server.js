const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const db = require("./config/db");
const distance = require("gps-distance");
const app = express();
const _ = require("lodash");
const geolib = require("geolib");
// const firebase = require("./config/firebase");
const admin = require("firebase-admin");
const serviceAccount = require("./config/firebase_key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://beerbot-91a90.firebaseio.com"
});
const fb = admin.database();
const ref = fb.ref("/bars");

const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
MongoClient.connect(db.url, (err, database) => {
  app.listen(port, () => {
    console.log("We are live on " + port);
  });
});

app.post("/bars", (req, res) => {
  console.log(req);
  const geo = {
    latitude: req.body.lat,
    longitude: req.body.lng
  };
  ref.once("value", function(snapshot) {
    const Data = snapshot.val();
    const bars = _.map(Data, (spot, barId) => ({
      title: spot.title,
      barId
    }));
    res.send(bars.slice(0, 5));

    // let spots = _.map(Data, spot => {
    //   let barBeers = _.values(spot.beers);
    //   return spot.title + barBeers + spot.address + spot.geocode;
    // });
    // let sortedGeocodes = geolib.orderByDistance(geo, spots, 1000);

    // console.log(sortedGeocodes);
    // _.find(spots, { geocode: sortedGeocodes[0] });
    // res.send(sortedGeocodesn.slice(0, 5));
  });
});
