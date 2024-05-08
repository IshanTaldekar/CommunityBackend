const { Pool } = require("pg");

const pool = new Pool({
  user: "postgresql",
  password: "postgresql",
  host: "localhost",
  port: 5432,
  database: "community",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
