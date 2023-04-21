const express = require('express');
const asyncHandler = require("express-async-handler");
const morgan = require('morgan');
const { RequireAuth, OptionalAuth } = require("./middleware/authorization");

const folderRouter = require("./routes/folderRouter");
const noteRouter = require("./routes/noteRouter");
const userRouter = require("./routes/userRouter");

//App setup
const app = express();
app.use(express.json());
app.use(morgan('tiny'));

//Routes
app.use("/folders", folderRouter);
app.use("/notes", noteRouter);
app.use("/users", userRouter); //TODO: remove this

//Authorization test endpoints
//TODO: Remove before submitting
app.get("/requiredAuth", RequireAuth, asyncHandler(async (req, res) => {
    res.json(req.authInfo);
}));

//TODO: Remove before submitting
app.get("/optionalAuth", OptionalAuth, asyncHandler(async (req, res) => {
    res.json(req.authInfo);
}));

app.get('*', function(req, res){
    res.status(404).send('404 - not found');
});

module.exports = app;