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
const ref = fb.ref("/users");

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

    const obj = Object.values(Data).map(x => x.bars);
    const barsCollection = Object.values(obj).map(x => {
      let bors = Object.values(x).map(bar => ({
        //         let truebars = {
        // title: bar.title,
        // address: bar.address,
        // geocode: bar.geocode,
        // beers: bar.beers
        //         };
        //         const geocodes = {
        [bar.address]: bar.geocode
        //         };
      }));
      return bors;
    });
    let result = barsCollection.map(a => a.geocode);
    let resultishe = [].concat.apply([], barsCollection);
    let geocodes = resultishe.reduce(function(acc, x) {
      for (var key in x) acc[key] = x[key];
      return acc;
    }, {});
    // console.log(geocodes);

    const sortedGeocodes = geolib.orderByDistance(geo, geocodes, 500);

    const bars = Object.values(obj).map(x => {
      let bors = Object.values(x).map(bar => ({
        title: bar.title,
        address: bar.address,
        geocode: bar.geocode,
        beers: bar.beers
      }));
      return bors;
    });

    // let asd = bars.map(a => {a.title, a.address, a.geocode, a.beers});
    let qwe = [].concat.apply([], bars);

    // console.log(qwe);
    // console.log(sortedGeocodes[0].key);
    let meow = {
      result1: _.find(qwe, { address: sortedGeocodes[0].key }),
      result2: _.find(qwe, { address: sortedGeocodes[1].key }),
      result3: _.find(qwe, { address: sortedGeocodes[2].key }),
      result4: _.find(qwe, { address: sortedGeocodes[3].key }),
      result5: _.find(qwe, { address: sortedGeocodes[4].key })
    };
    console.log(meow);

    res.send(meow);
    // // const bars = _.map(Data, (spot, barId) => ({
    //   title: spot.title,
    //   geocode: spot.geocode,
    //   barId
    // }));
    // const geocodes = _.map(bars, (bar, title) => ({
    //   [bar.title]: bar.geocode
    // }));
    // geocodes[bars.title] = bars.geocode;
    // console.log(geocodes);
    // _.find(spots, { geocode: sortedGeocodes[0] });
    // res.send(sortedGeocodesn.slice(0, 5));
  });
});

app.post("/beers", (req, res) => {
  const barTitle = req.body.barTitle;
  console.log(barTitle);
  ref.once("value", function(snapshot) {
    const Data = snapshot.val();
    const obj = Object.values(Data).map(x => x.bars);
    const barsCollection = Object.values(obj).map(x => {
      let bors = Object.values(x).map(bar => ({
        //         let truebars = {
        // title: bar.title,
        // address: bar.address,
        // geocode: bar.geocode,
        // beers: bar.beers
        //         };
        //         const geocodes = {
        title: bar.title,
        beers: bar.beers
        //         };
      }));
      return bors;
    });
    let qwe = [].concat.apply([], barsCollection);
    const thisBar = _.find(qwe, { title: barTitle });

    // let asd = bars.map(a => {a.title, a.address, a.geocode, a.beers});
    // let qwe = [].concat.apply([], beers);
    // const huirs = _.find(qwe, { barTitle: barTitle });
    // const beers = _.find(qwe, o => {
    //   return o.title === barTitle;
    // });

    const beerList = _.map(thisBar.beers, beer => ({
      title: beer.beerTitle,
      brewery: beer.beerBrewery,
      style: beer.beerStyle,
      alc: beer.beerAlc
    }));

    // }));
    // console.log(beers.beers);
    // console.log(beerList);
    res.send(beerList);
  });
});
