const router = require("express").Router();

const { ReadingList } = require("../models");

const { Op } = require("sequelize");

const { tokenExtractor } = require("./middleware");

router.post("/", async (req, res) => {
  const blogToRead = await ReadingList.create({
    ...req.body,
    read: false,
  });
  res.json(blogToRead);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  await ReadingList.update(
    { read: req.body.read },
    {
      where: {
        [Op.and]: [{ id: req.params.id }, { userId: req.decodedToken.id }],
      },
    }
  );
  return res.json({ read: req.body.read });
});

module.exports = router;
