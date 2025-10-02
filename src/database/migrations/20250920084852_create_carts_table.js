/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("carts", (table) => {
    table.increments("id").primary();
    table.integer("product_id").unsigned().references("id").inTable("products").onDelete("CASCADE");
    table.integer("quantity").notNullable().defaultTo(1);
    table.bigInteger("total_amount").notNullable();
    table.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
