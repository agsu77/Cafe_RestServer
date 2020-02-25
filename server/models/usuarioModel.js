const mongo = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongo.Schema;

rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

let Usuarioschema = new Schema({
    nombre:{
        type: String,
        required : [true, 'El nombre es necesario']
    },
    email:{
        type : String,
        unique: true,
        required : [true, 'El correo es necesario']
    },
    password:{
        type: String,
        required : [true, 'La password es obligatoria']
    },
    img:{
        type : String,
        required: false
    },
    role:{
        type : String,
        default : 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type : Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default:false
    }

});

Usuarioschema.methods.toJSON = function(){
    let user = this.toObject();
    delete user.password;
    delete user.estado;

    return user;
}

Usuarioschema.plugin( uniqueValidator, { message:'{PATH} debe ser unico.' } );

module.exports = mongo.model('Usuario', Usuarioschema);
