const express = require('express');
const app = express();

app.use('/categoria', require('./categorias/categoria'));
app.use('/platillo', require('./categorias/platillo'));


module.exports = app;