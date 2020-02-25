const express = require('express');

const app = express();

app.use(require('./usuarioRoutes'));
app.use(require('./loginRoutes'));
app.use(require('./categoriaRoutes'));
app.use(require('./productoRoutes'));
app.use(require('./uploadsRoutes'));
app.use(require('./imagenesRoutes'));



module.exports = app;
