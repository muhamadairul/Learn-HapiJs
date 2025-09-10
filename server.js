"use strict";

const Hapi = require("@hapi/hapi");
const usersRoutes = require("./src/routes/users");
const serverConfig = require("./config/server"); // config server terpisah

const init = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: serverConfig.routes, // kalau ada CORS, etc
  });

  server.realm.modifiers.route.prefix = "/api";

  server.route(usersRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
  console.log("Server running on port %s", server.info.port);
  console.log("Server running on host %s", server.info.host);
  console.log("Click CTRL + C to stop the server");
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
