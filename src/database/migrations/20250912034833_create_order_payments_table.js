/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("order_payments", (table) => {
    table.increments("id").primary();
    table.integer("order_id").unsigned().references("id").inTable("orders").onDelete("CASCADE");
    table.integer("payment_method_id").unsigned().references("id").inTable("payemnt_methods").onDelete("SET NULL");
    table.bigInteger("amount").notNullable();
    table.dateTime("paid_at").nullable();
    table.string("status").defaultTo("PENDING");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
