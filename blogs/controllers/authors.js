const router = require("express").Router();

const { Blog } = require("../models");
const { User } = require("../models");

const { sequelize } = require("../util/db");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("*")), "blogs"],
      [sequelize.fn("COUNT", sequelize.col("likes")), "likes"],
    ],
    group: "author",
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
