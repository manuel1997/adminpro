const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol valido'
}

const usuarioSchema = new Schema({

    nombre:{type:String,required:[true,'el nombre es necesario']},
    email:{type:String, unique:true, required:[true,'el correo es necesario']},
    password:{type:String,required:[true,'la contrasena es necesaria']},
    img:{type:String,required:false},
    role:{type:String,required:true, default:'USER_ROLE', enum:rolesValidos},
    google:{type:Boolean,default:false}

});

usuarioSchema.plugin( uniqueValidator,{message:'{PATH} debe de ser unico'})
module.exports = mongoose.model('Usuario',usuarioSchema);