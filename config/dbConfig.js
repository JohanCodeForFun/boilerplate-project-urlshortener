const pgp = require('pg-promise')();
const cn = process.env.DB_URL;
const db = pgp(cn);

module.exports = db;
