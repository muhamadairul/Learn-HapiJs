const db = require("../../config/db");
const BaseModel = require("./baseModels");

class Users extends BaseModel {
  constructor() {
    super("users"); 
  }

  async findByEmail(email) {
    return db.table(this.table).where({ email }).first();
  }
}

module.exports = new Users();
