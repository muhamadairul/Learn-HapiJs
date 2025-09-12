/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.bigInteger("price").notNullable();
    table.integer("stock").defaultTo(0);
    table.integer("category_id").unsigned().references("id").inTable("product_categories").onDelete("SET NULL");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("products");
};
