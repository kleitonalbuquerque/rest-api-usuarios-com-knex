class UserController {
  async indx(req, res) {}

  async create(req, res) {
    console.log(req.body);
    res.send("Pegando o corpo da requisição!");
  }
}

module.exports = new UserController();
