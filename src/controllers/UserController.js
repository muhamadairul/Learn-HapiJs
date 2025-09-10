const Users = require('../models/Users');

class UsersController {
  async index(request, h) {
    const data = await Users.all();
    return h.response(data);
  }

  async show(request, h) {
    const { id } = request.params;
    const user = await Users.find(id);
    if (!user) return h.response({ message: 'User not found' }).code(404);
    return h.response(user);
  }

  async store(request, h) {
    const { name, email, password } = request.payload;
    if (await Users.findByEmail(email)) {
      return h.response({ message: 'Email already exists' }).code(400);
    }
    const [newUser] = await Users.create({ name, email, password });
    return h.response(newUser).code(201);
  }

  async update(request, h) {
    const { id } = request.params;
    const { name, email, password } = request.payload;
    const [updatedUser] = await Users.update(id, { name, email, password });
    if (!updatedUser)
      return h.response({ message: 'User not found' }).code(404);
    return h.response(updatedUser);
  }

  async destroy(request, h) {
    const { id } = request.params;
    const deleted = await Users.delete(id);
    if (!deleted)
      return h.response({ message: 'User not found' }).code(404);
    return h.response({ message: 'User deleted successfully' });
  }
}

module.exports = new UsersController();
