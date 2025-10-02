const db = require("../../config/db");

class BaseModel {
  constructor(tableName) {
    this.table = tableName;
  }

  async all() {
    return db(this.table).select("*");
  }

  async find(id) {
    return db(this.table).where({ id }).first();
  }

  async create(data) {
    return db(this.table).insert(data).returning("*");
  }

  async update(id, data) {
    return db(this.table).where({ id }).update(data).returning("*");
  }

  async delete(id) {
    return db(this.table).where({ id }).del();
  }

  query() {
    return db.table(this.table);
  }
}

module.exports = BaseModel;
