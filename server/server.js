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
  console.log(req.body);
  const geo = {
    latitude: req.body.lat,
    longitude: req.body.lng
  };
  ref.once("value", function(snapshot) {
    const Data = snapshot.val();
    console.log(Data);
    const bars = _.map(Data, (spot, barId) => ({
      title: spot.title,
      geocode: spot.geocode,
      barId
    }));
    const geocodes = _.map(bars, (bar, title) => ({
      [bar.title]: bar.geocode
    }));
    geocodes[bars.title] = bars.geocode;
    console.log(geocodes);
    const sortedGeocodes = geolib.orderByDistance(geo, geocodes, 500);
    console.log(sortedGeocodes);
    // _.find(spots, { geocode: sortedGeocodes[0] });
    // res.send(sortedGeocodesn.slice(0, 5));
  });
});

app.post("/beers", (req, res) => {
  const barTitle = req.body.barTitle;
  // console.log(req.body);
  ref.once("value", function(snapshot) {
    const Data = snapshot.val();
    // console.log(Data);
    const beers = _.find(Data, o => {
      return o.title === barTitle;
    });
    const beerList = _.map(beers.beers, (beer, beerTitle) => ({
      title: beer.beerTitle,
      brewery: beer.beerBrewery,
      style: beer.beerStyle,
      alc: beer.beerAlc
    }));
    // console.log(beers.beers);
    console.log(beerList);
    res.send({ beerList });
  });
});
