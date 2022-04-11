const jwt = require("jsonwebtoken");
const secret = "pretitadocoracaos2";

module.exports = function (req, res, next) {
  const authToken = req.headers["authorization"];

  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    let token = bearer[1];

    try {
      var decoded = jwt.verify(token, secret);
      console.log(decoded);

      if (decoded.role == 1) {
        next(); // passa a requisição para a rota
      } else {
        res.status(403);
        res.send("Você não tem permissão!");
        return;
      }
    } catch (error) {
      res.status(403);
      res.send("Você não está autenticado!");
      return;
    }
  } else {
    res.status(403);
    res.send("Você não está autenticado!");
    return;
  }
};
