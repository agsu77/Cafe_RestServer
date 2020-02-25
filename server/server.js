require('./config/config')
const express = require('express')
const app = express()
const mongo = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path');

// PUERTO
const puerto = process.env.PORT;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())

//  RUTAS
app.use(require('./routes/app.Routes'));

//public
app.use(express.static(path.resolve(__dirname, '../public')));

mongo.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');

  })

app.listen(puerto, () => console.log(`escuchando puerto ${puerto} `))
