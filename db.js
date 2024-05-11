import pgPromise from "pg-promise";

const pgp = pgPromise({});

const dbConfig = {
  user: "postgres",
  password: "Afterglow2019!",
  host: "localhost",
  port: 5432,
  database: "backend",
};

const db = pgp(dbConfig);

export default db;
