var db = require("../database/connection");
const User = require("./User");

class PasswordToken {
  async create(email) {
    let user = await User.findEmail(email);

    if (user != undefined) {
      try {
        let token = Date.now();

        // Primeira forma
        // await db("passwordtokens").insert({
        //   user_id: user.id,
        //   used: 0,
        //   token: token,
        // });

        // Segunda forma
        await db
          .insert({
            user_id: user.id,
            used: 0,
            token: token,
          })
          .table("passwordtokens");

        // Terceira forma
        // await knex;
        // .insert({
        //   user_id: user.id,
        //   used: 0,
        //   token: token, // UUID
        // })
        // .table("passwordtokens");

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
}

module.exports = new PasswordToken();
