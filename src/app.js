const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log('TEST');
    res.send('Hi there!');
});

module.exports = app;