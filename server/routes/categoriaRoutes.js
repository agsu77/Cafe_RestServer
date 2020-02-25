const express = require('express');
let app = express();

let {
  VerificaToken,
  VerificaAdminRole
} = require('../middlewares/autenticacion');

let Categoria = require('../models/categoriaModel');

// Mostrar todas las Categorias
app.get('/categoria', VerificaToken, (req, res) => {

  Categoria.find()
    .populate('usuario', 'nombre email')
    .sort('descripcion')
    .exec((err, data) => {
      if (err) {
        // return error
        return res.status(400).json({
          ok: false,
          err
        })
      }
      let cantidad = data.length;

      return res.status(200).json({
        ok: true,
        cantidad,
        categorias: data
      })
    });

});

// Mostrar una Categorias por ID
app.get('/categoria/:id', VerificaToken, (req, res) => {
  // Categoria.findbyid

  let categoriaID = req.params.id;

  Categoria.findById(categoriaID).exec((err, data) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    return res.status(200).json({
      ok: true,
      categoria: data
    })

  })
});


// Crear una Categorias
app.post('/categoria', VerificaToken, (req, res) => {
  let categoria = new Categoria({
    descripcion: req.body.descripcion,
    usuario: req.usuario._id //Lo manda el VerificaToken a todas las req que pasan por alli
  })

  categoria.save((err, data) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!data) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    return res.status(200).json({
      ok: true,
      categorias: data
    })
  });
});

// actualiza una Categorias
app.put('/categoria/:id', VerificaToken, (req, res) => {

  let id = req.params.id;
  console.log(id);
  let descCategoria = {
    descripcion: req.body.descripcion
  }

  Categoria.findByIdAndUpdate(id, descCategoria, {
    new: true,
    runValidators: true
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
        err
      })
    }

    return res.status(200).json({
      ok: true,
      categorias: data
    })
  });

});

// Borra una Categoria
app.delete('/categoria/:id', [VerificaToken, VerificaAdminRole], (req, res) => {
  // solo admin borra

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, data) => {
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
          message: 'El ID no existe'
        }
      })
    }

    return res.status(200).json({
      ok: true,
      message: 'Categoria borrada'
    })
  })

});

module.exports = app;
