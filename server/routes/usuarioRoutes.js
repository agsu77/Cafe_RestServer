
const express = require('express')
const app = express()

const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../models/usuarioModel');

const { VerificaToken , VerificaAdminRole } = require('../middlewares/autenticacion');

// mostrar lista de usuarios
app.get('/usuario', VerificaToken ,(req, res) => {



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let cantidad = 0;

    Usuario.find({ estado : true },'nombre email')
      .skip(desde).limit(limite).exec( (err,usuarios) => {


      if(err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      cantidad = Usuario.count({ estado:true },(err,conteo)=>{

        res.json({
          ok: true,
          cantidad:conteo,
          usuarios
        });

      });


    });

  })

// Agregar un usuario
  app.post('/usuario', [VerificaToken, VerificaAdminRole] , function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
      nombre: body.nombre,
      email : body.email,
      password: bcrypt.hashSync( body.password, 10 ) ,
      role: body.role
    })

    usuario.save( (err,usuarioDB)=>{

      if(err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      res.json({
        ok: true,
        usuario : usuarioDB
      })

    })


  })

// Modificar un usuario
  app.put('/usuario/:id', [VerificaToken, VerificaAdminRole] ,function (req, res) {

    let id = req.params.id;
    let body =  _.pick(req.body, ['nombre','email','img','role']);

    Usuario.findByIdAndUpdate(id, body, {new:true,runValidators:true}, (err, usuarioDB)=>{
      if(err){
        return res.status(400).json({
          ok: false,
          err
        })
      }


      res.json({
        ok: true,
        usuario : usuarioDB
      })

    })
  })

// Borrar un usuario
  app.delete('/usuario/:id', [VerificaToken, VerificaAdminRole] ,function (req, res) {

      let id = req.params.id;
      let cambiaEstado = {
        estado : false
      }

    //  Usuario.findByIdAndRemove(usuario,(err, usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioBorrado)=>{
        if(err){
          return res.status(400).json({
            ok: false,
            err
          })
        }

      if (!usuarioBorrado) {
        return res.status(400).json({
          ok: false,
          error :{
            message : 'Usuario no encontrado'
          }
        });
      }

      res.json({
        ok: true,
        usuario : usuarioBorrado
      })
    });

  })


  module.exports = app;
