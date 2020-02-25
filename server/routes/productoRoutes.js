const express = require('express');

// autenticacion
const { VerificaToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/productoModel');

// get productos
app.get('/productos', VerificaToken, (req, res) => {

  //trae todos los productos. populate usuarios,categoria. Paginado

  let desde = req.query.desde || 0;
  desde = Number(desde);
  let hasta = req.query.hasta || 10;
  hasta = Number(hasta);

  Producto.find({
      disponible: true
    }).skip(desde).limit(hasta)
    .populate('usuario', 'nombre email').populate('categoria', 'descripcion')
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err
        });
      }

      Producto.count({
        disponible: true
      }, (err, cantidad) => {

        if (cantidad === 0) {
          console.log('No se encontro datos en la base!!!');
        }

        return res.status(200).json({
          ok: true,
          categoria: data,
          cantidad
        })
      });
    });
});

app.get('/productos/:id', VerificaToken, (req, res) => {
  // populate usuarios,categoria.
  let id = req.params.id;
  Producto.find('5dfd67fde28074130299a7fb').populate('usuario').populate('categoria')
    .exec((err, data) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      if (!data) {
        console.log('No existe el id en base');
      }

      return res.status(200).json({
        ok: true,
        categoria: data,
      })

    });
});

// Buscar Productos
app.get('/productos/buscar/:termino', VerificaToken, (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  Producto.find({
      nombre: regex
    })
    .populate('categoria', 'nombre')
    .exec((err, productos) => {


      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        productos
      })

    })
});

// crear producto
app.post('/productos/', VerificaToken, (req, res) => {

  // grabar usuario. grabar una categoria del listado

  let producto = new Producto({
    nombre: req.body.nombre,
    precioUni: req.body.precioUni,
    descripcion: req.body.descripcion,
    disponible: req.body.disponible,
    categoria: req.body.categoria,
    usuario: req.usuario._id
  })



  producto.save((err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    console.log("Dando de alta un producto");
    return res.status(201).json({
      ok: true,
      producto: data
    })

  });

});


// actualiza producto
app.put('/Productos/:id', VerificaToken, (req, res) => {

  // populate usuarios,categoria.

  let id = req.params.id;

  let productoUpdate = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precioUni: req.body.precioUni,
    categoria: req.body.categoria,
    disponible: req.body.disponible
  }

  Producto.findByIdAndUpdate(id, productoUpdate, {
    runValidators: true,
    new: true
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!data) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El Producto no existe'
        }
      })
    }

    return res.status(200).json({
      ok: true,
      producto: data
    })

  });


});


// borrar producto
app.delete('/Productos/:id', VerificaToken, (req, res) => {

  let id = req.params.id;

  let productoUpdate = {
    disponible: false
  }

  Producto.findByIdAndUpdate(id, productoUpdate, {
    runValidators: true,
    new: true
  }, (err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Producto borrado'
    })

  });

});

module.exports = app;
