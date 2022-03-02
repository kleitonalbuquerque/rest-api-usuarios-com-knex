// var knex = require("knex");
var db = require("../database/connection");
var bcrypt = require("bcrypt");

class User {
  async new(name, email, password, role) {
    try {
      let hash = await bcrypt.hash(password, 10);

      await db("users").insert({ name, email, password: hash, role });
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      let result = await db.select("*").from("users").where({ email: email });
      console.log(result);

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new User();
