const express = require("express");
const morgan = require("morgan");

const folderRouter = require("./routes/folderRouter");
const noteRouter = require("./routes/noteRouter");

//App setup
const app = express();
app.use(express.json());
app.use(morgan("tiny"));

//Routes
app.use("/folders", folderRouter);
app.use("/notes", noteRouter);

app.get("*", function (req, res) {
  res.status(404).send("404 - not found");
});

module.exports = app;
