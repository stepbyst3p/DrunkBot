const botRoutes = require("./bot_routes");
module.exports = function(app, db) {
  botRoutes(app, db);
};
