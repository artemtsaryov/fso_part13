const router = require("express").Router();
const { Op } = require("sequelize");

const { Note } = require("../models");
const { User } = require("../models");

const tokenExtractor = require("../util/middleware").tokenExtractor;

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.important) {
    where.important = req.query.important === "true";
  }

  if (req.query.search) {
    where.content = {
      [Op.substring]: req.query.search,
    };
  }

  const notes = await Note.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: user,
      attributes: ["name"],
    },
    where,
  });

  res.json(notes);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

router.get("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy();
  }
  res.status(204).end();
});

router.put("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
