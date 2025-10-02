/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  knex.schema.table("products", (table) => {
    table.string("image").after("stock");
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.table("products", (table) => {
    table.dropColumn("image");
  })
};
