const geolib = require("geolib");

module.exports = function(app, db) {
  // const barsRef = firebase.database().ref("bars");
  // let bars = snapshot.val();

  app.get("/bars", (req, res) => {
    let spots = {
      "Brandenburg Gate, Berlin": { latitude: 52.516272, longitude: 13.377722 },
      "Dortmund U-Tower": { latitude: 51.515, longitude: 7.453619 },
      "London Eye": { latitude: 51.503333, longitude: -0.119722 },
      "Kremlin, Moscow": { latitude: 55.751667, longitude: 37.617778 },
      "Eiffel Tower, Paris": { latitude: 48.8583, longitude: 2.2945 },
      "Riksdag building, Stockholm": { latitude: 59.3275, longitude: 18.0675 },
      "Royal Palace, Oslo": { latitude: 59.916911, longitude: 10.727567 }
    };

    let yo = geolib.findNearest(req, spots, 5);
    res.send(yo);

    // db.find(req.params.title)
    // const id = req.params.id;
    // const details = { '_id': new ObjectID(id) };
    // db.collection('bars').findOne(details, (err, bar) => {
    //   if (err) {
    //     res.send({'error':'An error has occurred'});
    //   } else {
    //     res.send(bar);
    //   }
    // });
  });
  app.post("/bars", (req, res) => {
    // let spots = {
    //   "Brandenburg Gate, Berlin": { latitude: 52.516272, longitude: 13.377722 },
    //   "Dortmund U-Tower": { latitude: 51.515, longitude: 7.453619 },
    //   "London Eye": { latitude: 51.503333, longitude: -0.119722 },
    //   "Kremlin, Moscow": { latitude: 55.751667, longitude: 37.617778 },
    //   "Eiffel Tower, Paris": { latitude: 48.8583, longitude: 2.2945 },
    //   "Riksdag building, Stockholm": { latitude: 59.3275, longitude: 18.0675 },
    //   "Royal Palace, Oslo": { latitude: 59.916911, longitude: 10.727567 }
    // };
    const geo = {
      latitude: req.body.latitude,
      longitude: req.body.longitude
    };

    ref.once("value", function(snapshot) {
      let Data = snapshot.val();
      let spots = _.map(Data, spot => {
        return spot.geocode;
      });
      console.log(spots);
      let yo = geolib.orderByDistance(geo, spots, 1000);
      res.send(yo.slice(0, 5));
    });

    // const bar = { coordinates: req.body.coordinates, title: req.body.title };
    // db.collection('bars').insert(bar, (err, result) => {
    //   if (err) {
    //     res.send({ 'error': 'An error has occurred' });
    //   } else {
    //     res.send(result.ops[0]);
    //   }
    // });
  });
};
