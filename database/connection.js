const knex = require("knex");

const database = knex({
  client: "mysql2",
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "apiusersknex",
  },
});

module.exports = database;
