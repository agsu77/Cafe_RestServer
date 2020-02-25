const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

//modelos BD
const Usuario = require('../models/usuarioModel');
const Producto = require('../models/productoModel');

// pone todos los uploads en REQ.files
app.use(fileUpload({ useTempFiles : true, }) );


app.put('/upload/:tipo/:id', (req, res) => {

  let paramTipo = req.params.tipo;
  let paramID = req.params.id;

  if(!req.files){
    return res.status(400).json({
      ok: false,
      err : {
        message: 'No se ha seleccionado ningun archivo'
      }
    })
  }

  //Validar Tipo
  let tiposValidos = ['productos', 'usuarios'];

  if( tiposValidos.indexOf( paramTipo ) < 0  ){
    return res.status(400).json({
      ok: false,
      err : {
        message : 'Los tipos validos son : '+ tiposValidos.join(', ')
      }
    })
  }

  let archivo = req.files.archivo;

  let nombreExtencionArchivo = archivo.name.split('.');

  let extencionArchivo = nombreExtencionArchivo[ nombreExtencionArchivo.length -1 ];

  //extenciones permitidas
  let extencionesValidas = ['png','jpg','gif', 'jpeg']

  if(extencionesValidas.indexOf( extencionArchivo ) < 0 ){
    return res.status(400).json({
      ok: false,
      err : {
        message : 'Las extenciones permitidas son :' + extencionesValidas.join(', ')
      },
      extencion : extencionArchivo
    })
  }

  //cambio nombre de archivo
  let nombreArchivo = `${paramID}${ new Date().getMilliseconds()}_${ new Date().getTime()}.${extencionArchivo}`

  
  archivo.mv(`uploads/${paramTipo}/${nombreArchivo}`, (err)=>{
    if(err){
      return res.status(500).json({
        ok : false,
        err
      })
    }
  });


  if( paramTipo === 'usuarios'){
    
    imagenUsuario( paramID, res, nombreArchivo );
  }else{
    imagenProducto( paramID, res, nombreArchivo );
  }
  
})

function imagenUsuario( id, res, nombreArchivo ){

    Usuario.findById(id, (err, usuarioDB) =>{

        if(err){
          borrarArchivo(nombreArchivo,'usuarios')
          return res.status(500).json({
            ok: false,
            err
          })
        }

        if(!usuarioDB){
          return res.status(400).json({
            ok: false,
            err:{
              message: 'El usuario no existe'
            }
          })
        }

       
        borrarArchivo( usuarioDB.img , 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, UsuarioDB)=>{
          
          res.json({
            ok:true,
            usuario : usuarioDB,
            img : nombreArchivo
          })

        })

    })

}

function imagenProducto( id, res, nombreArchivo){

  Producto.findById(id, (err, productoDB)=>{

      if(err){
        borrarArchivo(nombreArchivo, 'productos')
        res.status(500).json({
          ok:false,
          err
        })
      }

      if(!productoDB){
        borrarArchivo(nombreArchivo, 'productos')
        res.status(400).json({
          ok: false,
          err:{
            message: 'El producto no existe'
          }
        })
      }

      console.log(productoDB.img);
      
      borrarArchivo( productoDB.img , 'productos' );

      productoDB.img = nombreArchivo;

      productoDB.save( (err, productoDB)=>{
        if(err){
          res.status(500).json({
            ok:false,
            err
          })
        }

        res.status(200).json({
          ok:true,
          producto: productoDB,
          img : nombreArchivo
        })
      })

  })

}

function borrarArchivo( nombreArchivo, tipo ){

  let pathUrl = path.resolve( __dirname, `../../uploads/${tipo}/${nombreArchivo}`  );

  if( fs.existsSync( pathUrl ) ){
    fs.unlinkSync( pathUrl );
  }else{
    console.log('ACA no borro');
    
  }

}

module.exports = app;
