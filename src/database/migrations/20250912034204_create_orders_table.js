/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.string("code").notNullable().unique();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.bigInteger("total_amount").notNullable();
    table.string("status").defaultTo("PENDING");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("orders");
};
