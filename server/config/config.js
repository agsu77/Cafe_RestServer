//=================================
//      Puerto Automatico
//=================================
process.env.PORT = process.env.PORT || 3000 ;



// ===============================
//         ENTORNO
// ==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//      Base de datos
// =============================

let urlBD;

if( process.env.NODE_ENV === 'dev' ){
  urlBD = 'mongodb://localhost:27017/cafe';
}else {
  urlBD = process.env.mongo_URI;
}

process.env.URLDB = urlBD;

// ==========================
//    Vencimiento del Token
// ==========================
// 60 Segundos
// 60 Minutos
// 1 Hora
// 1 dia
  process.env.CADUCIDAD_TOKEN = '48h';


// ===============================
//      Seed de Auth.
// ===============================
process.env.SEED = process.env.SEED_PRODUCTION || 'este-es-seed-desarrollo';
