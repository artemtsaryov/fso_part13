const router = require("express").Router();

const { Blog } = require("../models");
const { User } = require("../models");

const { tokenExtractor } = require("./middleware");

const { Op } = require("sequelize");

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    include: {
      model: User,
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id, {
    include: {
      model: Blog,
    },
  });
  if (user.blogs.find((b) => b.id == req.params.id)) {
    await Blog.destroy({ where: { id: req.params.id } });
    return res.status(204).end();
  } else {
    return res.status(403).end();
  }
});

router.put("/:id", async (req, res) => {
  await Blog.update(
    { likes: req.body.likes },
    { where: { id: req.params.id } }
  );
  return res.json({ likes: req.body.likes });
});

module.exports = router;
