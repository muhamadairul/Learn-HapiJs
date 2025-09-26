"use strict";

const Hapi = require("@hapi/hapi");
const usersRoutes = require("./src/routes/users");
const serverConfig = require("./config/server"); // config server terpisah
const paymentMethodRoutes = require("./src/routes/payment_method");
const product_category = require("./src/routes/product_category");
const product = require("./src/routes/product");

const init = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: serverConfig.routes,
  });

  server.realm.modifiers.route.prefix = "/api";

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    if (response.isBoom) {
      return h
        .response({
          statusCode: response.output.statusCode,
          error: response.output.payload.error,
          message: response.message,
        })
        .code(response.output.statusCode);
    }

    return h.continue;
  });

  server.route(usersRoutes);
  server.route(paymentMethodRoutes);
  server.route(product_category);
  server.route(product);

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
