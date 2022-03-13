const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

// mongoose.Schema bir class olduğu için "new" kullanıldı
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "At least 3 characters needed. You entered {VALUE}"],
    maxlength: [50, "Maximum 50 characters allowed. You entered {VALUE}"],
  },
});

// mongoose.model bir metot olduğu için "new" kullanılamaz!!!
// "genreSchema" yerine yukarıdaki koddaki {...} kısmı direkt olarak yazılabilir...
const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.status(200).send(genres);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save(); //result db'e kaydedilen dökümandır. id bilgisini geri dönelim...

  res.status(200).send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
