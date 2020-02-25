
const jwt = require('jsonwebtoken');
let usuario = null;

// =======================
//    Verificar token
// =======================

let VerificaToken = ( req, res, next ) => {

    let token = req.get('token'); // saco header del require

    jwt.verify( token, process.env.SEED , (err, decoded) =>{

      if(err){
        return res.status(401).json({
          ok:false,
          err: 'Token no valido'
        });
      }
      // Seteo el Usuario al request
      req.usuario = decoded.usuario;
      next();

    } );

};

// =======================
//   Verificar UserRole
// =======================

let VerificaAdminRole = (req, res, next) => {
  let role = req.usuario.role;
  if( role != 'ADMIN_ROLE' ){
    return res.status(401).json({
      ok:false,
      err: 'El usuario no es administrador'
    });
  }
  next();
}

// ======================
//  Verifica Token por URL
// ======================
let VerificaTokenImg = (req, res, next) => {


  let token = req.query.token;
  
  jwt.verify( token, process.env.SEED , (err, decoded) =>{

    if(err){
      return res.status(401).json({
        ok:false,
        err: 'Token no valido'
      });
    }
    // Seteo el Usuario al request
    req.usuario = decoded.usuario;
    next();

  } );

}


module.exports = {
  VerificaToken,
  VerificaAdminRole,
  VerificaTokenImg
}
