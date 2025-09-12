/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("order_details", (table) => {
    table.increments("id").primary();
    table.integer("order_id").unsigned().references("id").inTable("orders").onDelete("CASCADE");
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").notNullable();
    table.bigInteger("price").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("order_details");
};
