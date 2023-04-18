const express = require('express');
const { sequelize } = require('./database');

const folderRouter = require("./routes/folderRouter")

//App setup
const app = express();

app.get('/', (req, res) => {
    console.log('TEST');
    res.send('Hi there!');
});

//Routes
app.use("/folders", folderRouter);

module.exports = app;