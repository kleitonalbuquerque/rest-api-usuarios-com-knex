const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secret = "pretitadocoracaos2";
class UserController {
  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);

    if (user === undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    console.log(req.body);
    var { email, name, password, role } = req.body;

    if (email === undefined || email == "" || email == " ") {
      res.status(400);
      res.json({ err: "O e-mail é inválido!" });
      return;
    }

    if (password === undefined || password == "") {
      res.status(400);
      res.json({ err: "Senha é obrigatória!" });
      return;
    }

    if (password.length < 5) {
      res.status(400);
      res.json({ err: "A senha deve conter mais que cinco caracteres!" });
      return;
    }

    let emailExists = await User.findByEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "O e-mail já está cadastrado!" });
      return;
    }

    await User.new(name, email, password, role); // await: só vai para a próxima linha qd essa task for executada

    res.status = 200;
    res.send("Pegando o corpo da requisição!");
  }

  async edit(req, res) {
    let { id, name, role, email } = req.body;
    let result = await User.update(id, name, email, role);

    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Tudo OK!");
      } else {
        res.status(500);
        res.send(result.err);
      }
    } else {
      res.status(500);
      res.send("Ocorreu um erro no servidor!");
    }
  }

  async delete(req, res) {
    let id = req.params.id;
    let result = await User.delete(id);

    if (result.status) {
      res.status(200);
      res.send("Usuário deletado!");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    let email = req.body.email;
    let result = await PasswordToken.create(email);

    if (result.status) {
      console.log(result.token);
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async changePassword(req, res) {
    let token = req.body.token;
    let password = req.body.password;
    let isTokenValid = await PasswordToken.validate(token);

    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("Senha alterada!");
    } else {
      res.status(406);
      res.send("Token inválido!");
    }
  }

  async login(req, res) {
    let { email, password, role } = req.body;
    let userPassword = req.body.password;
    let user = await User.findByEmail(email);

    if (user != false) {
      if (password.length > 3 && password === userPassword) {
        let token = jwt.sign({ email: email, role: role }, secret, {
          expiresIn: "1h",
        });
        console.log("email: ", email);
        console.log("role: ", role);
        console.log("token: ", token);
        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        // res.send("Senha incorreta!");
        res.json({ err: "Senha incorreta!" });
      }
    } else {
      res.status(400);
      // res.send("Usuário não existe!");
      res.json({ err: "Usuário não existe!" });
    }
  }
}

module.exports = new UserController();
