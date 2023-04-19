const express = require('express');
const asyncHandler = require("express-async-handler");
const { RequiredAuth, OptionalAuth } = require("./middleware/authorization");

const folderRouter = require("./routes/folderRouter")
const userRouter = require("./routes/userRouter")

//App setup
const app = express();

//Routes
app.use("/folders", folderRouter);
app.use("/users", userRouter); //TODO: remove this

app.get('/', (req, res) => {
    console.log('TEST');
    res.send('Hi there!');
});

//Authorization test endpoints
//TODO: Remove before submitting
app.get("/requiredAuth", RequiredAuth, asyncHandler(async (req, res) => {
    res.json(req.authInfo);
  }));

//TODO: Remove before submitting
app.get("/optionalAuth", OptionalAuth, asyncHandler(async (req, res) => {
res.json(req.authInfo);
}));



module.exports = app;