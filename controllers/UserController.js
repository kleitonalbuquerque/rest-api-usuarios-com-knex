class UserController {
  async indx(req, res) {}

  async create(req, res) {
    console.log(req.body);
    var { email, name, password } = req.body;

    if (email === undefined || email == "") {
      res.status(400);
      res.json({ err: "O e-mail é iválido!" });
    }

    if (password === undefined || password == "") {
      res.status(400);
      res.json({ err: "Senha é obrigatória!" });
    }

    if (password.length < 5) {
      res.status(400);
      res.json({ err: "A senha deve conter mais que cinco caracteres!" });
    }

    res.status = 200;
    res.send("Pegando o corpo da requisição!");
  }
}

module.exports = new UserController();
