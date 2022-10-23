const jwt = require("jsonwebtoken");

const { User, Session } = require("../models");

const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);

      //Ex. 13.24 check
      const session = await Session.findByPk(authorization.substring(7));
      if (!session) {
        return res.status(401).json({ error: "session doesn't exist" });
      }
      //End of Ex. 13.24 check
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { tokenExtractor };
