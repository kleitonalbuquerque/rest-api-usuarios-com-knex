var db = require("../database/connection");
const User = require("./User");

class PasswordToken {
  async create(email) {
    let user = await User.findByEmail(email);

    if (user != undefined) {
      try {
        let token = Date.now();

        await db.insert({
          user_id: user.id,
          used: 0,
          token: token,
        });

        return {
          status: true,
          token: token,
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          err: "E-mail informado não existe!",
        };
      }
    } else {
      return {
        status: false,
        err: "E-mail informado não existe!",
      };
    }
  }

  async validate(token) {
    try {
      let result = await db
        .select()
        .where({ token: token })
        .table("passwordtokens");

      if (result.length > 0) {
        let tk = result[0];

        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }

  async setUsed(token) {
    await db
      .update({ used: 1 })
      .where({ token: token })
      .table("passwordtokens");
  }
}

module.exports = new PasswordToken();
