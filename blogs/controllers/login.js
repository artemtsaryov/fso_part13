const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models/");

router.post("/", async (request, response) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  if (user && user.disabled) {
    return response.status(403).json({
      error: "Access restricted",
    });
  }

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({ token });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

router.delete("/", async (request, response) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    await Session.destroy({ where: { token: authorization.substring(7) } });
    return response.status(204).end();
  }
});

module.exports = router;
