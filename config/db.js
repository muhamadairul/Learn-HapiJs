const knex = require('knex');
const knexConfig = require('../knexfile'); // arahkan sesuai struktur project

const db = knex(knexConfig.development);

module.exports = db;
