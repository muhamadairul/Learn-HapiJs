/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('payment_methods').del()
  await knex('payment_methods').insert([
    {name: 'CASH'},
    {name: 'QRIS'},
    {name: 'VIRTUAL ACCOUNT'},
  ]);
};
