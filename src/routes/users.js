const UsersController = require("../controllers/UserController");
const { createUserSchema, updateUserSchema } = require("../validations/userValidation");

module.exports = [
  {
    method: "GET",
    path: "/users",
    handler: UsersController.index,
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: UsersController.show,
  },
  {
    method: "POST",
    path: "/users",
    options: {
      validate: {
        payload: createUserSchema,
        failAction: (request, h, err) => {
          // return error detail ke client
          throw err;
        },
      },
    },
    handler: UsersController.store,
  },
  {
    method: "PUT",
    path: "/users/{id}",
    options: {
      validate: {
        payload: updateUserSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
    handler: UsersController.update,
  },
  {
    method: "DELETE",
    path: "/users/{id}",
    handler: UsersController.destroy,
  },
];
