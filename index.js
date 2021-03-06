const mongoose = require("mongoose");
const genres = require("./routes/genres");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => {
    console.log("Connected to the database...");
  })
  .catch((err) => {
    console.error("Couldn't connect to the database!");
  });

app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
