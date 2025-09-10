require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  routes: {
    cors: {
      origin: ["*"],
      credentials: true,
    },
    validate: {
      failAction: async (request, h, err) => {
        if (process.env.NODE_ENV === "production") {
          throw err;
        } else {
          console.error("ValidationError:", err.message);
          throw err;
        }
      },
    },
  },
  debug:
    process.env.NODE_ENV === "development"
      ? { request: ["error"], log: ["error"] }
      : false,
};
