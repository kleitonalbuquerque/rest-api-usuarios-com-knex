var User = require("../models/User");

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

    if (email === undefined || email == "") {
      res.status(400);
      res.json({ err: "O e-mail é iválido!" });
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

    let emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "O e-mail já está cadasttrado!" });
      return;
    }

    await User.new(name, email, password, role); // await: só vai para a próxima linha qd essa task for executada

    res.status = 200;
    res.send("Pegando o corpo da requisição!");
  }
}

module.exports = new UserController();
