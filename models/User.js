// var knex = require("knex");
var db = require("../database/connection");
var bcrypt = require("bcrypt");

class User {
  async new(name, email, password) {
    try {
      // await knex.insert({ name, email, password, role: 0 }).table("users");
      await db("users").insert({ name, email, password });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new User();
