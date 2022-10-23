const router = require("express").Router();

const { User } = require("../models");
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const blogToReturn = {};
  if (req.query.read) {
    if (req.query.read === "true") {
      blogToReturn.read = true;
    } else if (req.query.read === "false") {
      blogToReturn.read = false;
    }
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: [""] },
    include: [
      {
        model: Blog,
        as: "blogs_read",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: ["id", "read"],
          where: blogToReturn,
        },
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
