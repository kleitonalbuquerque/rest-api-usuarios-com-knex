// var knex = require("knex");
var db = require("../database/connection");
var bcrypt = require("bcrypt");
const Knex = require("knex");
const PasswordToken = require("./PasswordToken");

class User {
  async findAll() {
    try {
      let result = await db
        .select(["id", "name", "email", "role"])
        .table("users");
      return result;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findById(id) {
    try {
      let result = await db
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

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

  async update(id, name, email, role) {
    let user = await this.findById(id);

    if (user != undefined) {
      let editUser = {};

      if (email != undefined) {
        if (email != user.email) {
          let result = await this.findEmail(email);

          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, err: "E-mail já cadastrado!" };
          }
        }
      }

      if (name != undefined) {
        editUser.name = name;
      }

      if (role != undefined) {
        editUser.role = role;
      }

      try {
        await db.update(editUser).where({ id: id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, err: error };
      }
    } else {
      return { status: false, err: "Usuário não existe!" };
    }
  }

  async delete(id) {
    let user = await this.findById(id);

    if (user != undefined) {
      try {
        await db.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, err: error };
      }
    } else {
      return { status: false, err: "Usuário não existe!" };
    }
  }

  async changePassword(newPassword, id, token) {
    let hash = await bcrypt.hash(newPassword, 10);

    await db.update({ password: hash }).where({ id: id }).table("users");
    await PasswordToken.setUSed(token);
  }
}

module.exports = new User();
